package api.database.controllers;

//Do zmiany!! Prawdopodobnie będzie Spring Security

import api.database.classes.user.QdsUserInfo;
import api.database.classes.user.QdsUserInfoWithSession;
import api.database.classes.user.QdsUserLoginInfo;
import api.database.classes.user.QdsUserRegisterInfo;
import api.database.services.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

  @Autowired
  private UserService userService;

  @PostMapping("/register")
  public String registerUser(
    @Valid @RequestBody QdsUserRegisterInfo qdsUserRegisterInfo
  ) {
    return userService.registerUser(qdsUserRegisterInfo);
  }

  @GetMapping("/activate-account/{token}")
  public String activateAccount(@PathVariable String token) {
    return userService.activateAccount(token);
  }

  @PostMapping("/login")
  public QdsUserInfoWithSession login(
    @RequestBody QdsUserLoginInfo qdsUserLoginInfo
  ) {
    return userService.login(qdsUserLoginInfo);
  }

  @GetMapping("/logout")
  public String logout(@RequestHeader(name = "SID") String session) {
    return userService.logout(session);
  }

  // Endpoint do pobierania listy użytkowników
  @GetMapping("/list")
  public List<QdsUserInfo> getUsersList() {
    return userService.getUsersList();
  }
  //  //  Endpoint pobieranie użytkownika
  //  @GetMapping("/{id}")
  //  public QdsUserInfo getUserById(@PathVariable Integer id) {
  //    return userService.getUserById(id);
  //  }

}
