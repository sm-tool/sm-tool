package api.database.classes.mappers;

import api.database.classes.enums.QdsActionType;
//import api.database.classes.threads.dto.QdsThreadActionDTO;
import api.database.classes.threads.response.QdsEvent;
import api.database.classes.threads.response.QdsThreadAction;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class QdsThreadActionRowMapper implements RowMapper<QdsThreadAction> {

  @Override
  public QdsThreadAction mapRow(ResultSet rs, int rowNum) throws SQLException {
    Integer event = rs.getObject("event_id", Integer.class);

    return new QdsThreadAction(
      rs.getInt("thread_id"),
      rs.getInt("id"),
      rs.getInt("d_time"),
      QdsActionType.valueOf(rs.getString("action_type")),
      event == null
        ? null
        : new QdsEvent(
          event,
          rs.getString("title"),
          rs.getString("description")
        ),
      rs.getObject("branching_id", Integer.class)
    );
  }
}
