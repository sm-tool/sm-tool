package api.database.repository.special;

import api.database.entity.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IdleEventRepository extends JpaRepository<Event, Integer> {
  @Query(
    value = """
    SELECT e.*
    FROM qds_event e
    WHERE e.thread_id = :threadId
      AND e.event_time = :time
      AND e.event_type = 'IDLE'
    LIMIT 1
    """,
    nativeQuery = true
  )
  Event getIdleEventInTimeAndThread(
    @Param("time") Integer time,
    @Param("threadId") Integer threadId
  );

  @Modifying
  @Query(
    value = """
    DELETE FROM qds_event e
    USING (
      SELECT thread_id, MAX(event_time) as last_time
      FROM qds_event JOIN qds_thread t on t.id = thread_id
      WHERE t.scenario_id = :scenarioId
      AND event_type IN ('FORK_IN', 'JOIN_IN', 'END')
      GROUP BY thread_id
    ) last_events
    WHERE e.thread_id = last_events.thread_id
    AND e.event_type = 'IDLE'
    AND e.event_time >= last_events.last_time
    """,
    nativeQuery = true
  )
  void cleanupIdleEvents(@Param("scenarioId") Integer scenarioId);

  @Modifying
  @Query(
    value = """
    DELETE FROM qds_event e WHERE e.thread_id = :threadId
    AND e.event_type = 'IDLE'
    AND e.event_time >= :timeFrom
    AND e.event_time < :timeTo
    """,
    nativeQuery = true
  )
  void cleanIdleEvents(
    @Param("threadId") Integer threadId,
    @Param("timeFrom") Integer timeFrom,
    @Param("timeTo") Integer timeTo
  );
}
