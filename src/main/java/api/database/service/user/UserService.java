package api.database.service.user;

import api.database.entity.user.QdsUser;
import api.database.repository.user.QdsUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final QdsUserRepository userRepository;

  public QdsUser getCurrentUser(Authentication authentication) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    return userRepository
      .findById(jwt.getSubject())
      .orElseThrow(() -> new RuntimeException("User not found"));
  }
}
