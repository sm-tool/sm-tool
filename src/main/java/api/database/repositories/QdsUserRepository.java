package api.database.repositories;

//Raczej do zmiany na Spring Security

import api.database.classes.mappers.QdsUserInfoRowMapper;
import api.database.classes.mappers.QdsUserInfoWithSessionRowMapper;
import api.database.classes.user.QdsUserInfo;
import api.database.classes.user.QdsUserInfoWithSession;
import api.database.classes.user.QdsUserLoginInfo;
import api.database.classes.user.QdsUserRegisterInfo;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class QdsUserRepository {

  private final JdbcTemplate jdbcTemplate;

  public QdsUserRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  //---------------------------------------Rejestracja

  //Zarejestruj użytkownika - zwraca token do potwierdzenia rejestracji
  public String registerUser(QdsUserRegisterInfo user) {
    String sql = "SELECT * FROM user_register(?,?,?,?)";
    return jdbcTemplate.queryForObject(
      sql,
      String.class,
      user.email(),
      user.password(),
      user.firstName(),
      user.lastName()
    );
  }

  //Potwierdzenie rejestracji
  public String activateUser(String token) {
    String sql = "SELECT * FROM user_activate_account(?)";
    return jdbcTemplate.queryForObject(sql, String.class, token);
  }

  //---------------------------------------Logowanie

  //Zwraca parę - token + informacje o użytkowniku
  public QdsUserInfoWithSession login(QdsUserLoginInfo loginInfo) {
    String sql =
      "SELECT session_token, first_name, last_name, email, avatar FROM user_login(?, ?)";
    return jdbcTemplate.queryForObject(
      sql,
      new QdsUserInfoWithSessionRowMapper(),
      loginInfo.email(),
      loginInfo.password()
    );
  }

  public String logout(String session) {
    String sql = "SELECT * FROM user_logout(?)";
    return jdbcTemplate.queryForObject(sql, String.class, session);
  }

  //Pobierz listę - dla autora scenariusza do uprawnień - tylko zalogowani
  public List<QdsUserInfo> getUsers() {
    String sql =
      "SELECT first_name, last_name, email, avatar FROM user_get_list()";
    return jdbcTemplate.query(sql, new QdsUserInfoRowMapper());
  }
  //  //Pobierz użytkownika po emailu - po zmianie
  //  public QdsUserInfo getUserByEmail(String email) {
  //    String sql =
  //      "SELECT first_name, last_name, email, avatar FROM user_get_list() WHERE email = ?";
  //    return jdbcTemplate.queryForObject(sql, new QdsUserInfoRowMapper(), email);
  //  }
}
