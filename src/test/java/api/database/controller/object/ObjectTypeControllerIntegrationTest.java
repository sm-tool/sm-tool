package api.database.controller.object;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.object.ObjectType;
import api.database.repository.object.ObjectTypeRepository;
import jakarta.transaction.Transactional;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import utils.BaseIntegrationTest;

class ObjectTypeControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private ObjectTypeRepository objectTypeRepository;

  @Test
  public void getAllObjectTypes() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectType/get_all_object_types.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-types")
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void getObjectTypesByTitle() throws Exception {
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/objectType/get_by_title.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-types/search/findByTitle")
          .param("title", "Type A")
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void getObjectTypesByDescription() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectType/get_by_description.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-types/search/findByDescription")
          .param("description", "Description D")
          .param("page", "0")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetObjectTypesByScenarioId() throws Exception {
    Integer scenarioId = 1;
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/objectType/get_by_scenario.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-types/scenario")
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
  public void testGetRootObjectTypes() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectType/get_root_object_types.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-types/roots").contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetByParentId() throws Exception {
    Integer scenarioId = 1;
    Integer parentId = 2;
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/objectType/get_by_parent.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-types/children/" + parentId)
          .contentType(MediaType.APPLICATION_JSON)
          .header("scenarioId", scenarioId)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  void testGetByObjectTypeId() throws Exception {
    Integer objectTypeId = 8;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/objectType/get_one_object_type.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/object-types/" + objectTypeId).contentType(
          MediaType.APPLICATION_JSON
        )
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testAddObjectType() throws Exception {
    Integer scenarioId = 1;

    String createObjectTypeJson =
      """
          {
              "title": "New Object Type",
              "description": "Test description",
              "color": "#fbeea7",
              "isOnlyGlobal": false,
              "canBeUser": false,
              "parentId": 3
          }
      """;

    String responseJson = getMockMvc()
      .perform(
        post("/api/object-types")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(createObjectTypeJson)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    ObjectType responseObject = getObjectMapper()
      .readValue(responseJson, ObjectType.class);

    assertEquals("New Object Type", responseObject.getTitle());
    assertEquals("Test description", responseObject.getDescription());
    assertEquals("#fbeea7", responseObject.getColor());
    assertFalse(responseObject.getIsOnlyGlobal());
    assertFalse(responseObject.getCanBeUser());
    assertEquals(3, responseObject.getParentId());
  }

  @Test
  @Transactional
  void testAssignObjectTypeToScenario() throws Exception {
    Integer objectId = 9;
    Integer scenarioId = 2;

    Pageable pageable = PageRequest.of(0, 10);
    Page<ObjectType> scenarioObjectsBefore =
      objectTypeRepository.findAllByScenarioId(scenarioId, pageable);
    Integer scenarioObjectsCountBefore =
      scenarioObjectsBefore.getNumberOfElements();

    getMockMvc()
      .perform(
        post("/api/object-types/scenario/" + objectId)
          .contentType(MediaType.APPLICATION_JSON)
          .header("scenarioId", scenarioId)
      )
      .andExpect(status().isOk());

    Page<ObjectType> scenarioObjectsAfter =
      objectTypeRepository.findAllByScenarioId(scenarioId, pageable);
    Integer scenarioObjectsCountAfter =
      scenarioObjectsAfter.getNumberOfElements();

    assertEquals(scenarioObjectsCountAfter, scenarioObjectsCountBefore + 1);
  }

  @Test
  @Transactional
  void updateObjectType() throws Exception {
    Integer objectTypeId = 4;

    ObjectType objectType = new ObjectType();
    objectType.setTitle("Updated Object Type");
    objectType.setDescription("Updated description");
    objectType.setColor("#fbeea8");
    objectType.setIsOnlyGlobal(false);
    objectType.setParentId(2);
    objectType.setCanBeUser(false);

    String requestBody = getObjectMapper().writeValueAsString(objectType);

    String responseJson = getMockMvc()
      .perform(
        put("/api/object-types/" + objectTypeId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBody)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    ObjectType responseObject = getObjectMapper()
      .readValue(responseJson, ObjectType.class);

    assertEquals("Updated Object Type", responseObject.getTitle());
    assertEquals("Updated description", responseObject.getDescription());
    assertEquals("#fbeea8", responseObject.getColor());
    assertFalse(responseObject.getIsOnlyGlobal());
    assertEquals(2, responseObject.getParentId());
    assertFalse(responseObject.getCanBeUser());
  }

  @Test
  @Transactional
  void deleteObjectType() throws Exception {
    Integer objectTypeId = 10;

    Integer countBefore = objectTypeRepository.findAll().size();

    getMockMvc()
      .perform(
        delete("/api/object-types/" + objectTypeId).contentType(
          MediaType.APPLICATION_JSON
        )
      )
      .andExpect(status().isOk());

    Integer countAfter = objectTypeRepository.findAll().size();

    assertEquals(countBefore - 1, countAfter);
  }
  //  @Test
  //  @Transactional
  //  public void testCreateScenarioAndCopyObjectTypes() throws Exception {
  //    Scenario scenario = new Scenario();
  //    scenario.setTitle("New title");
  //    scenario.setDescription("New description");
  //    scenario.setContext("New context");
  //    scenario.setPurpose("New purpose");
  //    scenario.setStartDate(OffsetDateTime.parse("2024-12-10T10:00:00+00:00"));
  //    scenario.setEndDate(OffsetDateTime.parse("2024-12-11T10:00:00+00:00"));
  //    scenario.setEventDuration(40);
  //
  //    Scenario newScenario = scenarioRepository.save(scenario);
  //
  //    getMockMvc()
  //      .perform(
  //        post(
  //          "/api/object-types/copy/{sourceScenarioId}/to/{targetScenarioId}",
  //          1,
  //          newScenario.getId()
  //        )
  //      )
  //      .andExpect(status().isOk());
  //
  //    Pageable pageable = PageRequest.of(0, 10);
  //
  //    List<ObjectType> sourceScenarioObjectTypes = objectTypeRepository
  //      .findAllByScenarioId(1, pageable)
  //      .getContent();
  //
  //    List<ObjectType> targetScenarioObjectTypes = objectTypeRepository
  //      .findAllByScenarioId(newScenario.getId(), pageable)
  //      .getContent();
  //
  //    assertEquals(
  //      sourceScenarioObjectTypes.size(),
  //      targetScenarioObjectTypes.size()
  //    );
  //  }
}
