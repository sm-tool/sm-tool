package api.database.controller.object;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.object.AttributeTemplate;
import api.database.model.constant.AttributeType;
import api.database.model.request.create.AttributeTemplateCreateRequest;
import api.database.model.request.update.AttributeTemplateUpdateRequest;
import api.database.repository.attribute.AttributeTemplateRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class AttributeTemplateControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private AttributeTemplateRepository attributeTemplateRepository;

  @Test
  public void testGetTemplateAttributes() throws Exception {
    Integer objectTemplateId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/attributeTemplate/get_by_object_template.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(get("/api/attribute-templates/template/" + objectTemplateId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAttributeTemplate() throws Exception {
    Integer templateAttributeId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/attributeTemplate/get_one_attribute_template.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(get("/api/attribute-templates/" + templateAttributeId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testAddAttributeTemplate() throws Exception {
    Integer objectTemplateId = 1;

    AttributeTemplateCreateRequest attributeTemplate =
      new AttributeTemplateCreateRequest(
        objectTemplateId,
        "isWarm",
        "Yes",
        "Unit",
        AttributeType.BOOL
      );
    String requestBody = getObjectMapper()
      .writeValueAsString(attributeTemplate);

    String responseBody = getMockMvc()
      .perform(
        post("/api/attribute-templates")
          .content(requestBody)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    AttributeTemplate responseAttribute = getObjectMapper()
      .readValue(responseBody, AttributeTemplate.class);

    assertNotNull(responseAttribute);
    assertEquals(1, responseAttribute.getObjectTemplateId());
    assertEquals("isWarm", responseAttribute.getName());
    assertEquals(AttributeType.BOOL, responseAttribute.getType());
  }

  @Test
  public void testAddAttributeTemplateError() throws Exception {
    Integer objectTemplateId = 100;

    String expectedBody =
      "{\"errorCode\":\"DOES_NOT_EXIST\",\"errorGroup\":\"OBJECT_TEMPLATE\"}";

    AttributeTemplateCreateRequest attributeTemplate =
      new AttributeTemplateCreateRequest(
        objectTemplateId,
        "isWarm",
        "Yes",
        "Unit",
        AttributeType.BOOL
      );
    String requestBody = getObjectMapper()
      .writeValueAsString(attributeTemplate);

    getMockMvc()
      .perform(
        post("/api/attribute-templates")
          .content(requestBody)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isBadRequest())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(content().json(expectedBody));
  }

  @Test
  @Transactional
  public void testUpdateAttributeTemplate() throws Exception {
    Integer attributeTemplateId = 3;

    AttributeTemplateUpdateRequest attributeTemplateUpdate =
      new AttributeTemplateUpdateRequest("updated name", "50");
    String requestBody = getObjectMapper()
      .writeValueAsString(attributeTemplateUpdate);

    String responseBody = getMockMvc()
      .perform(
        put("/api/attribute-templates/" + attributeTemplateId)
          .content(requestBody)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    AttributeTemplate responseAttribute = getObjectMapper()
      .readValue(responseBody, AttributeTemplate.class);

    assertNotNull(responseAttribute);
    assertEquals(attributeTemplateId, responseAttribute.getId());
    assertEquals("updated name", responseAttribute.getName());
    assertEquals("50", responseAttribute.getDefaultValue());
  }

  @Test
  @Transactional
  public void testDeleteTemplateAttribute() throws Exception {
    Integer templateAttributeId = 1;

    getMockMvc()
      .perform(delete("/api/attribute-templates/" + templateAttributeId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    boolean exists = attributeTemplateRepository.existsById(
      templateAttributeId
    );
    assertFalse(exists, "Attribute was not deleted from the database");
  }
}
