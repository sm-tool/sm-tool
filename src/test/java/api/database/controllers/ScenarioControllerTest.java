package api.database.controllers;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import api.database.classes.user.QdsUserInfo;
import api.database.classes.user.QdsUserRegisterInfo;
import api.database.repositories.QdsUserRepository;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import pl.smt.SmtApp;

@Testcontainers
@ActiveProfiles("test")
@SpringBootTest(classes = SmtApp.class)
public class ScenarioControllerTest {

  @Autowired
  public QdsUserRepository userRepository;

  @Autowired
  private DataSource dataSource;

  @Container
  static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>(
    "postgres:15"
  )
    .withDatabaseName("test_db")
    .withUsername("test_user")
    .withPassword("test_password")
    .withReuse(false);

  @BeforeAll
  public static void setup() throws SQLException {
    postgreSQLContainer.start();

    System.setProperty(
      "spring.datasource.url",
      postgreSQLContainer.getJdbcUrl()
    );
    System.setProperty(
      "spring.datasource.username",
      postgreSQLContainer.getUsername()
    );
    System.setProperty(
      "spring.datasource.password",
      postgreSQLContainer.getPassword()
    );

    try (Connection connection = postgreSQLContainer.createConnection("")) {
      ScriptUtils.executeSqlScript(
        connection,
        new FileSystemResource(
          Paths.get("src/test/resources/init_pgcrypto.sql")
        )
      );
    } catch (Exception e) {
      throw new RuntimeException("Error executing SQL script", e);
    }
  }

  @Test
  public void sampleTest() {
    QdsUserRegisterInfo newUser = new QdsUserRegisterInfo(
      "test@example.com",
      "password123",
      "John",
      "Doe"
    );

    String token = userRepository.registerUser(newUser);
    assertNotNull(token, "Token should not be null after registration");

    List<QdsUserInfo> users = userRepository.getUsers();
    assertEquals(1, users.size(), "List size should be 1 after registration");

    QdsUserInfo registeredUser = users.get(0);
    assertEquals(
      "test@example.com",
      registeredUser.email(),
      "Email should match"
    );
    assertEquals("John", registeredUser.firstName(), "First name should match");
    assertEquals("Doe", registeredUser.lastName(), "Last name should match");
  }

  @TestConfiguration
  static class TestConfig {

    @Bean
    public DataSource dataSource() {
      return DataSourceBuilder.create()
        .url(postgreSQLContainer.getJdbcUrl())
        .username(postgreSQLContainer.getUsername())
        .password(postgreSQLContainer.getPassword())
        .driverClassName("org.postgresql.Driver")
        .build();
    }
  }
}
