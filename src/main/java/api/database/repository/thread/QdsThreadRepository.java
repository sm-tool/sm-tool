package api.database.repository.thread;

import api.database.entity.thread.QdsThread;
import api.database.model.thread.QdsResponseThreadWithObjects;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsThreadRepository extends JpaRepository<QdsThread, Integer> {
  @Query(
    value = "SELECT EXISTS(SELECT 1 FROM qds_event " +
    "WHERE thread_id=:threadId AND event_type='START')",
    nativeQuery = true
  )
  Boolean checkIfThreadWithStart(Integer threadId);

  @Query(
    value = "SELECT id FROM qds_thread WHERE is_global=TRUE AND scenario_id=:scenarioId",
    nativeQuery = true
  )
  Integer getGlobalThreadId(@Param("scenarioId") Integer scenarioId);

  @Query(
    value = """
        SELECT
            (CASE WHEN t.is_global = TRUE THEN 0 ELSE t.id END) AS id,
            t.title,
            t.description,
            COALESCE(array_agg(o.object_id) FILTER (WHERE o.object_id IS NOT NULL), '{}') AS object_ids
        FROM qds_thread t
        LEFT JOIN qds_thread_to_object o ON t.id = o.thread_id
        WHERE t.scenario_id = :scenarioId
        GROUP BY t.id, t.title, t.description, t.is_global
    """,
    nativeQuery = true
  )
  List<QdsResponseThreadWithObjects> getScenarioThreadsWithObjects(
    @Param("scenarioId") Integer scenarioId
  );

  @Modifying
  @Query(
    value = "DELETE FROM qds_thread WHERE id=ANY(:threadIds)",
    nativeQuery = true
  )
  void deleteThreadsById(@Param("threadIds") Integer[] threadId);

  @Query("SELECT t.id FROM QdsThread t WHERE t.scenarioId = :scenarioId")
  List<Integer> getScenarioThreadIds(@Param("scenarioId") Integer scenarioId);

  @Modifying
  @Query("DELETE FROM QdsThread t WHERE t.scenario.id = :scenarioId")
  void deleteThreadsByScenarioId(@Param("scenarioId") Integer scenarioId);
}
