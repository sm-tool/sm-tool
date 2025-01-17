package api.database.repository.thread;

import api.database.entity.thread.Thread;
import api.database.model.domain.thread.InternalThreadBatch;
import api.database.model.response.ThreadResponse;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, Integer> {
  //----------------------------------------Thread Removal Service------------------------------------------------------
  @Modifying
  @Query(
    value = "DELETE FROM qds_thread WHERE id=ANY(:threadIds)",
    nativeQuery = true
  )
  void deleteThreadsById(@Param("threadIds") Integer[] threadId);

  @Query("SELECT t.id FROM Thread t WHERE t.scenarioId = :scenarioId")
  List<Integer> getScenarioThreadIds(@Param("scenarioId") Integer scenarioId);

  //------------------------------------------Thread Service (pobranie wątków)------------------------------------------

  @Query(
    value = """
    WITH start_event_types AS (SELECT unnest(ARRAY ['FORK_OUT', 'JOIN_OUT', 'START']) as type),
         end_event_types AS (SELECT unnest(ARRAY ['FORK_IN', 'JOIN_IN', 'END']) as type)
    SELECT (CASE WHEN t.is_global THEN 0 ELSE t.id END)                as id,
           t.title,
           t.description,
           COALESCE(array_agg(tto.object_id)
               FILTER (WHERE tto.object_id IS NOT NULL), '{}')         as object_ids,
           MIN(e_start.event_time)                                     as start_time,
           MAX(e_end.event_time)                                       as end_time,
           MIN(e_start.branching_id)                                   as incoming_branching_id,
           MAX(e_end.branching_id)                                     as outgoing_branching_id
    FROM qds_thread t
      JOIN qds_event e_start ON t.id = e_start.thread_id
      JOIN start_event_types ON e_start.event_type = start_event_types.type
      JOIN qds_event e_end ON t.id = e_end.thread_id
      JOIN end_event_types ON e_end.event_type = end_event_types.type
      LEFT JOIN qds_thread_to_object tto ON t.id = tto.thread_id
    WHERE t.scenario_id = :scenarioId
      AND (
        :threadId IS NULL
        OR
        t.id = CASE
          WHEN :threadId = 0 THEN (SELECT id FROM qds_thread WHERE scenario_id = :scenarioId AND is_global = true LIMIT 1)
          ELSE :threadId
        END
      )
    GROUP BY t.id, t.title, t.description, t.is_global
    """,
    nativeQuery = true
  )
  List<ThreadResponse> getThreads(
    @Param("threadId") Integer threadId,
    @Param("scenarioId") Integer scenarioId
  );

  //----------------------------------------------Global Thread Manager-------------------------------------------------

  @Query(
    value = "SELECT id FROM qds_thread WHERE is_global=TRUE AND scenario_id=:scenarioId",
    nativeQuery = true
  )
  Integer getGlobalThreadId(@Param("scenarioId") Integer scenarioId);

  //----------------------------------------------Batch-----------------------------------------------------------------

  @Query(
    value = """
    WITH RECURSIVE event_types AS (
          SELECT unnest(ARRAY['FORK_IN', 'JOIN_IN', 'END']) as type
      ),
       fork_chain AS (
          SELECT thread_id,
                 event_type,
                 branching_id
          FROM qds_event e, event_types et
          WHERE thread_id = :threadId
            AND event_type = et.type

          UNION ALL

          -- Idziemy przez FORKi
          SELECT
              next_t.id,
              next_e.event_type,
              next_e.branching_id
          FROM fork_chain fc
              JOIN qds_event e ON e.branching_id = fc.branching_id
              AND e.event_type = 'FORK_OUT'
          JOIN qds_thread next_t ON next_t.id = e.thread_id
          JOIN qds_event next_e ON next_e.thread_id = next_t.id
          JOIN event_types et ON next_e.event_type = et.type
      )
      SELECT
          COALESCE(
              array_agg(DISTINCT thread_id),
              '{}'::INTEGER[]
          ) as threads,
          COALESCE(
              array_agg(DISTINCT branching_id) FILTER (
                  WHERE event_type = 'JOIN_IN'),
              '{}'::INTEGER[]
          ) as joins_to_check,
          COALESCE(
              array_agg(DISTINCT branching_id) FILTER (
                  WHERE event_type = 'FORK_IN'),
              '{}'::INTEGER[]
          ) as forks
      FROM fork_chain;
    """,
    nativeQuery = true
  )
  InternalThreadBatch getThreadBatch(@Param("threadId") Integer threadId);
}
