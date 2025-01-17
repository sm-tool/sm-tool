package api.database.configuration;

import api.database.interceptor.PermissionInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebMvc
@Configuration
public class MvcConfiguration implements WebMvcConfigurer {

  private final PermissionInterceptor permissionInterceptor;

  @Autowired
  public MvcConfiguration(PermissionInterceptor permissionInterceptor) {
    super();
    this.permissionInterceptor = permissionInterceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(permissionInterceptor);
  }
}
