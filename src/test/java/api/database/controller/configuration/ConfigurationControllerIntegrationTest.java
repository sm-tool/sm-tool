package api.database.controller.configuration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class ConfigurationControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  public void testGetConfigurationForUser() throws Exception {
    String configurationName = "Configuration for User";

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/configuration/get_by_user.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/configuration/user")
          .with(jwt().jwt(jwt -> jwt.subject("1")))
          .param("name", configurationName)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetConfigurationForScenario() throws Exception {
    String configurationName = "Configuration for Scenario";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/configuration/get_by_scenario.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/configuration/scenario")
          .header("scenarioId", 1)
          .param("name", configurationName)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetConfigurationForUserAndScenario() throws Exception {
    String configurationName = "Configuration for User and Scenario";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/configuration/get_by_scenario_and_user.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/configuration/scenario/user")
          .header("scenarioId", 1)
          .with(jwt().jwt(jwt -> jwt.subject("1")))
          .param("name", configurationName)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }
}
