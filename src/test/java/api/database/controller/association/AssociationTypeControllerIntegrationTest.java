package api.database.controller.association;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class AssociationTypeControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  @Transactional
  public void testGetAssociationTypesWithScenarioId() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/scenario_id_association_types.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(get("/api/association-type").header("scenarioId", scenarioId))
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testGetAssociationTypesWithScenarioIdAndFirstObjectId()
    throws Exception {
    Integer scenarioId = 1;
    String firstObjectTypeId = "1";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/scenario_id_and_first_object_id_association_types.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-type")
          .header("scenarioId", scenarioId)
          .param("firstObjectTypeId", firstObjectTypeId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testGetAssociationTypesWithScenarioIdAndSecondObjectId()
    throws Exception {
    Integer scenarioId = 1;
    String secondObjectTypeId = "3";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/scenario_id_and_second_object_id_association_types.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-type")
          .header("scenarioId", scenarioId)
          .param("secondObjectTypeId", secondObjectTypeId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testGetAssociationTypesWithScenarioIdAndBothObjectsIds()
    throws Exception {
    Integer scenarioId = 1;
    String firstObjectTypeId = "1";
    String secondObjectTypeId = "2";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/scenario_id_and_both_objects_ids.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-type")
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
  @Transactional
  public void testGetAssociationTypesWithScenarioIdAndFirstObjectIdHierarchical()
    throws Exception {
    Integer scenarioId = 1;
    String firstObjectTypeId = "4";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/scenario_id_and_first_object_id_association_types_hierarchical.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-type")
          .header("scenarioId", scenarioId)
          .param("firstObjectTypeId", firstObjectTypeId)
          .param("hierarchical", "true")
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testGetAssociationTypesWithScenarioIdAndBothObjectsIdsHierarchical()
    throws Exception {
    Integer scenarioId = 1;
    String firstObjectTypeId = "4";
    String secondObjectTypeId = "3";

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/associationType/scenario_id_and_both_objects_ids_hierarchical.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/association-type")
          .header("scenarioId", scenarioId)
          .param("firstObjectTypeId", firstObjectTypeId)
          .param("secondObjectTypeId", secondObjectTypeId)
          .param("hierarchical", "true")
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }
}
