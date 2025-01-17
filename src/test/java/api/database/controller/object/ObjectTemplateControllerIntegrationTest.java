package api.database.controller.object;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.object.ObjectTemplate;
import api.database.repository.object.ObjectTemplateRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

public class ObjectTemplateControllerIntegrationTest
  extends BaseIntegrationTest {

  @Autowired
  private ObjectTemplateRepository objectTemplateRepository;

  @Test
  public void testGetAllObjectTemplates() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectTemplate/get_all_object_templates.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-templates")
          .param("page", "0")
          .param("sort", "title")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetOneObjectTemplate() throws Exception {
    Integer templateId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectTemplate/get_one_object_template.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-templates/" + templateId).contentType(
          MediaType.APPLICATION_JSON
        )
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetObjectTemplatesForScenario() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectTemplate/get_by_scenario.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-templates/scenario")
          .header("scenarioId", scenarioId)
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetObjectTemplatesByScenarioIdAndObjectTypeId()
    throws Exception {
    String objectTypeId = "1";
    String scenarioId = "1";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectTemplate/get_by_scenario_and_object_type.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get(
          "/api/object-templates/search/findByScenarioIdAndObjectTypeId/" +
          objectTypeId
        ).header("scenarioId", scenarioId)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetObjectTemplatesByTitle() throws Exception {
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/objectTemplate/get_by_title.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-templates/search/findByTitle").param("title", "title1")
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetObjectTemplatesByDescription() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectTemplate/get_by_description.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-templates/search/findByDescription").param(
          "description",
          "description2"
        )
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testAddObjectTemplate() throws Exception {
    String requestBodyJson =
      """
          {
              "title": "title4",
              "description": "description4",
              "color": "color4"
          }
      """;

    String responseContent = getMockMvc()
      .perform(
        post("/api/object-templates")
          .header("scenarioId", 1)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBodyJson)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    ObjectTemplate responseObject = getObjectMapper()
      .readValue(responseContent, ObjectTemplate.class);

    assertNotNull(responseObject.getId());
    assertEquals("title4", responseObject.getTitle());
    assertEquals("description4", responseObject.getDescription());
    assertEquals("color4", responseObject.getColor());
  }

  @Test
  @Transactional
  void testAssignObjectTemplateToScenario() throws Exception {
    Integer templateId = 2;
    Integer scenarioId = 2;

    Pageable pageable = PageRequest.of(0, 10);
    Page<ObjectTemplate> scenarioTemplatesBefore =
      objectTemplateRepository.findAllByScenarioId(scenarioId, pageable);
    Integer scenarioTemplatesCountBefore =
      scenarioTemplatesBefore.getNumberOfElements();

    getMockMvc()
      .perform(
        post("/api/object-templates/scenario/" + templateId)
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk());

    Page<ObjectTemplate> scenarioTemplatesAfter =
      objectTemplateRepository.findAllByScenarioId(scenarioId, pageable);
    Integer scenarioTemplatesCountAfter =
      scenarioTemplatesAfter.getNumberOfElements();
    assertEquals(scenarioTemplatesCountAfter, scenarioTemplatesCountBefore + 1);
  }

  @Test
  @Transactional
  public void testDeleteTemplate() throws Exception {
    int initialCount = objectTemplateRepository.findAll().size();

    getMockMvc()
      .perform(delete("/api/object-templates/3"))
      .andExpect(status().isOk());

    int newCount = objectTemplateRepository.findAll().size();

    assertEquals(
      initialCount - 1,
      newCount,
      "The count of templates should decrease by 1 after deletion."
    );
  }

  @Test
  @Transactional
  void testUpdateObjectTemplate() throws Exception {
    Integer objectType = 1;
    ObjectTemplate objectTemplate = new ObjectTemplate();
    objectTemplate.setTitle("Updated Title");
    objectTemplate.setDescription("Updated Description");
    objectTemplate.setColor("#342624");
    objectTemplate.setObjectTypeId(100);

    String requestBodyJson = getObjectMapper()
      .writeValueAsString(objectTemplate);

    MvcResult result = getMockMvc()
      .perform(
        put("/api/object-templates/" + 1)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBodyJson)
      )
      .andExpect(status().isOk())
      .andReturn();

    String responseBody = result.getResponse().getContentAsString();
    ObjectTemplate updatedObjectTemplate = getObjectMapper()
      .readValue(responseBody, ObjectTemplate.class);

    assertEquals(updatedObjectTemplate.getTitle(), objectTemplate.getTitle());
    assertEquals(
      updatedObjectTemplate.getDescription(),
      objectTemplate.getDescription()
    );
    assertEquals(updatedObjectTemplate.getColor(), objectTemplate.getColor());
    assertEquals(objectType, updatedObjectTemplate.getObjectTypeId());
  }
  //  @Test
  //  @Transactional
  //  public void testCreateScenarioAndCopyObjectTemplates() throws Exception {
  //    Scenario newScenario = new Scenario();
  //    newScenario.setTitle("New Scenario");
  //    newScenario.setDescription("New Descirption");
  //    newScenario.setContext("Test Context");
  //    newScenario.setPurpose("Test Context");
  //    newScenario.setStartDate(OffsetDateTime.parse("2024-12-10T10:00:00+00:00"));
  //    newScenario.setEndDate(OffsetDateTime.parse("2024-12-11T10:00:00+00:00"));
  //    newScenario.setEventDuration(30);
  //
  //    String newScenarioJson = getObjectMapper().writeValueAsString(newScenario);
  //
  //    MvcResult createResult = getMockMvc()
  //      .perform(
  //        post("/api/scenarios")
  //          .contentType(MediaType.APPLICATION_JSON)
  //          .content(newScenarioJson)
  //      )
  //      .andExpect(status().isOk())
  //      .andReturn();
  //
  //    Scenario createdScenario = getObjectMapper()
  //      .readValue(
  //        createResult.getResponse().getContentAsString(),
  //        Scenario.class
  //      );
  //    Integer newScenarioId = createdScenario.getId();
  //
  //    getMockMvc()
  //      .perform(
  //        post(
  //          "/api/object-templates/copy/{sourceScenarioId}/to/{targetScenarioId}",
  //          1,
  //          newScenarioId
  //        )
  //      )
  //      .andExpect(status().isOk());
  //
  //    MvcResult getResult = getMockMvc()
  //      .perform(
  //        get("/api/object-templates/search/findByScenarioId/" + newScenarioId)
  //          .param("page", "0")
  //          .contentType(MediaType.APPLICATION_JSON)
  //      )
  //      .andExpect(status().isOk())
  //      .andReturn();
  //
  //    String actualJson = getResult.getResponse().getContentAsString();
  //    String expectedJson = Files.readString(
  //      Paths.get(
  //        "src/test/resources/responses/objectTemplate/get_imported_scenario_object_templates.json"
  //      )
  //    );
  //
  //    JSONAssert.assertEquals(expectedJson, actualJson, false);
  //  }
}
