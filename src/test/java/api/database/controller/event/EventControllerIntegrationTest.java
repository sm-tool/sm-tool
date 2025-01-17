package api.database.controller.event;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.model.request.composite.update.EventUpdateRequest;
import api.database.model.response.EventResponse;
import api.database.repository.event.EventRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class EventControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private EventRepository eventRepository;

  @Test
  public void testGetEventsForScenario() throws Exception {
    Integer scenarioId = 1;
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/event/get_by_scenario.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/events").header("scenarioId", scenarioId))
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  void testGetOneEvent() throws Exception {
    Integer eventId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/event/get_one_event.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/events/" + eventId))
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  void testGetThreadEvents() throws Exception {
    Integer scenarioId = 1;
    Integer threadId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/event/get_by_thread.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/events/thread/" + threadId).header("scenarioId", scenarioId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  void testGetEventState() throws Exception {
    Integer scenarioId = 1;
    Integer eventId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/event/get_event_state.json")
    );

    String actualJson = getMockMvc()
      .perform(
        get("/api/events/state/" + eventId).header("scenarioId", scenarioId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }
}
