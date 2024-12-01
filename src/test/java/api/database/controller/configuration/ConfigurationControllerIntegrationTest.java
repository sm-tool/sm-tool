package api.database.controller.configuration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.model.configuration.QdsInfoSetting;
import api.database.repository.configuration.QdsConfigurationRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class ConfigurationControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  @Transactional
  public void testGetConfiguration() throws Exception {
    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/configuration/get_configuration_response.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(get("/api/configuration/all"))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  void testGetConfigurationTypeIdsAndCheckSize() throws Exception {
    MvcResult result = getMockMvc()
      .perform(
        get("/api/configuration/one")
          .content("{\"name\": \"type_id\"}")
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andReturn();

    String responseBody = result.getResponse().getContentAsString();

    QdsInfoSetting setting = getObjectMapper()
      .readValue(responseBody, QdsInfoSetting.class);

    List<Integer> typeIds = Arrays.stream(
      setting.value().replaceAll("[\\[\\]]", "").split(",")
    )
      .map(String::trim)
      .map(Integer::parseInt)
      .toList();

    System.out.println("Extracted typeIds: " + typeIds);

    assertEquals(6, typeIds.size());
    assertTrue(typeIds.contains(6));
  }
  //  @Test
  //  @Transactional
  //  public void testUpdateConfiguration() throws Exception {
  //        String updatedConfigJson =
  //          """
  //              {
  //                  "id": 0,
  //                  "privateKey": "NEW_KEY",
  //                  "defaultEventDuration": 15,
  //                  "observerTypeId": 2,
  //                  "actorTypeId": 3
  //              }
  //          """;
  //
  //        getMockMvc()
  //          .perform(
  //            post("/api/configuration/all")
  //              .contentType(MediaType.APPLICATION_JSON)
  //              .content(updatedConfigJson)
  //          )
  //          .andExpect(status().isOk())
  //          .andReturn()
  //          .getResponse()
  //          .getContentAsString();
  //
  //        QdsConfiguration updatedConfig =
  //          qdsConfigurationRepository.getConfiguration(0);
  //        assertEquals("NEW_KEY", updatedConfig.getPrivateKey());
  //        assertEquals("15", updatedConfig.getDefaultEventDuration());
  //        assertEquals(2, updatedConfig.getObserverTypeId());
  //        assertEquals(3, updatedConfig.getActorTypeId());
  //  }
}
