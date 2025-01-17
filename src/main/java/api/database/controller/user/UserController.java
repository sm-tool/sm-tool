package api.database.controller.user;

import api.database.entity.user.User;
import api.database.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/me")
  public User getCurrentUser(Authentication authentication) {
    return userService.getCurrentUser(authentication);
  }

  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/assign/{objectId}")
  public void assignUserToObject(
    @PathVariable("objectId") Integer objectId,
    Authentication authentication
  ) {
    userService.assignUserToObject(objectId, authentication);
  }

  @ResponseStatus(HttpStatus.OK)
  @DeleteMapping("/assign/{objectId}")
  public void unassignUserFromObject(
    @PathVariable Integer objectId,
    Authentication authentication
  ) {
    userService.unassignUserFromObject(objectId, authentication);
  }
}
