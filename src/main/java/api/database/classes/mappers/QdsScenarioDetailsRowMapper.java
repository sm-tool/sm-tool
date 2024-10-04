package api.database.classes.mappers;

import api.database.classes.QdsScenarioDetails;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import org.springframework.jdbc.core.RowMapper;

public class QdsScenarioDetailsRowMapper
  implements RowMapper<QdsScenarioDetails> {

  @Override
  public QdsScenarioDetails mapRow(ResultSet rs, int rowNum)
    throws SQLException {
    return new QdsScenarioDetails(
      rs.getString("title"),
      rs.getString("first_name"),
      rs.getString("last_name"),
      rs.getObject("last_modified", LocalDateTime.class)
    );
  }
}
