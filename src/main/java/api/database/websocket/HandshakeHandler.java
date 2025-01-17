package api.database.websocket;

import java.security.Principal;
import java.util.Map;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

public class HandshakeHandler extends DefaultHandshakeHandler {

  @Override
  protected Principal determineUser(
    ServerHttpRequest request,
    WebSocketHandler wsHandler,
    Map<String, Object> attributes
  ) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(
      (Message<?>) request
    );
    accessor.setNativeHeader("sessionId", accessor.getSessionId());
    return accessor::getSessionId;
  }
}
