package api.database.controller.scenario;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.scenario.Scenario;
import api.database.repository.scenario.ScenarioRepository;
import jakarta.transaction.Transactional;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import utils.BaseIntegrationTest;

class ScenarioControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private ScenarioRepository scenarioRepository;

  @Test
  public void testGetAllScenarios() throws Exception {
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/scenario/get_all_scenarios.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/scenarios").contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetScenarioById() throws Exception {
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/scenario/get_one_scenario.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/scenarios/1").contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetScenarioByIdNotFoundError() throws Exception {
    String expectedBody =
      "{\"errorCode\":\"DOES_NOT_EXIST\",\"errorGroup\":\"SCENARIO\"}";

    getMockMvc()
      .perform(
        get("/api/scenarios/100").contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isNotFound())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(content().json(expectedBody));
  }

  @Test
  public void getGetScenariosByTitle() throws Exception {
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/scenario/get_by_title.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/scenarios/search/findByTitle")
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
  public void testGetScenariosByDescription() throws Exception {
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/scenario/get_by_description.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/scenarios/search/findByDescription")
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
  @Transactional
  public void testAddScenario() throws Exception {
    Scenario newScenario = addScenarioSampleScenario(
      "New Scenario",
      "A new test scenario",
      "Test Context",
      "Test Purpose",
      OffsetDateTime.parse("2024-12-10T10:00:00+00:00"),
      OffsetDateTime.parse("2024-12-11T10:00:00+00:00"),
      100,
      "min"
    );

    String request = getObjectMapper().writeValueAsString(newScenario);

    String response = getMockMvc()
      .perform(
        post("/api/scenarios")
          .with(jwt().jwt(jwt -> jwt.subject("1")))
          .contentType(MediaType.APPLICATION_JSON)
          .content(request)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    Scenario returnedScenario = getObjectMapper()
      .readValue(response, Scenario.class);

    assertNotNull(returnedScenario.getId());
    assertEquals("New Scenario", returnedScenario.getTitle());
    assertEquals("A new test scenario", returnedScenario.getDescription());
    assertEquals("Test Context", returnedScenario.getContext());
    assertEquals("Test Purpose", returnedScenario.getPurpose());
    assertEquals(
      OffsetDateTime.parse("2024-12-10T10:00:00+00:00"),
      returnedScenario.getStartDate()
    );
    assertEquals(
      OffsetDateTime.parse("2024-12-11T10:00:00+00:00"),
      returnedScenario.getEndDate()
    );
    assertEquals(100, returnedScenario.getEventDuration().intValue());
    assertEquals("min", returnedScenario.getEventUnit());
  }

  @Test
  @Transactional
  public void testUpdateScenario() throws Exception {
    Scenario updatedScenario = addScenarioSampleScenario(
      "UPDATED TITLE",
      "UPDATED DESCRIPTION",
      "UPDATED CONTEXT",
      "UPDATED PURPOSE",
      OffsetDateTime.parse("2024-12-01T10:00:00+00:00"),
      OffsetDateTime.parse("2024-12-02T10:00:00+00:00"),
      120,
      "min"
    );

    String updatedScenarioJson = getObjectMapper()
      .writeValueAsString(updatedScenario);

    String response = getMockMvc()
      .perform(
        put("/api/scenarios/1")
          .contentType(MediaType.APPLICATION_JSON)
          .content(updatedScenarioJson)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    Scenario returnedScenario = getObjectMapper()
      .readValue(response, Scenario.class);

    assertNotNull(returnedScenario.getId());
    assertEquals("UPDATED TITLE", returnedScenario.getTitle());
    assertEquals("UPDATED DESCRIPTION", returnedScenario.getDescription());
    assertEquals("UPDATED CONTEXT", returnedScenario.getContext());
    assertEquals("UPDATED PURPOSE", returnedScenario.getPurpose());
    assertEquals(
      OffsetDateTime.parse("2024-12-01T10:00:00+00:00"),
      returnedScenario.getStartDate()
    );
    assertEquals(
      OffsetDateTime.parse("2024-12-02T10:00:00+00:00"),
      returnedScenario.getEndDate()
    );
    assertEquals(120, returnedScenario.getEventDuration().intValue());
    assertEquals("min", returnedScenario.getEventUnit());
  }

  @Test
  @Transactional
  public void testDeleteScenario() throws Exception {
    Scenario scenarioToDelete = addScenarioSampleScenario(
      "Scenario to Delete",
      "This scenario will be deleted",
      "Delete Context",
      "Delete Purpose",
      OffsetDateTime.parse("2024-12-10T10:00:00+00:00"),
      OffsetDateTime.parse("2024-12-11T10:00:00+00:00"),
      90,
      "min"
    );

    scenarioToDelete = scenarioRepository.save(scenarioToDelete);
    boolean exists = scenarioRepository.existsById(scenarioToDelete.getId());
    assertTrue(exists, "Scenario was not added to the database");

    getMockMvc()
      .perform(delete("/api/scenarios/" + scenarioToDelete.getId()))
      .andExpect(status().isOk());

    exists = scenarioRepository.existsById(scenarioToDelete.getId());
    assertFalse(exists, "Scenario was not deleted from the database");
  }

  @Test
  public void testOverridePaginationArguments() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/scenario/get_pagination_override.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/scenarios")
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

  private Scenario addScenarioSampleScenario(
    String title,
    String description,
    String context,
    String purpose,
    OffsetDateTime startDate,
    OffsetDateTime endDate,
    int eventDuration,
    String eventUnit
  ) {
    Scenario scenario = new Scenario();
    scenario.setTitle(title);
    scenario.setDescription(description);
    scenario.setContext(context);
    scenario.setPurpose(purpose);
    scenario.setStartDate(startDate);
    scenario.setEndDate(endDate);
    scenario.setEventDuration(eventDuration);
    scenario.setEventUnit(eventUnit);
    return scenario;
  }
}
