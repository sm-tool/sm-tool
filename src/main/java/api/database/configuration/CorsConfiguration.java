package api.database.configuration;

import java.util.Arrays;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableConfigurationProperties(CorsProperties.class)
public class CorsConfiguration {

  private final CorsProperties corsProperties;

  public CorsConfiguration(CorsProperties corsProperties) {
    this.corsProperties = corsProperties;
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    org.springframework.web.cors.CorsConfiguration configuration =
      new org.springframework.web.cors.CorsConfiguration();
    configuration.setAllowedOrigins(
      Arrays.asList(corsProperties.getAllowedOrigins().split(","))
    );
    configuration.setAllowedMethods(
      Arrays.asList(corsProperties.getAllowedMethods().split(","))
    );
    configuration.setAllowedHeaders(
      Arrays.asList(corsProperties.getAllowedHeaders().split(","))
    );
    configuration.setExposedHeaders(
      Arrays.asList(
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials"
      )
    );
    configuration.setAllowCredentials(corsProperties.isAllowCredentials());
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source =
      new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
