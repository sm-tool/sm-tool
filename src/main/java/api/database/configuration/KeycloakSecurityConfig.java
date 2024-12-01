package api.database.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class KeycloakSecurityConfig {

  private static final String[] ENDPOINT_WHITELIST = {
    "/api/v1/auth/**",
    "/v3/api-docs/**",
    "/swagger-ui/**",
    "/swagger-ui.html",
    "/webjars/**",
    "/actuator/**",
  };

  @Bean
  @Profile("prod")
  public SecurityFilterChain productionFilterChain(HttpSecurity httpSecurity)
    throws Exception {
    return httpSecurity
      .securityMatcher("/**")
      .cors(Customizer.withDefaults())
      .authorizeHttpRequests(auth ->
        auth
          .requestMatchers(ENDPOINT_WHITELIST)
          .permitAll()
          .anyRequest()
          .authenticated()
      )
      .oauth2ResourceServer(server ->
        server.jwt(jwt ->
          jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
        )
      )
      .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .csrf(AbstractHttpConfigurer::disable)
      .build();
  }

  @Bean
  @Profile("!prod")
  public SecurityFilterChain developmentFilterChain(HttpSecurity httpSecurity)
    throws Exception {
    return httpSecurity
      .securityMatcher("/**")
      .cors(Customizer.withDefaults())
      .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
      .csrf(AbstractHttpConfigurer::disable)
      .build();
  }

  @Bean
  @Profile("prod")
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter =
      new JwtGrantedAuthoritiesConverter();
    jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
    jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

    JwtAuthenticationConverter jwtAuthenticationConverter =
      new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(
      jwtGrantedAuthoritiesConverter
    );
    return jwtAuthenticationConverter;
  }
}
