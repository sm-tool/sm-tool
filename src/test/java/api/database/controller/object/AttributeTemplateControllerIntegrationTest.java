package api.database.controller.object;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class AttributeTemplateControllerIntegrationTest extends BaseIntegrationTest {

  @Test
  @Transactional
  public void testGetTemplateAttributes() throws Exception {
    Integer objectTemplateId = 1;

    String expectedJson = Files.readString(
      Paths.get(
        "src/test/resources/responses/attributeTemplate/get_object_attribute_templates.json"
      )
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/attribute-template/list/template").header(
          "objectTemplateId",
          objectTemplateId
        )
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }
}
