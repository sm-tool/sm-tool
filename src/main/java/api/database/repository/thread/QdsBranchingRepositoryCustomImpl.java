package api.database.repository.thread;

import api.database.model.branching.QdsResponseBranching;
import api.database.model.internal.mappers.QdsBranchingRowMapper;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;

public class QdsBranchingRepositoryCustomImpl
  implements QdsBranchingRepositoryCustom {

  private final JdbcTemplate jdbcTemplate;

  public QdsBranchingRepositoryCustomImpl(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public List<QdsResponseBranching> getBranchingForScenario(
    Integer scenarioId
  ) {
    String sql =
      """
            WITH branching_events AS (
                SELECT
                    e.branching_id,
                    e.thread_id,
                    e.event_type,
                    ARRAY_AGG(qto.object_id ORDER BY qto.object_id) FILTER (WHERE qto.object_id IS NOT NULL) as thread_objects
                FROM qds_event e
                LEFT JOIN qds_thread_to_object qto ON qto.thread_id = e.thread_id
                WHERE e.branching_id IN (SELECT id FROM qds_branching WHERE scenario_id = ?)
                    AND e.event_type IN ('FORK_IN', 'JOIN_IN', 'FORK_OUT', 'JOIN_OUT')
                GROUP BY e.branching_id, e.thread_id, e.event_type
            )
            SELECT
                b.id,
                b.branching_type,
                b.is_correct,
                b.title,
                b.description,
                b.branching_time,
                (
                    SELECT ARRAY_AGG(thread_id ORDER BY thread_id)
                    FROM branching_events
                    WHERE branching_id = b.id AND event_type IN ('FORK_IN', 'JOIN_IN')
                ) AS coming_in,
                (
                    SELECT ARRAY_AGG(thread_id ORDER BY thread_id)
                    FROM branching_events
                    WHERE branching_id = b.id AND event_type IN ('FORK_OUT', 'JOIN_OUT')
                ) AS coming_out,
                CASE
                    WHEN b.branching_type = 'FORK' THEN
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', thread_id,
                                'objectIds', thread_objects
                            ) ORDER BY thread_id
                        )
                        FROM branching_events
                        WHERE branching_id = b.id AND event_type IN ('FORK_OUT', 'JOIN_OUT')
                    )
                END AS object_transfer
            FROM qds_branching b
            WHERE b.scenario_id = ?;
      """;
    return jdbcTemplate.query(
      sql,
      new QdsBranchingRowMapper(),
      scenarioId,
      scenarioId
    );
  }

  public QdsResponseBranching getOneBranching(Integer branchingId) {
    String sql =
      """
          WITH branching_events AS (
                SELECT
                    e.branching_id,
                    e.thread_id,
                    e.event_type,
                    ARRAY_AGG(qto.object_id ORDER BY qto.object_id) FILTER (WHERE qto.object_id IS NOT NULL) as thread_objects
                FROM qds_event e
                LEFT JOIN qds_thread_to_object qto ON qto.thread_id = e.thread_id
                WHERE e.branching_id = ?
                    AND e.event_type IN ('FORK_IN', 'JOIN_IN', 'FORK_OUT', 'JOIN_OUT')
                GROUP BY e.branching_id, e.thread_id, e.event_type
            )
            SELECT
                b.id,
                b.branching_type,
                b.is_correct,
                b.title,
                b.description,
                b.branching_time,
                (
                    SELECT ARRAY_AGG(thread_id ORDER BY thread_id)
                    FROM branching_events
                    WHERE branching_id = b.id AND event_type IN ('FORK_IN', 'JOIN_IN')
                ) AS coming_in,
                (
                    SELECT ARRAY_AGG(thread_id ORDER BY thread_id)
                    FROM branching_events
                    WHERE branching_id = b.id AND event_type IN ('FORK_OUT', 'JOIN_OUT')
                ) AS coming_out,
                CASE
                    WHEN b.branching_type = 'FORK' THEN
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', thread_id,
                                'objectIds', thread_objects
                            ) ORDER BY thread_id
                        )
                        FROM branching_events
                        WHERE branching_id = b.id AND event_type IN ('FORK_OUT', 'JOIN_OUT')
                    )
                END AS object_transfer
            FROM qds_branching b
            WHERE b.id= ?
      """;
    return jdbcTemplate.queryForObject(
      sql,
      new QdsBranchingRowMapper(),
      branchingId,
      branchingId
    );
  }
}
