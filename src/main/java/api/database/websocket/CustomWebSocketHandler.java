package api.database.websocket;

import api.database.websocket.model.CachedMessage;
import api.database.websocket.model.MessageType;
import api.database.websocket.model.PrioritizedMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.zip.GZIPOutputStream;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {

  private final Map<String, Map<String, WebSocketSession>> sessions =
    new ConcurrentHashMap<>();
  private final Map<String, List<CachedMessage>> messageCache =
    new ConcurrentHashMap<>();
  private final PriorityQueue<PrioritizedMessage> messageQueue =
    new PriorityQueue<>();
  private final Map<String, Integer> reconnectAttempts =
    new ConcurrentHashMap<>();
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final CircuitBreakerRegistry circuitBreakerRegistry;

  public CustomWebSocketHandler(CircuitBreakerRegistry circuitBreakerRegistry) {
    this.circuitBreakerRegistry = circuitBreakerRegistry;
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session)
    throws Exception {
    String scenarioId = extractScenarioId(session);
    String sessionId = extractSessionId(session);
    sessions
      .computeIfAbsent(scenarioId, k -> new ConcurrentHashMap<>())
      .put(sessionId, session);
    reconnectAttempts.put(sessionId, 0);
  }

  @Override
  public void afterConnectionClosed(
    WebSocketSession session,
    CloseStatus status
  ) throws Exception {
    String scenarioId = extractScenarioId(session);
    String sessionId = extractSessionId(session);
    removeSession(scenarioId, sessionId);
  }

  @Override
  protected void handleTextMessage(
    WebSocketSession session,
    TextMessage message
  ) throws Exception {
    // Handle incoming messages if needed
  }

  private String extractScenarioId(WebSocketSession session) {
    return session.getUri().getQuery().split("scenarioId=")[1].split("&")[0];
  }

  private String extractSessionId(WebSocketSession session) {
    return session.getId();
  }

  private void removeSession(String scenarioId, String sessionId) {
    Map<String, WebSocketSession> scenarioSessions = sessions.get(scenarioId);
    if (scenarioSessions != null) {
      scenarioSessions.remove(sessionId);
      if (scenarioSessions.isEmpty()) {
        sessions.remove(scenarioId);
      }
    }
    reconnectAttempts.remove(sessionId);
  }

  @CircuitBreaker(name = "broadcast", fallbackMethod = "fallbackBroadcast")
  public void broadcast(
    String scenarioId,
    Object message,
    MessageType type,
    int priority
  ) {
    messageQueue.offer(
      new PrioritizedMessage(scenarioId, message, type, priority)
    );
  }

  public void fallbackBroadcast(
    String scenarioId,
    Object message,
    MessageType type,
    int priority,
    Throwable t
  ) {
    System.err.println(
      "Broadcast failed, circuit is open. Error: " + t.getMessage()
    );
  }

  @Scheduled(fixedRate = 100)
  protected void processBroadcastQueue() {
    while (!messageQueue.isEmpty()) {
      PrioritizedMessage pm = messageQueue.poll();
      Map<String, WebSocketSession> scenarioSessions = sessions.get(
        pm.getScenarioId()
      );
      if (scenarioSessions != null) {
        scenarioSessions.forEach((sessionId, session) -> {
          try {
            String jsonMessage = objectMapper.writeValueAsString(
              Map.of("type", pm.getType(), "content", pm.getMessage())
            );
            byte[] compressedMessage = compress(jsonMessage);
            session.sendMessage(new BinaryMessage(compressedMessage));
            reconnectAttempts.put(sessionId, 0);
          } catch (IOException e) {
            handleReconnection(pm.getScenarioId(), sessionId, session);
          }
        });
      }
      cacheMessage(pm.getScenarioId(), pm.getMessage(), pm.getType());
    }
  }

  private void handleReconnection(
    String scenarioId,
    String sessionId,
    WebSocketSession session
  ) {
    int attempts = reconnectAttempts.getOrDefault(sessionId, 0);
    if (attempts < 3) {
      reconnectAttempts.put(sessionId, attempts + 1);
      try {
        session.sendMessage(new TextMessage("Attempting to reconnect..."));
      } catch (IOException e) {
        removeSession(scenarioId, sessionId);
      }
    } else {
      removeSession(scenarioId, sessionId);
    }
  }

  private byte[] compress(String str) throws IOException {
    ByteArrayOutputStream obj = new ByteArrayOutputStream();
    GZIPOutputStream gzip = new GZIPOutputStream(obj);
    gzip.write(str.getBytes("UTF-8"));
    gzip.close();
    return obj.toByteArray();
  }

  private void cacheMessage(
    String scenarioId,
    Object message,
    MessageType type
  ) {
    List<CachedMessage> scenarioCache = messageCache.computeIfAbsent(
      scenarioId,
      k -> new ArrayList<>()
    );
    scenarioCache.add(
      new CachedMessage(message, type, System.currentTimeMillis())
    );
    if (scenarioCache.size() > 100) {
      scenarioCache.remove(0);
    }
  }

  public List<CachedMessage> getReplayMessages(
    String scenarioId,
    long fromTimestamp
  ) {
    return messageCache
      .getOrDefault(scenarioId, new ArrayList<>())
      .stream()
      .filter(m -> m.getTimestamp() >= fromTimestamp)
      .collect(Collectors.toList());
  }
}
