package api.database.controller.scenario;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.scenario.ScenarioPhase;
import api.database.model.request.save.ScenarioPhaseSaveRequest;
import api.database.repository.scenario.ScenarioPhaseRepository;
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
  private ScenarioPhaseRepository scenarioPhaseRepository;

  @Test
  public void testGetScenarioPhases() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/phase/get_by_scenario.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/scenario-phases").header("scenarioId", scenarioId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testAddScenarioPhase() throws Exception {
    Integer scenarioId = 1;

    ScenarioPhaseSaveRequest newPhase = new ScenarioPhaseSaveRequest(
      "Phase 4",
      "Description of phase 4",
      "#feffc8",
      400,
      500
    );

    String request = getObjectMapper().writeValueAsString(newPhase);

    String responseJson = getMockMvc()
      .perform(
        post("/api/scenario-phases")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(request)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    ScenarioPhase newScenarioPhase = getObjectMapper()
      .readValue(responseJson, ScenarioPhase.class);

    assertEquals(scenarioId, newScenarioPhase.getScenarioId());
    assertEquals(400, newScenarioPhase.getStartTime());
    assertEquals(500, newScenarioPhase.getEndTime());
    assertEquals("Phase 4", newScenarioPhase.getTitle());
    assertEquals("Description of phase 4", newScenarioPhase.getDescription());
  }

  @Test
  public void testAddScenarioPhaseOverlapError() throws Exception {
    Integer scenarioId = 1;

    String expectedBody =
      "{\"errorCode\":\"PHASE_OVERLAP\",\"errorGroup\":\"SCENARIO_PHASE\"}";

    ScenarioPhaseSaveRequest newPhase = new ScenarioPhaseSaveRequest(
      "Phase 4",
      "Description of phase 4",
      "#feffc8",
      100,
      200
    );

    String request = getObjectMapper().writeValueAsString(newPhase);

    getMockMvc()
      .perform(
        post("/api/scenario-phases")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(request)
      )
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(content().json(expectedBody));
  }

  @Test
  @Transactional
  public void testUpdateScenarioPhase() throws Exception {
    Integer scenarioPhaseId = 1;

    ScenarioPhaseSaveRequest newPhase = new ScenarioPhaseSaveRequest(
      "Updated Phase",
      "Updated description of phase",
      "#feffc8",
      600,
      700
    );

    String request = getObjectMapper().writeValueAsString(newPhase);

    String response = getMockMvc()
      .perform(
        put("/api/scenario-phases/" + scenarioPhaseId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(request)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    ScenarioPhase newScenarioPhase = getObjectMapper()
      .readValue(response, ScenarioPhase.class);

    assertNotNull(newScenarioPhase.getId());
    assertEquals("Updated Phase", newScenarioPhase.getTitle());
    assertEquals(
      "Updated description of phase",
      newScenarioPhase.getDescription()
    );
    assertEquals("#feffc8", newScenarioPhase.getColor());
    assertEquals(600, newScenarioPhase.getStartTime());
    assertEquals(700, newScenarioPhase.getEndTime());
  }

  @Test
  public void testUpdateScenarioPhaseOverlapError() throws Exception {
    Integer scenarioId = 1;

    String expectedBody =
      "{\"errorCode\":\"PHASE_OVERLAP\",\"errorGroup\":\"SCENARIO_PHASE\"}";

    String requestBodyJson =
      """
      {
          "startTime": 250,
          "endTime": 260,
          "title": "Phase 4",
          "description": "Description of phase 4"
      }
      """;

    getMockMvc()
      .perform(
        post("/api/scenario-phases")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBodyJson)
      )
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(content().json(expectedBody));
  }

  @Test
  @Transactional
  public void testDeleteScenarioPhase() throws Exception {
    Integer scenarioId = 1;

    Integer initialCount = scenarioPhaseRepository.findAll().size();

    getMockMvc()
      .perform(
        delete("/api/scenario-phases/1").header("scenarioId", scenarioId)
      )
      .andExpect(status().isOk());

    Integer newCount = scenarioPhaseRepository.findAll().size();

    assertEquals(initialCount - 1, newCount);

    assertFalse(scenarioPhaseRepository.findById(1).isPresent());
  }
}
