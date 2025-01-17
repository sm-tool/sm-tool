package api.database.controller.thread;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import api.database.entity.thread.Thread;
import api.database.model.request.composite.create.ThreadCreateRequest;
import api.database.model.request.update.ThreadUpdateRequest;
import api.database.repository.thread.ThreadRepository;
import jakarta.transaction.Transactional;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import utils.BaseIntegrationTest;

class ThreadControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private ThreadRepository threadRepository;

  @Test
  void testGetScenarioThreads() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/thread/get_by_scenario.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/threads").header("scenarioId", scenarioId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  void testGetOneThread() throws Exception {
    Integer scenarioId = 1;
    Integer threadId = 2;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/thread/get_one_thread.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/threads/" + threadId).header("scenarioId", scenarioId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  void testCreateThread() throws Exception {
    Integer scenarioId = 1;
    ThreadCreateRequest newThread = new ThreadCreateRequest(
      "New title",
      "New description",
      40
    );

    String requestBody = getObjectMapper().writeValueAsString(newThread);

    getMockMvc()
      .perform(
        post("/api/threads")
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBody)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    Thread savedThread = threadRepository
      .findAll()
      .stream()
      .filter(s -> s.getTitle().equals("New title"))
      .findFirst()
      .orElseThrow(() -> new AssertionError("Thread not found in database"));

    assertEquals("New title", savedThread.getTitle());
    assertEquals("New description", savedThread.getDescription());
  }

  @Test
  @Transactional
  void testUpdateThread() throws Exception {
    Integer scenarioId = 1;
    Integer threadId = 2;
    ThreadUpdateRequest updatedThread = new ThreadUpdateRequest(
      "Updated title",
      "Updated description"
    );

    String requestBody = getObjectMapper().writeValueAsString(updatedThread);

    getMockMvc()
      .perform(
        put("/api/threads/" + threadId)
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
          .content(requestBody)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    Thread savedThread = threadRepository
      .findById(threadId)
      .orElseThrow(() -> new AssertionError("Thread not found in database"));

    assertEquals("Updated title", savedThread.getTitle());
    assertEquals("Updated description", savedThread.getDescription());
  }

  @Test
  @Transactional
  void testDeleteThread() throws Exception {
    Integer scenarioId = 1;
    Integer threadId = 2;

    Integer oldCount = threadRepository.findAll().size();

    getMockMvc()
      .perform(
        delete("/api/threads/" + threadId)
          .header("scenarioId", scenarioId)
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andReturn()
      .getResponse()
      .getContentAsString();

    Integer newCount = threadRepository.findAll().size();

    boolean exists = threadRepository.existsById(threadId);
    assertFalse(exists);
    assertEquals(oldCount - 1, newCount);
  }
}
