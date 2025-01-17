package api.database.service.thread;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import api.database.entity.scenario.Scenario;
import api.database.model.request.composite.create.ThreadCreateRequest;
import jakarta.transaction.Transactional;
import java.util.List;
import org.junit.jupiter.api.Test;
import utils.BaseUnitTest;
import utils.builders.QdsAddScenarioBuilder;
import utils.builders.QdsAddThreadBuilder;

class ThreadServiceTest extends BaseUnitTest {

  @Test
  @Transactional
  void testAddThreadWithEvents() {
    Scenario addedScenario = getObjectManager()
      .addScenarioByManager(new QdsAddScenarioBuilder().build());

    ThreadCreateRequest threadToAdd = new QdsAddThreadBuilder().build();
    getObjectManager().addThreadByManager(threadToAdd, addedScenario.getId());

    getEntityManager().flush();

    String threadQuery =
      "SELECT COUNT(*) FROM qds_thread WHERE title = ? AND description = ? AND scenario_id = ?";
    Integer threadCount = getJdbcTemplate()
      .queryForObject(
        threadQuery,
        Integer.class,
        threadToAdd.title(),
        threadToAdd.description(),
        addedScenario.getId()
      );

    assertNotNull(threadCount);
    assertEquals(1, threadCount);

    String threadIdQuery =
      "SELECT id FROM qds_thread WHERE title = ? AND description = ? AND scenario_id = ?";
    Integer threadId = getJdbcTemplate()
      .queryForObject(
        threadIdQuery,
        Integer.class,
        threadToAdd.title(),
        threadToAdd.description(),
        addedScenario.getId()
      );

    assertNotNull(threadId);

    String eventCountQuery =
      "SELECT COUNT(*) FROM qds_event WHERE thread_id = ?";
    Integer eventCount = getJdbcTemplate()
      .queryForObject(eventCountQuery, Integer.class, threadId);

    assertNotNull(eventCount);
    assertEquals(2, eventCount);

    String eventTypeQuery =
      "SELECT event_type FROM qds_event WHERE thread_id = ?";
    List<String> eventTypes = getJdbcTemplate()
      .query(
        eventTypeQuery,
        (rs, rowNum) -> rs.getString("event_type"),
        threadId
      );

    assertNotNull(eventTypes);
    assertTrue(eventTypes.contains("START"));
    assertTrue(eventTypes.contains("END"));
  }
}
