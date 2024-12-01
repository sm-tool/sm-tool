package utils;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.Map;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;
import pl.smt.SmtApp;

@Testcontainers
@ActiveProfiles("test")
@SpringBootTest(classes = SmtApp.class)
@AutoConfigureMockMvc
@SpringJUnitConfig
public abstract class BaseIntegrationTest {

  private static PostgreSQLContainer<?> postgreSQLContainer;

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  protected MockMvc getMockMvc() {
    return mockMvc;
  }

  protected ObjectMapper getObjectMapper() {
    return objectMapper;
  }

  public static void copyFile() {
    // Ścieżka do pliku źródłowego (z katalogu main/resources)
    Path sourcePath = Paths.get("src/main/resources/db/scripts/indexes.sql");
    // Ścieżka do katalogu docelowego (test/resources)
    Path destinationPath = Paths.get("src/test/resources/indexes.sql");

    try {
      // Tworzenie katalogu docelowego, jeśli nie istnieje
      Files.createDirectories(destinationPath.getParent());
      // Kopiowanie pliku
      Files.copy(sourcePath, destinationPath, REPLACE_EXISTING);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @BeforeAll
  static void setUp() throws InterruptedException {
    copyFile();

    Thread.sleep(500);

    postgreSQLContainer = new PostgreSQLContainer<>("postgres:14")
      .withDatabaseName("test_db")
      .withUsername("test_user")
      .withPassword("test_password")
      .withReuse(false)
      .withStartupTimeout(Duration.ofMinutes(3))
      .withNetworkAliases("postgresql-master");

    postgreSQLContainer.start();
  }

  @DynamicPropertySource
  static void dynamicProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
    registry.add(
      "spring.datasource.username",
      postgreSQLContainer::getUsername
    );
    registry.add(
      "spring.datasource.password",
      postgreSQLContainer::getPassword
    );
  }

  @AfterAll
  public static void cleanUp() {
    System.out.println("CleanUp");
  }
}
