package api.database.repository.configuration;

import static api.database.service.configuration.ConfigurationService.CONFIG_ID;

import api.database.model.configuration.QdsInfoSetting;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;

public class QdsConfigurationRepositoryCustomImpl
  implements QdsConfigurationRepositoryCustom {

  private static final String PRIVATE_KEY = "KEY";
  private static final Integer DEFAULT_EVENT_DURATION = 10;

  // Zbiór dozwolonych nazw kolumn, aby uniknąć SQL Injection
  private static final Set<String> ALLOWED_COLUMNS = Set.of(
    "default_event_duration"
  );

  private final JdbcTemplate jdbcTemplate;

  public QdsConfigurationRepositoryCustomImpl(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public void initializeConfigurationIfNeeded() {
    //Dodanie konfiguracji
    String sql =
      "INSERT INTO qds_configuration (id, private_key, default_event_duration) " +
      "VALUES (?, ?, ?) ON CONFLICT (id) DO NOTHING";
    if (
      jdbcTemplate.update(
        sql,
        CONFIG_ID,
        PRIVATE_KEY,
        DEFAULT_EVENT_DURATION
      ) ==
      0
    ) return;

    //Dodanie typów
    sql = """
    INSERT INTO qds_object_type
        (id, color, parent_id, is_only_global, title, description)
    VALUES
        (nextval('qds_object_type_id_seq'),'#FF0000', NULL, FALSE, 'ACTOR', 'ACTOR'),
        (nextval('qds_object_type_id_seq'),'#0000FF', NULL, FALSE, 'OBSERVER', 'OBSERVER'),
        (nextval('qds_object_type_id_seq'),'#0000FF', NULL, TRUE, 'BUILDING', 'BUILDING'),
        (nextval('qds_object_type_id_seq'),'#0000FF', NULL, FALSE, 'VEHICLE', 'VEHICLE'),
        (nextval('qds_object_type_id_seq'),'#0000FF', NULL, FALSE, 'RESOURCE', 'RESOURCE'),
        (nextval('qds_object_type_id_seq'),'#0000FF', NULL, TRUE, 'PLACE', 'PLACE')
    RETURNING id, title""";

    List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);

    int actorId = 0;
    int observerId = 0;
    List<Integer> typeIds = new ArrayList<>();

    for (Map<String, Object> row : results) {
      int id = ((Number) row.get("id")).intValue();
      String title = (String) row.get("title");
      typeIds.add(id);
      if ("ACTOR".equals(title)) {
        actorId = id;
      } else if ("OBSERVER".equals(title)) {
        observerId = id;
      }
    }
    sql =
      "UPDATE qds_configuration SET observer_type_id=?, actor_type_id=? WHERE id=?";
    jdbcTemplate.update(sql, observerId, actorId, CONFIG_ID);

    sql =
      "INSERT INTO qds_configuration_basic_types_ids (configuration_id, type_id) VALUES (?, ?)";
    for (Integer typeId : typeIds) {
      jdbcTemplate.update(sql, CONFIG_ID, typeId);
    }
  }

  public String getSetting(String columnName) {
    if (!ALLOWED_COLUMNS.contains(columnName)) {
      throw new ApiException(
        ErrorCode.WRONG_COLUMN_NAME,
        List.of(columnName),
        ErrorGroup.CONFIGURATION,
        HttpStatus.BAD_REQUEST
      );
    }
    String sql = String.format(
      "SELECT %s FROM qds_configuration WHERE id = ?",
      columnName
    );
    return jdbcTemplate.queryForObject(sql, String.class, CONFIG_ID);
  }

  public List<Integer> getTypeIds() {
    String sql =
      "SELECT type_id FROM qds_configuration_basic_types_ids WHERE configuration_id = ?";
    return jdbcTemplate.queryForList(sql, Integer.class, CONFIG_ID);
  }

  public void updateSetting(QdsInfoSetting newSetting) {
    if (!ALLOWED_COLUMNS.contains(newSetting.name())) {
      throw new ApiException(
        ErrorCode.WRONG_COLUMN_NAME,
        List.of(newSetting.name()),
        ErrorGroup.CONFIGURATION,
        HttpStatus.BAD_REQUEST
      );
    }
    String sql = String.format(
      "UPDATE qds_configuration SET %s = ? WHERE id = ?",
      newSetting.name()
    );

    jdbcTemplate.update(sql, newSetting.value(), CONFIG_ID);
  }
}
