package api.database.service.user;

import api.database.entity.user.QdsUser;
import api.database.model.constant.QdsUserRoleType;
import api.database.repository.user.QdsUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KeycloakAuthenticationSuccessHandler
  extends SimpleUrlAuthenticationSuccessHandler {

  private final QdsUserRepository userRepository;

  @Override
  public void onAuthenticationSuccess(
    HttpServletRequest request,
    HttpServletResponse response,
    Authentication authentication
  ) throws IOException, ServletException {
    if (!(authentication.getPrincipal() instanceof Jwt jwt)) {
      return;
    }

    String userId = jwt.getSubject();
    Boolean emailVerified = jwt.getClaimAsBoolean("email_verified");

    if (emailVerified && !userRepository.existsById(userId)) {
      QdsUser user = new QdsUser();
      user.setId(userId);
      user.setEmail(jwt.getClaimAsString("email"));
      user.setFirstName(jwt.getClaimAsString("given_name"));
      user.setLastName(jwt.getClaimAsString("family_name"));

      List<String> roles = jwt.getClaimAsStringList("roles");
      user.setRole(
        roles != null && roles.contains("ADMIN")
          ? QdsUserRoleType.ADMIN
          : QdsUserRoleType.USER
      );

      userRepository.save(user);
    }

    super.onAuthenticationSuccess(request, response, authentication);
  }
}
