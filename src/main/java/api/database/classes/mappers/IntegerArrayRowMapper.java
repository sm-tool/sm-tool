package api.database.classes.mappers;

import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class IntegerArrayRowMapper implements RowMapper<Integer[]> {

  @Override
  public Integer[] mapRow(ResultSet rs, int rowNum) throws SQLException {
    Array sqlArray = rs.getArray(1);
    return (Integer[]) sqlArray.getArray();
  }
}
