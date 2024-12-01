package api.database.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RestConfiguration implements RepositoryRestConfigurer {

  @Override
  public void configureRepositoryRestConfiguration(
    RepositoryRestConfiguration config,
    CorsRegistry cors
  ) {
    config.setBasePath("/api");
    config.setDefaultPageSize(10);
    config.setMaxPageSize(20);
    config.setReturnBodyForPutAndPost(true);

    config.setDefaultMediaType(MediaType.APPLICATION_JSON);
    config.useHalAsDefaultJsonMediaType();
    cors
      .addMapping("/api/**")
      .allowedOrigins("*")
      .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTION");
  }
}
