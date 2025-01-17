package api.database.repository.special;

import api.database.entity.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeShiftRepository extends JpaRepository<Event, Integer> {
  @Modifying
  @Query(
    value = """
    UPDATE qds_event SET event_time = event_time + :shift
    WHERE thread_id = ANY(:threadIds)
    """,
    nativeQuery = true
  )
  void shiftEventsInThreads(Integer[] threadIds, Integer shift);

  @Modifying
  @Query(
    value = """
    UPDATE qds_branching SET branching_time = branching_time + :shift
    WHERE id = ANY(:branchingIds)
    """,
    nativeQuery = true
  )
  void shiftBranchingTimes(Integer[] branchingIds, Integer shift);

  @Modifying
  @Query(
    value = """
    UPDATE qds_event e
    SET event_time = b.branching_time
    FROM qds_branching b
    WHERE e.branching_id = b.id
    AND b.scenario_id = :scenarioId
    """,
    nativeQuery = true
  )
  void alignBranchingEventsInScenario(Integer scenarioId);

  @Modifying
  @Query(
    value = """
    UPDATE qds_event e
    SET event_time = event_time + :shift
    WHERE thread_id = :threadId
    AND event_time > :time
    """,
    nativeQuery = true
  )
  void shiftEventsAfterTime(
    Integer threadId,
    @Param("time") Integer time,
    @Param("shift") Integer shift
  );

  @Query(
    value = """
    SELECT EXISTS
        (SELECT 1 FROM qds_event e
            WHERE e.thread_id= :threadId
            AND event_time >= :newTime
            AND event_time < :oldTime
            AND event_type <> 'IDLE'
        )
    """,
    nativeQuery = true
  )
  boolean existsEventsBetweenTimes(
    Integer threadId,
    Integer newTime,
    Integer oldTime
  );
}
