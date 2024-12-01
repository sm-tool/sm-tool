package api.database.controller.scenario;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.scenario.QdsScenarioPhase;
import api.database.repository.scenario.QdsScenarioPhaseRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

public class ScenarioPhaseControllerIntegrationTest
  extends BaseIntegrationTest {

  @Autowired
  private QdsScenarioPhaseRepository qdsScenarioPhaseRepository;

  @Test
  @Transactional
  public void testGetScenarioPhases() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/phase/get_scenario_phases.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/scenario-phase/all").header("scenarioId", scenarioId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testAddScenarioPhase() throws Exception {
    Integer scenarioId = 1;

    int initialCount = qdsScenarioPhaseRepository
      .findAllByScenarioId(scenarioId)
      .size();

    String requestBodyJson =
      """
      {
          "startTime": 400,
          "endTime": 500,
          "title": "Phase 4",
          "description": "Description of phase 4"
      }
      """;

    String responseJson = getMockMvc()
      .perform(
        post("/api/scenario-phase/add")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBodyJson)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    QdsScenarioPhase newScenarioPhase = getObjectMapper()
      .readValue(responseJson, QdsScenarioPhase.class);

    int newCount = qdsScenarioPhaseRepository
      .findAllByScenarioId(scenarioId)
      .size();

    assertEquals(initialCount + 1, newCount);
    assertEquals(scenarioId, newScenarioPhase.getScenarioId());
    assertEquals(400, newScenarioPhase.getStartTime());
    assertEquals(500, newScenarioPhase.getEndTime());
    assertEquals("Phase 4", newScenarioPhase.getTitle());
    assertEquals("Description of phase 4", newScenarioPhase.getDescription());
  }

  @Test
  @Transactional
  public void testDeleteScenarioPhase() throws Exception {
    int initialCount = qdsScenarioPhaseRepository.findAll().size();

    getMockMvc()
      .perform(delete("/api/scenario-phase/delete/1"))
      .andExpect(status().isNoContent());

    int newCount = qdsScenarioPhaseRepository.findAll().size();

    assertEquals(
      initialCount - 1,
      newCount,
      "The count of scenario phases should decrease by 1 after deletion."
    );

    assertFalse(qdsScenarioPhaseRepository.findById(1).isPresent());
  }
}
