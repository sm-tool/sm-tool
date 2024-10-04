package api.database.services;

import api.database.classes.user.QdsUserInfo;
import api.database.classes.user.QdsUserInfoWithSession;
import api.database.classes.user.QdsUserLoginInfo;
import api.database.classes.user.QdsUserRegisterInfo;
import api.database.repositories.QdsUserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//Do zmiany na Spring Security

@Service
public class UserService {

  private final QdsUserRepository qdsUserRepository;

  @Autowired
  public UserService(QdsUserRepository qdsUserRepository) {
    this.qdsUserRepository = qdsUserRepository;
  }

  public String registerUser(QdsUserRegisterInfo registerInfo) {
    return qdsUserRepository.registerUser(registerInfo);
  }

  public String activateAccount(String token) {
    return qdsUserRepository.activateUser(token);
  }

  public QdsUserInfoWithSession login(QdsUserLoginInfo qdsUserLoginInfo) {
    return qdsUserRepository.login(qdsUserLoginInfo);
  }

  public String logout(String session) {
    return qdsUserRepository.logout(session);
  }

  public List<QdsUserInfo> getUsersList() {
    return qdsUserRepository.getUsers();
  }
  //  public QdsUserInfo getUserById(Integer userId) {
  //    return qdsUserRepository.getUserById(userId);
  //  }
}
