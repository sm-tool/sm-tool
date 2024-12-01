package api.database.controller.user;

import api.database.entity.user.QdsUser;
import api.database.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/me")
  public QdsUser getCurrentUser(Authentication authentication) {
    return userService.getCurrentUser(authentication);
  }
}
