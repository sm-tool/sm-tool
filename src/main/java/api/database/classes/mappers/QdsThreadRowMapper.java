package api.database.classes.mappers;

import api.database.classes.threads.response.QdsThread;
import java.sql.ResultSet;
import java.sql.SQLException;
//import java.util.List;
import org.springframework.jdbc.core.RowMapper;

public class QdsThreadRowMapper implements RowMapper<QdsThread> {

  @Override
  public QdsThread mapRow(ResultSet rs, int rowNum) throws SQLException {
    return new QdsThread(
      rs.getInt("id"),
      rs.getString("title"),
      rs.getString("description") //,
      //List.of()
    );
  }
}
