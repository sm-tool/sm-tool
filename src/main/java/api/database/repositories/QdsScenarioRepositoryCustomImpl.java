package api.database.repositories;

import api.database.classes.QdsScenarioDetails;
import api.database.classes.mappers.QdsScenarioDetailsRowMapper;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class QdsScenarioRepositoryCustomImpl
  implements QdsScenarioRepositoryCustom {

  private final JdbcTemplate jdbcTemplate;

  @Autowired
  public QdsScenarioRepositoryCustomImpl(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Override
  public List<QdsScenarioDetails> findScenarioList(Integer userId) {
    String sql =
      "SELECT title, first_name, last_name, last_modified FROM get_scenario_list(?)";
    return jdbcTemplate.query(sql, new QdsScenarioDetailsRowMapper(), userId);
  }
}
