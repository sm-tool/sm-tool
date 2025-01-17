package api.database.controller.object;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.object.ObjectInstance;
import api.database.model.constant.AttributeType;
import api.database.model.response.AttributeResponse;
import api.database.model.response.ObjectInstanceResponse;
import api.database.repository.object.ObjectInstanceRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class ObjectInstanceControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private ObjectInstanceRepository objectRepository;

  @Test
  void testGetObjectsForScenario() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/object/get_by_scenario.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/objects")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  void testGetObject() throws Exception {
    Integer scenarioId = 1;
    Integer objectId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/object/get_one_object.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/objects/" + objectId)
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  void testGetObjectsForThread() throws Exception {
    Integer scenarioId = 1;
    Integer threadId = 2;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/object/get_by_thread.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/objects/thread/" + threadId)
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  void testAddObject() throws Exception {
    Integer scenarioId = 1;
    Integer threadId = 2;
    Integer objectTemplateId = 1;
    Integer objectTypeId = 1;

    AttributeResponse attribute1 = new AttributeResponse(
      null,
      1,
      AttributeType.INT
    );

    AttributeResponse attribute2 = new AttributeResponse(
      null,
      2,
      AttributeType.STRING
    );

    List<AttributeResponse> attributes = Arrays.asList(attribute1, attribute2);

    ObjectInstanceResponse newObject = new ObjectInstanceResponse(
      null,
      threadId,
      "Object3",
      objectTemplateId,
      objectTypeId,
      attributes
    );

    String requestBody = getObjectMapper().writeValueAsString(newObject);

    String responseContent = getMockMvc()
      .perform(
        post("/api/objects")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBody)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    ObjectInstanceResponse savedObject = getObjectMapper()
      .readValue(responseContent, ObjectInstanceResponse.class);

    assertEquals("Object3", savedObject.name());
    assertEquals(threadId, savedObject.originThreadId());
    assertEquals(objectTemplateId, savedObject.templateId());
    assertEquals(objectTypeId, savedObject.objectTypeId());
    assertNotNull(savedObject.id());
    assertEquals(2, savedObject.attributes().size());
    assertEquals(1, savedObject.attributes().get(0).attributeTemplateId());
    assertEquals(AttributeType.INT, savedObject.attributes().get(0).type());
    assertEquals(2, savedObject.attributes().get(1).attributeTemplateId());
    assertEquals(AttributeType.STRING, savedObject.attributes().get(1).type());
  }

  @Test
  @Transactional
  void testDeleteObject() throws Exception {
    ObjectInstance objectToDelete = new ObjectInstance(
      null,
      1,
      2,
      2,
      2,
      "Object4",
      null,
      null,
      null
    );
    ObjectInstance savedObject = objectRepository.save(objectToDelete);
    Integer objectId = savedObject.getId();
    boolean exists = objectRepository.existsById(objectId);
    assertTrue(exists, "Object was not added to the database");

    getMockMvc()
      .perform(delete("/api/objects/" + objectId))
      .andExpect(status().isOk());

    boolean exists2 = objectRepository.existsById(objectId);
    assertFalse(exists2, "Object was not deleted from the database");
  }
}
