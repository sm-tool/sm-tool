package api.database.controller.scenario;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.transaction.Transactional;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.Customization;
import org.skyscreamer.jsonassert.JSONAssert;
import org.skyscreamer.jsonassert.JSONCompareMode;
import org.skyscreamer.jsonassert.comparator.CustomComparator;
import org.springframework.http.MediaType;
import utils.BaseIntegrationTest;

class ScenarioControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  public void testGetAllScenarios() throws Exception {
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/scenario/get_all_scenarios.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/scenario/list").contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testFilterScenariosByTitle() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/scenario/filter_scenarios_by_title.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/scenario/search/findByTitle")
          .param("title", "test2")
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testFilterScenariosByDescription() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/scenario/filter_by_description.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/scenario/search/findByDescription")
          .param("description", "chat gubi kontekst2")
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testOverridePaginationArguments() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/scenario/scenario_pagination_override.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/scenario/list")
          .param("page", "1")
          .param("size", "1")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testUpdateScenario() throws Exception {
    String updatedScenarioJson =
      """
      {
          "title": "UPDATED TITLE",
          "description": "UPDATED DESCRIPTION",
          "context": "UPDATED CONTEXT",
          "purpose": "UPDATED PURPOSE",
          "startDate": "2024-12-01T10:00:00Z",
          "endDate": "2024-12-02T10:00:00Z",
          "eventDuration": 120
      }
      """;

    getMockMvc()
      .perform(
        put("/api/scenario/1")
          .contentType(MediaType.APPLICATION_JSON)
          .content(updatedScenarioJson)
      )
      .andExpect(status().isOk());

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/scenario/updated_scenario.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/scenario/one")
          .header("scenarioId", 1)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(
      expectedJson,
      actualJson,
      new CustomComparator(
        JSONCompareMode.LENIENT,
        new Customization("creationDate", (o1, o2) -> true),
        new Customization("lastModificationDate", (o1, o2) -> true)
      )
    );
  }
}
