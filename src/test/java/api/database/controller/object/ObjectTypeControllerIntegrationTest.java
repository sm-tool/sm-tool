package api.database.controller.object;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.scenario.QdsScenario;
import jakarta.transaction.Transactional;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import utils.BaseIntegrationTest;

class ObjectTypeControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  public void testGetObjectTypesByScenarioId() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectType/get_scenario_object_types.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-type/scenario/{scenarioId}", 1)
          .param("page", "0")
          .param("size", "2")
          .param("sort", "title,asc")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testCreateObjectTypeAndFetchByScenario() throws Exception {
    String createObjectTypeJson =
      """
          {
              "title": "New Object Type",
              "description": "Test description",
              "color": "blue",
              "isOnlyGlobal": false
          }
      """;

    int scenarioId = 1;

    getMockMvc()
      .perform(
        post("/api/object-type")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(createObjectTypeJson)
      )
      .andExpect(status().isOk());

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectType/get_scenario_object_types_with_one_new.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-type/scenario/{scenarioId}", scenarioId)
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testCreateScenarioAndCopyObjectTypes() throws Exception {
    String newScenarioJson =
      """
      {
          "title": "Nowy Scenariusz",
          "description": "Opis nowego scenariusza",
          "context": "Kontekst",
          "purpose": "Cel",
          "startDate": "2024-02-15T23:00:00Z",
          "endDate": "2024-02-15T23:00:00Z",
          "eventDuration": 60
      }
      """;

    MvcResult createResult = getMockMvc()
      .perform(
        post("/api/scenario/add")
          .contentType(MediaType.APPLICATION_JSON)
          .content(newScenarioJson)
      )
      .andExpect(status().isOk())
      .andReturn();

    QdsScenario createdScenario = getObjectMapper()
      .readValue(
        createResult.getResponse().getContentAsString(),
        QdsScenario.class
      );
    Integer newScenarioId = createdScenario.getId();

    getMockMvc()
      .perform(
        post(
          "/api/object-type/copy/{sourceScenarioId}/to/{targetScenarioId}",
          1,
          newScenarioId
        )
      )
      .andExpect(status().isOk());

    MvcResult getResult = getMockMvc()
      .perform(
        get("/api/object-type/scenario/{scenarioId}", newScenarioId)
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn();

    String actualJson = getResult.getResponse().getContentAsString();
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectType/get_imported_scenario_object_types.json"
      )
    );

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }
}
