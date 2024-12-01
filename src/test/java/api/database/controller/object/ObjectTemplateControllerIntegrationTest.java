package api.database.controller.object;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.object.QdsObjectTemplate;
import api.database.entity.scenario.QdsScenario;
import api.database.repository.object.QdsObjectTemplateRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

public class ObjectTemplateControllerIntegrationTest
  extends BaseIntegrationTest {

  @Autowired
  private QdsObjectTemplateRepository qdsObjectTemplateRepository;

  @Test
  @Transactional
  public void testGetScenarioTemplates() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectTemplate/get_scenario_object_templates.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-template/list/scenario")
          .header("scenarioId", scenarioId)
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
  public void testGetOneTemplate() throws Exception {
    Integer templateId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectTemplate/get_one_object_template.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(get("/api/object-template/one").header("templateId", templateId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testAddObjectTemplate() throws Exception {
    int initialCount = qdsObjectTemplateRepository.findAll().size();

    String requestBodyJson =
      """
          {
              "title": "title4",
              "description": "description4",
              "color": "color4"
          }
      """;

    getMockMvc()
      .perform(
        post("/api/object-template/add")
          .header("scenarioId", 1)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBodyJson)
      )
      .andExpect(status().isOk());

    int newCount = qdsObjectTemplateRepository.findAll().size();
    QdsObjectTemplate newObjectTemplate = qdsObjectTemplateRepository
      .findAll()
      .getLast();

    assertEquals(initialCount + 1, newCount);
    assertEquals("color4", newObjectTemplate.getColor());
    assertEquals("title4", newObjectTemplate.getTitle());
    assertEquals("description4", newObjectTemplate.getDescription());
  }

  @Test
  @Transactional
  public void testDeleteTemplate() throws Exception {
    int initialCount = qdsObjectTemplateRepository.findAll().size();

    getMockMvc()
      .perform(delete("/api/object-template/1"))
      .andExpect(status().isNoContent());

    int newCount = qdsObjectTemplateRepository.findAll().size();

    assertEquals(
      initialCount - 1,
      newCount,
      "The count of templates should decrease by 1 after deletion."
    );
  }

  @Test
  @Transactional
  public void testCreateScenarioAndCopyObjectTemplates() throws Exception {
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
          "/api/object-template/copy/{sourceScenarioId}/to/{targetScenarioId}",
          1,
          newScenarioId
        )
      )
      .andExpect(status().isOk());

    MvcResult getResult = getMockMvc()
      .perform(
        get("/api/object-template/list/scenario-object-type", newScenarioId)
          .header("scenarioId", newScenarioId)
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn();

    String actualJson = getResult.getResponse().getContentAsString();
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectTemplate/get_imported_scenario_object_templates.json"
      )
    );

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }
}
