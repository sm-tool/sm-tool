package api.database.model.internal.mappers;

import api.database.model.internal.object.QdsInternalObjectInEvent;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import org.springframework.jdbc.core.RowMapper;

public class QdsInternalObjectInEventRowMapper
  implements RowMapper<QdsInternalObjectInEvent> {

  @Override
  public QdsInternalObjectInEvent mapRow(ResultSet rs, int rowNum)
    throws SQLException {
    return new QdsInternalObjectInEvent(
      rs.getInt("id"),
      Arrays.stream((Integer[]) rs.getArray("attributes").getArray()).toList()
    );
  }
}
