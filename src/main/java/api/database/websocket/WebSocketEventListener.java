package api.database.websocket;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Slf4j
@Component
public class WebSocketEventListener {

  @Autowired
  private SimpMessageSendingOperations messagingTemplate;

  @EventListener
  public void handleWebSocketConnectListener(SessionConnectedEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(
      event.getMessage()
    );
    String sessionId = headerAccessor.getSessionId();

    messagingTemplate.convertAndSendToUser(
      sessionId,
      "/queue/session",
      Map.of("sessionId", sessionId)
    );

    log.info("New session established: {}", sessionId);
  }
}
