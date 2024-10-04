package api.database.classes.mappers;

import api.database.classes.user.QdsUserInfo;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class QdsUserInfoRowMapper implements RowMapper<QdsUserInfo> {

  @Override
  public QdsUserInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
    return new QdsUserInfo(
      rs.getString("email"),
      rs.getString("first_name"),
      rs.getString("last_name"),
      rs.getString("avatar")
    );
  }
}
