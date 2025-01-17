package api.database.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

  private final SimpMessagingTemplate messagingTemplate;

  @Autowired
  public WebSocketService(SimpMessagingTemplate messagingTemplate) {
    this.messagingTemplate = messagingTemplate;
  }

  public void broadcastGlobal(EntityDetails message) {
    messagingTemplate.convertAndSend("/topic/global", message);
  }

  public void broadcastToScenario(Integer scenarioId, EntityDetails message) {
    messagingTemplate.convertAndSend("/topic/scenario/" + scenarioId, message);
  }

  @MessageMapping("/invalidate")
  public void handleInvalidation(EntityDetails message) {
    if (message.scenarioId() == null) {
      broadcastGlobal(message);
    } else {
      broadcastToScenario(message.scenarioId(), message);
    }
  }
}
