package pl.smt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import pl.smt.shared.generation.domain.ExcludeFromGeneratedCodeCoverage;

@SpringBootApplication
@ExcludeFromGeneratedCodeCoverage(reason = "Not testing logs")
@ComponentScan(basePackages = { "api" })
@EntityScan(basePackages = "api.database.entities") // Tak wiem mogłem przenieść xDDD
public class SmtApp {

  private static final Logger log = LoggerFactory.getLogger(SmtApp.class);

  public static void main(String[] args) {
    try {
      SpringApplication.run(SmtApp.class, args);
    } catch (Exception exception) {
      System.err.println("Te bazunia jest wyłączona"); // mmm so proffesional
      System.exit(1);
    }
  }
}
