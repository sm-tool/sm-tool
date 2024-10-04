package api.database.classes.mappers;

import api.database.classes.user.QdsUserInfo;
import api.database.classes.user.QdsUserInfoWithSession;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class QdsUserInfoWithSessionRowMapper
  implements RowMapper<QdsUserInfoWithSession> {

  @Override
  public QdsUserInfoWithSession mapRow(ResultSet rs, int rowNum)
    throws SQLException {
    return new QdsUserInfoWithSession(
      rs.getString("session_token"),
      new QdsUserInfo(
        rs.getString("email"),
        rs.getString("first_name"),
        rs.getString("last_name"),
        rs.getString("avatar")
      )
    );
  }
}
