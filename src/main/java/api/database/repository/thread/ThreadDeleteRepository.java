package api.database.repository.thread;

import api.database.model.internal.mappers.QdsInternalThreadRemovalBatchRowMapper;
import api.database.model.internal.thread.QdsInternalIncorrectJoin;
import api.database.model.internal.thread.QdsInternalThreadRemovalBatch;
import java.util.List;
import org.springframework.jdbc.core.DataClassRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ThreadDeleteRepository {

  private final NamedParameterJdbcTemplate jdbcTemplate;

  public ThreadDeleteRepository(NamedParameterJdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public QdsInternalThreadRemovalBatch findThreadsToRemove(Integer threadId) {
    String sql =
      """
      WITH RECURSIVE fork_chain AS (
          -- Start od wątku do usunięcia
          SELECT
              thread_id,
              event_type,
              branching_id
          FROM qds_event e
          WHERE thread_id = :threadId
            AND event_type IN ('FORK_IN', 'JOIN_IN', 'END')

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
              AND next_e.event_type IN ('FORK_IN', 'JOIN_IN', 'END')
      )
      SELECT
          COALESCE(
              array_agg(DISTINCT thread_id),
              '{}'::INTEGER[]
          ) as threads_to_delete,
          COALESCE(
              array_agg(DISTINCT branching_id) FILTER (
                  WHERE event_type = 'JOIN_IN'),
              '{}'::INTEGER[]
          ) as joins_to_check,
          COALESCE(
              array_agg(DISTINCT branching_id) FILTER (
                  WHERE event_type = 'FORK_IN'),
              '{}'::INTEGER[]
          ) as forks_to_delete
      FROM fork_chain;
      """;
    MapSqlParameterSource params = new MapSqlParameterSource()
      .addValue("threadId", threadId);
    return jdbcTemplate.queryForObject(
      sql,
      params,
      new QdsInternalThreadRemovalBatchRowMapper()
    );
  }

  public List<QdsInternalIncorrectJoin> getIncorrectJoins(Integer scenarioId) {
    String sql =
      """
          SELECT
              b.id as join_id,
              (SELECT e.thread_id FROM qds_event e
              WHERE e.branching_id = b.id AND e.event_type = 'JOIN_IN') as input_thread_id,
              (SELECT e.thread_id FROM qds_event e
              WHERE e.branching_id = b.id AND e.event_type = 'JOIN_OUT') as output_thread_id
              FROM qds_branching b
              WHERE b.branching_type = 'JOIN' AND scenario_id=:scenarioId
                  AND (
                      SELECT count(*)
                      FROM qds_event e
                      WHERE e.branching_id = b.id
                      AND e.event_type = 'JOIN_IN'
                  ) = 1;
      """;
    MapSqlParameterSource params = new MapSqlParameterSource()
      .addValue("scenarioId", scenarioId);
    return jdbcTemplate.query(
      sql,
      params,
      new DataClassRowMapper<>(QdsInternalIncorrectJoin.class)
    );
  }
}
