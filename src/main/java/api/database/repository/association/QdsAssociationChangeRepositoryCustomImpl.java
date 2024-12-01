package api.database.repository.association;

import api.database.model.association.QdsInfoAssociationLastChange;
import api.database.model.internal.association.QdsInternalAssociationChangeEvent;
import api.database.model.internal.mappers.QdsInfoAssociationLastChangeRowMapper;
import java.util.List;
import org.springframework.jdbc.core.DataClassRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

public class QdsAssociationChangeRepositoryCustomImpl
  implements QdsAssociationChangeRepositoryCustom {

  private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

  public QdsAssociationChangeRepositoryCustomImpl(
    NamedParameterJdbcTemplate namedParameterJdbcTemplate
  ) {
    this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
  }

  public List<QdsInfoAssociationLastChange> getLastAssociationChanges(
    List<Integer> objectIds,
    Integer eventTime
  ) {
    String sql =
      """
          --Przefiltrowane asocjacje
          WITH filtered_associations AS (SELECT *
                                      FROM qds_association
                                      WHERE object1_id IN (:objectIds)
                                          OR object2_id IN (:objectIds)),
          -- Dla każdej asocjacji - jedna najnowsza zmiana jednak nie nowsza niż podany czas
              last_changes AS (SELECT DISTINCT ON (c.association_id) c.association_id,
                                                                  c.association_operation,
                                                                      e.event_time
                                FROM qds_association_change c
                                         JOIN qds_event e ON c.event_id = e.id
                                WHERE c.association_id IN (SELECT id FROM filtered_associations)
                                  AND e.event_time < :eventTime
                                ORDER BY c.association_id, e.event_time DESC)
          SELECT fa.object1_id,
                 fa.object2_id,
                 lc.association_operation
          FROM filtered_associations fa
                   JOIN last_changes lc ON fa.id = lc.association_id
          ORDER BY fa.id;
      """;
    // Parametry do zapytania
    MapSqlParameterSource parameters = new MapSqlParameterSource()
      .addValue("objectIds", objectIds)
      .addValue("eventTime", eventTime);

    // Wykonanie zapytania i mapowanie wyników
    return namedParameterJdbcTemplate.query(
      sql,
      parameters,
      new QdsInfoAssociationLastChangeRowMapper()
    );
  }

  public List<QdsInternalAssociationChangeEvent> getAssociationChanges(
    List<Integer> eventIds
  ) {
    String sql =
      "SELECT a.association_type_id, a.object1_id, a.object2_id, c.event_id, c.association_operation FROM qds_association_change c JOIN qds_association a ON c.association_id = a.id " +
      "WHERE c.event_id IN (:eventIds)";

    MapSqlParameterSource parameters = new MapSqlParameterSource()
      .addValue("eventIds", eventIds);
    return namedParameterJdbcTemplate.query(
      sql,
      parameters,
      new DataClassRowMapper<>(QdsInternalAssociationChangeEvent.class)
    );
  }
}
