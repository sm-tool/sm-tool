package api.database.repository.branching;

import api.database.entity.thread.Branching;
import api.database.model.domain.thread.InternalBranchingRow;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BranchingRepository extends JpaRepository<Branching, Integer> {
  @Modifying
  @Query(
    value = "DELETE FROM qds_branching WHERE id = ANY(:branchingIds)",
    nativeQuery = true
  )
  void deleteBranchingByIds(@Param("branchingIds") Integer[] branchingIds);

  //--------------------------------------------Scenario Branchings-----------------------------------------------------

  @Query(
    value = "SELECT id FROM qds_branching WHERE scenario_id=:scenarioId",
    nativeQuery = true
  )
  List<Integer> getBranchingIdsForScenario(
    @Param("scenarioId") Integer scenarioId
  );

  //-------------------------------------------Branching provider-------------------------------------------------------

  @Query(
    value = """
    WITH
        event_types AS (SELECT unnest(ARRAY['FORK_IN', 'JOIN_IN', 'FORK_OUT', 'JOIN_OUT']) AS type),
        branching_events AS (
            SELECT
                e.branching_id,
                e.thread_id,
                e.event_type,
                COALESCE(array_agg(qto.object_id ORDER BY qto.object_id)
                    FILTER (WHERE qto.object_id IS NOT NULL),'{}') as thread_objects
            FROM qds_event e
                LEFT JOIN qds_thread_to_object qto ON qto.thread_id = e.thread_id
                JOIN event_types et ON et.type = e.event_type
            WHERE e.branching_id = ANY(:branchingIds)
            GROUP BY e.branching_id, e.thread_id, e.event_type
        )
    SELECT
        b.id,
        b.branching_type,
        b.is_correct,
        b.title,
        b.description,
        b.branching_time,
        be.thread_id,
        be.event_type,
        be.thread_objects
    FROM qds_branching b
        LEFT JOIN branching_events be ON be.branching_id = b.id
    WHERE b.id = ANY(:branchingIds)
    """,
    nativeQuery = true
  )
  List<InternalBranchingRow> getBranchingsByIds(
    @Param("branchingIds") Integer[] branchingIds
  );

  //Potencjalnie niepoprawny fork
  @Query(
    value = """
        WITH RECURSIVE flow_trace AS (
            SELECT
                e.id,
                e.event_type,
                e.branching_id,
                e.thread_id
            FROM qds_event e
            WHERE e.thread_id = :threadId
              AND e.event_type IN ('FORK_IN', 'JOIN_IN')

            UNION ALL

            -- dla każdego JOIN_IN znajdź następny event końcowy
                SELECT
                e2.id,
                e2.event_type,
                e2.branching_id,
                e2.thread_id
            FROM flow_trace ft
                -- znajdź JOIN_OUT o tym samym branching_id
                JOIN qds_event e1 ON e1.branching_id = ft.branching_id
                AND e1.event_type = 'JOIN_OUT'
                -- w wątku tego JOIN_OUT znajdź event końcowy
                JOIN qds_event e2 ON e2.thread_id = e1.thread_id
                AND e2.event_type IN ('FORK_IN', 'JOIN_IN')
            WHERE ft.event_type = 'JOIN_IN'
        )
        SELECT branching_id
        FROM flow_trace
        WHERE event_type = 'FORK_IN'
        LIMIT 1
    """,
    nativeQuery = true
  )
  Integer getFirstForkId(Integer threadId);
}
