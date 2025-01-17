package api.database.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
@EnableScheduling
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/topic");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    //TODO podać poprawne origins
    registry
      .addEndpoint("/ws")
      .setAllowedOrigins(
        "http://nginx",
        "http://nginx:80",
        "http://localhost:9000",
        "http://localhost:6006",
        "http://localhost"
      );
  }
}
