package api.database.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {

  private String allowedOrigins = "";
  private String allowedMethods = "GET,POST,PUT,DELETE,OPTIONS";
  private String allowedHeaders = "Authorization,Content-Type";
  private boolean allowCredentials = false;
}
