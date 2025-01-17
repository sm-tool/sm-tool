package api.database.controller.association;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.association.AssociationType;
import api.database.repository.association.AssociationTypeRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class AssociationTypeControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private AssociationTypeRepository associationTypeRepository;

  @Test
  public void testGetAllAssociationTypes() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/get_all_association_types.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(get("/api/association-types"))
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAssociationTypesWithScenarioId() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/get_by_scenario.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-types/scenario").header("scenarioId", scenarioId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAssociationType() throws Exception {
    Integer associationTypeId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/get_one_association_type.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(get("/api/association-types/" + associationTypeId))
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAssociationTypesWithScenarioIdAndFirstObjectId()
    throws Exception {
    Integer scenarioId = 1;
    String firstObjectTypeId = "1";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/get_by_scenario_and_first_object.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-types/search/findByFirstObjectTypeId")
          .header("scenarioId", scenarioId)
          .param("typeId", firstObjectTypeId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAssociationTypesWithScenarioIdAndSecondObjectId()
    throws Exception {
    Integer scenarioId = 1;
    String secondObjectTypeId = "3";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/get_by_scenario_and_second_object.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-types/search/findBySecondObjectTypeId")
          .param("typeId", secondObjectTypeId)
          .header("scenarioId", scenarioId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAssociationTypesWithScenarioIdAndBothObjectsIds()
    throws Exception {
    Integer scenarioId = 1;
    String firstObjectTypeId = "1";
    String secondObjectTypeId = "2";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/get_by_scenario_and_both_objects.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-types/scenario")
          .header("scenarioId", scenarioId)
          .param("firstObjectTypeId", firstObjectTypeId)
          .param("secondObjectTypeId", secondObjectTypeId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAssociationTypesWithDescription() throws Exception {
    Integer scenarioId = 1;
    String description = "Association A-A";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/get_by_description.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-types/search/findByDescription")
          .header("scenarioId", scenarioId)
          .param("description", description)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAssociationTypesWithObjectType() throws Exception {
    Integer scenarioId = 1;
    Integer objectTypeId = 3;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/get_by_object_type.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-types/object-type/" + objectTypeId).header(
          "scenarioId",
          scenarioId
        )
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  public void testGetAssociationTypesWithOnlyHierarchicalError()
    throws Exception {
    Integer scenarioId = 1;

    String expectedBody =
      "{\"errorCode\":\"INCOMPATIBLE_TYPES\",\"errorGroup\":\"ASSOCIATION_TYPE\"}";

    getMockMvc()
      .perform(
        get("/api/association-types/scenario")
          .header("scenarioId", scenarioId)
          .param("hierarchical", "true")
      )
      .andExpect(status().isBadRequest())
      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
      .andExpect(content().json(expectedBody));
  }

  @Test
  @Transactional
  public void testAddAssociationType() throws Exception {
    AssociationType newAssociationType = new AssociationType();
    newAssociationType.setDescription("Test Association");
    newAssociationType.setFirstObjectTypeId(2);
    newAssociationType.setSecondObjectTypeId(2);

    String newScenarioJson = getObjectMapper()
      .writeValueAsString(newAssociationType);

    getMockMvc()
      .perform(
        post("/api/association-types")
          .contentType(MediaType.APPLICATION_JSON)
          .content(newScenarioJson)
      )
      .andExpect(status().isOk());

    AssociationType savedAssociation = associationTypeRepository
      .findAll()
      .stream()
      .filter(s -> s.getDescription().equals("Test Association"))
      .findFirst()
      .orElseThrow(() ->
        new AssertionError("Association Type not found in database")
      );

    assertEquals("Test Association", savedAssociation.getDescription());
    assertEquals(2, savedAssociation.getFirstObjectTypeId());
    assertEquals(2, savedAssociation.getSecondObjectTypeId());
  }

  @Test
  @Transactional
  public void testDeleteAssociationType() throws Exception {
    Integer associationTypeId = 2;
    Integer initialCount = associationTypeRepository.findAll().size();

    getMockMvc()
      .perform(delete("/api/association-types/" + associationTypeId))
      .andExpect(status().isOk());

    int newCount = associationTypeRepository.findAll().size();

    assertEquals(initialCount - 1, newCount);

    assertFalse(
      associationTypeRepository.findById(associationTypeId).isPresent()
    );
  }

  @Test
  @Transactional
  public void testUpdateAssociationTypeDescription() throws Exception {
    Integer associationTypeId = 1;
    AssociationType updatedAssociationType = new AssociationType();
    updatedAssociationType.setDescription("Updated Description");
    String requestBodyJson = getObjectMapper()
      .writeValueAsString(updatedAssociationType);
    MvcResult result = getMockMvc()
      .perform(
        put("/api/association-types/" + associationTypeId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBodyJson)
      )
      .andExpect(status().isOk())
      .andReturn();
    AssociationType responseAssociationType = getObjectMapper()
      .readValue(
        result.getResponse().getContentAsString(),
        AssociationType.class
      );
    assertEquals(
      "Updated Description",
      responseAssociationType.getDescription()
    );
    AssociationType updatedAssociationTypeFromDb = associationTypeRepository
      .findById(associationTypeId)
      .orElseThrow(() -> new RuntimeException("Association Type not found"));
    assertEquals(
      "Updated Description",
      updatedAssociationTypeFromDb.getDescription()
    );
  }
}
