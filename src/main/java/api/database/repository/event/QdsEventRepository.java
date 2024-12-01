package api.database.repository.event;

import api.database.entity.event.QdsEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsEventRepository extends JpaRepository<QdsEvent, Integer> {
  @Query(
    value = "SELECT * FROM qds_event WHERE thread_id = :threadId",
    nativeQuery = true
  )
  List<QdsEvent> findByThreadId(@Param("threadId") Integer threadId);

  @Query(
    value = "SELECT * FROM qds_event WHERE thread_id=:threadId AND event_type IN ('END','FORK_IN','JOIN_IN')",
    nativeQuery = true
  )
  QdsEvent getLastEvent(@Param("threadId") Integer threadId);

  @Query(
    value = "SELECT * FROM qds_event WHERE thread_id=:threadId AND event_type IN ('START','FORK_OUT','JOIN_OUT')",
    nativeQuery = true
  )
  QdsEvent getFirstEvent(Integer threadId);

  @Query(
    value = "SELECT e.* FROM qds_event e " +
    "JOIN qds_thread t ON e.thread_id = t.id WHERE scenario_id=:scenarioId",
    nativeQuery = true
  )
  List<QdsEvent> getScenarioEvents(@Param("scenarioId") Integer scenarioId);

  @Modifying
  @Query(
    value = "DELETE FROM qds_event WHERE thread_id=ANY(:threadIds)",
    nativeQuery = true
  )
  void deleteThreadEvents(@Param("threadIds") Integer[] threadIds);

  @Modifying
  @Query(
    value = """
    WITH last_normal_times AS (
        SELECT thread_id, MAX(event_time) AS last_time
        FROM qds_event
        WHERE event_type != 'JOIN_IN'
        GROUP BY thread_id
    )
    UPDATE qds_event e
    SET
    event_type = 'END',
    event_time = lnt.last_time + 1,
    branching_id = NULL
    --TITLE i DESCRIPTION zostają puste
    FROM last_normal_times lnt
    WHERE e.thread_id = lnt.thread_id
    AND e.event_type = 'JOIN_IN'
    AND branching_id=:joinId
    """,
    nativeQuery = true
  )
  void replaceJoinEvents(@Param("joinId") Integer joinId);

  @Modifying
  @Query(
    value = """
        UPDATE qds_event e
        SET
            event_type = 'END',
            event_time = (
                SELECT MAX(event_time) + 1
                FROM qds_event
                WHERE thread_id = e.thread_id
                AND event_type != 'FORK_IN'
           ),
           branching_id = NULL
            --TITLE i DESCRIPTION zostają puste
        WHERE e.event_type = 'FORK_IN'
        AND e.branching_id = :forkId
    """,
    nativeQuery = true
  )
  void replaceForkEvent(@Param("forkId") Integer forkId);

  @Query(
    value = "SELECT e.id FROM qds_event e JOIN qds_thread t ON e.thread_id = t.id " +
    "WHERE event_time=:time AND scenario_id=:scenarioId",
    nativeQuery = true
  )
  List<Integer> getScenarioEventIdsInTime(Integer scenarioId, Integer time);

  @Modifying
  @Query(
    value = """
    DELETE FROM qds_event
    WHERE branching_id = ANY(:branchingIds)
    """,
    nativeQuery = true
  )
  void deleteEventsForBranchings(@Param("branchingIds") Integer[] branchingIds);
}
