package utils;

import api.database.entity.user.User;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.context.TestPropertySource;

@TestPropertySource(properties = "spring.sql.init.mode=never")
public class BaseUnitTest extends BaseIntegrationTest {

  @Autowired
  private ObjectManager objectManager;

  protected ObjectManager getObjectManager() {
    return objectManager;
  }

  @BeforeEach
  void setUpAuthenticationAndUser() {
    Jwt jwt = Jwt.withTokenValue("mock-token")
      .header("alg", "HS256")
      .claim("sub", "test_subject")
      .claim("scope", "USER")
      .build();

    Authentication authentication = new JwtAuthenticationToken(
      jwt,
      List.of(new SimpleGrantedAuthority("ROLE_USER"))
    );

    SecurityContext securityContext =
      SecurityContextHolder.createEmptyContext();
    securityContext.setAuthentication(authentication);
    SecurityContextHolder.setContext(securityContext);

    Integer count = getJdbcTemplate()
      .queryForObject(
        "SELECT COUNT(*) FROM qds_user WHERE id = ?",
        Integer.class,
        "test_subject"
      );

    if (count == null || count == 0) {
      User user = new User();
      user.setId("test_subject");
      user.setEmail("test_user@example.com");
      user.setFirstName("Test");
      user.setLastName("User");

      getJdbcTemplate()
        .update(
          "INSERT INTO qds_user (id, email, first_name, last_name) VALUES (?, ?, ?, ?)",
          user.getId(),
          user.getEmail(),
          user.getFirstName(),
          user.getLastName()
        );
    }
  }
}
