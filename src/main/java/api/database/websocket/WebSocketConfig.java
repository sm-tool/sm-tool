package api.database.websocket;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@EnableScheduling
public class WebSocketConfig implements WebSocketConfigurer {

  private final CircuitBreakerRegistry circuitBreakerRegistry;

  public WebSocketConfig(@Lazy CircuitBreakerRegistry circuitBreakerRegistry) {
    this.circuitBreakerRegistry = circuitBreakerRegistry;
  }

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry
      .addHandler(webSocketHandler(circuitBreakerRegistry), "/ws")
      .setAllowedOrigins("*");
  }

  @Bean
  public WebSocketHandler webSocketHandler(
    CircuitBreakerRegistry circuitBreakerRegistry
  ) {
    return new CustomWebSocketHandler(circuitBreakerRegistry);
  }

  @Bean
  @Lazy
  public CircuitBreakerRegistry circuitBreakerRegistry() {
    CircuitBreakerConfig circuitBreakerConfig = CircuitBreakerConfig.custom()
      .failureRateThreshold(50)
      .waitDurationInOpenState(Duration.ofMillis(1000))
      .permittedNumberOfCallsInHalfOpenState(2)
      .slidingWindowSize(2)
      .build();
    return CircuitBreakerRegistry.of(circuitBreakerConfig);
  }
}
