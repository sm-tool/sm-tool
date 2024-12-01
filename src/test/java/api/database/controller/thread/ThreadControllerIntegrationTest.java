package api.database.controller.thread;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.event.QdsEvent;
import api.database.entity.thread.QdsThread;
import api.database.model.constant.QdsEventType;
import api.database.model.thread.QdsInfoThreadAdd;
import api.database.repository.event.QdsEventRepository;
import api.database.repository.thread.QdsBranchingRepository;
import api.database.repository.thread.QdsThreadRepository;
import jakarta.transaction.Transactional;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import utils.BaseIntegrationTest;

class ThreadControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  private QdsThreadRepository qdsThreadRepository;

  @Autowired
  private QdsEventRepository qdsEventRepository;

  @Autowired
  private QdsBranchingRepository qdsBranchingRepository;

  @Test
  @Transactional
  public void testGetScenarioThreads() throws Exception {
    Integer scenarioId = 1;

    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/thread/get_scenario_threads.json")
    );

    String actualJson = getMockMvc()
      .perform(get("/api/thread/all").header("scenarioId", scenarioId))
      .andReturn()
      .getResponse()
      .getContentAsString();

    JSONAssert.assertEquals(expectedJson, actualJson, false);
  }

  @Test
  @Transactional
  public void testAddThread() throws Exception {
    Integer scenarioId = 1;

    QdsInfoThreadAdd threadAdd = new QdsInfoThreadAdd(
      "GLOBAL",
      "GLOBAL_THREAD",
      0
    );
    String threadJson = getObjectMapper().writeValueAsString(threadAdd);

    String responseContent = getMockMvc()
      .perform(
        post("/api/thread/add")
          .contentType(MediaType.APPLICATION_JSON)
          .content(threadJson)
          .header("scenarioId", scenarioId)
      )
      .andExpect(status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    QdsThread addedThread = qdsThreadRepository
      .findAll()
      .stream()
      .max(Comparator.comparingInt(QdsThread::getId))
      .orElseThrow(() -> new AssertionError("Brak wątku"));

    Integer threadId = addedThread.getId();

    List<QdsEvent> actions = qdsEventRepository.findByThreadId(threadId);

    assertEquals(2, actions.size());

    assertEquals("GLOBAL", addedThread.getTitle());
    assertEquals("GLOBAL_THREAD", addedThread.getDescription());
    assertEquals(scenarioId, addedThread.getScenarioId());

    QdsEvent startAction = actions
      .stream()
      .filter(action -> action.getEventType() == QdsEventType.START)
      .findFirst()
      .orElseThrow(() -> new AssertionError("Brak akcji START"));
    assertEquals(0, startAction.getEventTime());

    QdsEvent endAction = actions
      .stream()
      .filter(action -> action.getEventType() == QdsEventType.END)
      .findFirst()
      .orElseThrow(() -> new AssertionError("Brak akcji END"));
    assertEquals(1, endAction.getEventTime());
  }

  @Disabled("Zmieniona zasada działania + transfer do weryfiakcji")
  @Test
  @Transactional
  public void testForkThread() throws Exception {
    //    Integer scenarioId = 1;
    //    Integer forkedThreadId = 2;
    //
    //    QdsInfoForkAdd threadFork = new QdsInfoForkAdd(
    //      forkedThreadId,
    //      2,
    //      1,
    //      "FORK_TITLE",
    //      "FORK_DESCRIPTION",
    //      List.of(List.of(1), List.of(2))
    //    );
    //    String forkJson = new ObjectMapper().writeValueAsString(threadFork);
    //
    //    String forkResponseContent = getMockMvc()
    //      .perform(
    //        post("/api/thread/fork")
    //          .contentType(MediaType.APPLICATION_JSON)
    //          .content(forkJson)
    //          .header("scenarioId", scenarioId)
    //      )
    //      .andExpect(status().isOk())
    //      .andReturn()
    //      .getResponse()
    //      .getContentAsString();
    //
    //    List<Integer> offspringThreadIds = new ObjectMapper()
    //      .readValue(forkResponseContent, new TypeReference<List<Integer>>() {});
    //
    //    assertEquals(2, offspringThreadIds.size());
    //
    //    QdsBranching branching = qdsBranchingRepository
    //      .findAll()
    //      .stream()
    //      .filter(b -> b.getScenarioId().equals(scenarioId))
    //      .findFirst()
    //      .orElseThrow(() ->
    //        new AssertionError(
    //          "Nie znaleziono rozgałęzienia dla scenariusza o ID: " + scenarioId
    //        )
    //      );
    //
    //    assertNotNull(branching);
    //    assertEquals(QdsBranchingType.FORK, branching.getBranchingType());
    //    assertEquals(1, branching.getBranchingTime());
    //    assertEquals("FORK_TITLE", branching.getTitle());
    //    assertEquals("FORK_DESCRIPTION", branching.getDescription());
    //
    //    QdsEvent modifiedLastAction = qdsEventRepository.getLastEvent(
    //      forkedThreadId
    //    );
    //    assertEquals(QdsEventType.FORK_IN, modifiedLastAction.getEventType());
    //    assertEquals(1, modifiedLastAction.getEventTime());
    //    assertEquals(branching.getId(), modifiedLastAction.getBranchingId());
    //
    //    for (Integer threadId : offspringThreadIds) {
    //      QdsThread offspringThread = qdsThreadRepository
    //        .findById(threadId)
    //        .orElseThrow(() ->
    //          new AssertionError("Nie znaleziono potomnego wątku z ID: " + threadId)
    //        );
    //      assertEquals(scenarioId, offspringThread.getScenarioId());
    //      assertEquals("", offspringThread.getTitle());
    //      assertEquals("", offspringThread.getDescription());
    //
    //      List<QdsEvent> actions = qdsEventRepository.findByThreadId(threadId);
    //      assertEquals(2, actions.size());
    //
    //      QdsEvent forkOutAction = actions
    //        .stream()
    //        .filter(action -> action.getEventType().name().endsWith("_OUT"))
    //        .findFirst()
    //        .orElseThrow(() -> new AssertionError("Brak akcji FORK_OUT"));
    //      assertEquals(1, forkOutAction.getEventTime());
    //      assertEquals(branching.getId(), forkOutAction.getBranchingId());
    //
    //      QdsEvent endAction = actions
    //        .stream()
    //        .filter(action -> action.getEventType() == QdsEventType.END)
    //        .findFirst()
    //        .orElseThrow(() -> new AssertionError("Brak akcji END"));
    //      assertEquals(2, endAction.getEventTime());
    //    }
  }

  @Disabled("Zmieniona zasada działania + transfer do weryfiakcji")
  @Test
  public void testForkThreadWithIdZero() throws Exception {
    //    Integer scenarioId = 1;
    //    Integer globalThreadId = 0;
    //
    //    QdsInfoForkAdd threadFork = new QdsInfoForkAdd(
    //      globalThreadId,
    //      2,
    //      1,
    //      "FORK_TITLE",
    //      "FORK_DESCRIPTION",
    //      List.of(List.of(1), List.of(2))
    //    );
    //    String forkJson = new ObjectMapper().writeValueAsString(threadFork);
    //
    //    getMockMvc()
    //      .perform(
    //        post("/api/thread/fork")
    //          .contentType(MediaType.APPLICATION_JSON)
    //          .content(forkJson)
    //          .header("scenarioId", scenarioId)
    //      )
    //      .andExpect(status().isBadRequest());
  }

  @Disabled("Zmieniona zasada działania + transfer do weryfiakcji")
  @Test
  @Transactional
  public void testForkThreadAlreadyBranched() throws Exception {
    //    Integer scenarioId = 1;
    //    Integer forkedThreadId = 2;
    //
    //    QdsInfoForkAdd threadFork = new QdsInfoForkAdd(
    //      forkedThreadId,
    //      2,
    //      1,
    //      "FORK_TITLE",
    //      "FORK_DESCRIPTION",
    //      List.of(List.of(1), List.of(2))
    //    );
    //    String forkJson = new ObjectMapper().writeValueAsString(threadFork);
    //
    //    getMockMvc()
    //      .perform(
    //        post("/api/thread/fork")
    //          .contentType(MediaType.APPLICATION_JSON)
    //          .content(forkJson)
    //          .header("scenarioId", scenarioId)
    //      )
    //      .andExpect(status().isOk());
    //
    //    getMockMvc()
    //      .perform(
    //        post("/api/thread/fork")
    //          .contentType(MediaType.APPLICATION_JSON)
    //          .content(forkJson)
    //          .header("scenarioId", scenarioId)
    //      )
    //      .andExpect(status().isBadRequest())
    //      .andExpect(jsonPath("$.errorCode").value("THREAD_ALREADY_BRANCHED"));
  }

  @Disabled("Zmieniona zasada działania + transfer do weryfiakcji")
  @Test
  @Transactional
  public void testForkThreadWithExistingLaterEvents() throws Exception {
    //    Integer scenarioId = 1;
    //    Integer forkedThreadId = 2;
    //
    //    QdsInfoForkAdd threadFork = new QdsInfoForkAdd(
    //      forkedThreadId,
    //      2,
    //      0,
    //      "FORK_TITLE",
    //      "FORK_DESCRIPTION",
    //      List.of(List.of(1), List.of(2))
    //    );
    //    String forkJson = new ObjectMapper().writeValueAsString(threadFork);
    //
    //    getMockMvc()
    //      .perform(
    //        post("/api/thread/fork")
    //          .contentType(MediaType.APPLICATION_JSON)
    //          .content(forkJson)
    //          .header("scenarioId", scenarioId)
    //      )
    //      .andExpect(status().isBadRequest())
    //      .andExpect(jsonPath("$.errorCode").value("EXIST_LATER_EVENTS"));
  }
}
