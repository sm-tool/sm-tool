package api.database.repository.object;

import api.database.model.internal.object.QdsInternalObjectInEvent;
import java.util.List;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

public class QdsObjectRepositoryCustomImpl
  implements QdsObjectRepositoryCustom {

  private final NamedParameterJdbcTemplate jdbcTemplate;

  public QdsObjectRepositoryCustomImpl(
    NamedParameterJdbcTemplate jdbcTemplate
  ) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public List<QdsInternalObjectInEvent> getObjectsAvailableForThread(
    Integer threadId,
    Integer globalThreadId
  ) {
    String sql =
      """
      SELECT o.id,
      ARRAY(SELECT id FROM qds_attribute WHERE object_id=o.id)
      FROM qds_object o JOIN qds_thread_to_object tto ON o.id = tto.object_id
      WHERE tto.thread_id = :threadId OR tto.thread_id=:globalThreadId
      """;
    MapSqlParameterSource params = new MapSqlParameterSource()
      .addValue("threadId", threadId)
      .addValue("globalThreadId", globalThreadId);
    return jdbcTemplate.query(sql, params, new BeanPropertyRowMapper<>());
  }
}
