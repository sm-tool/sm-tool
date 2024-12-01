package pl.smt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "api" })
@EntityScan(basePackages = "api.database.entity")
public class SmtApp {

  private static final Logger LOGGER = LoggerFactory.getLogger(SmtApp.class);
  private static final int ERROR_EXIT_CODE = 1;

  public SmtApp() {
    // Public constructor required by Spring
  }

  public static void main(final String[] args) {
    try {
      LOGGER.info("Starting SMT application...");
      SpringApplication.run(SmtApp.class, args);
      LOGGER.info("SMT application started successfully");
    } catch (Exception e) {
      handleGeneralError(e);
    }
  }

  private static void handleGeneralError(final Exception e) {
    LOGGER.error("Unexpected error during application startup", e);
    System.err.println(
      "Critical error occurred during application startup - most likely the database cannot be reach"
    );
    System.exit(ERROR_EXIT_CODE);
  }
}
