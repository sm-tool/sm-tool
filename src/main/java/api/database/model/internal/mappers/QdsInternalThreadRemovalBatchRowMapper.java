package api.database.model.internal.mappers;

import api.database.model.internal.thread.QdsInternalThreadRemovalBatch;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import org.springframework.jdbc.core.RowMapper;

public class QdsInternalThreadRemovalBatchRowMapper
  implements RowMapper<QdsInternalThreadRemovalBatch> {

  @Override
  public QdsInternalThreadRemovalBatch mapRow(ResultSet rs, int rowNum)
    throws SQLException {
    return new QdsInternalThreadRemovalBatch(
      Arrays.stream(
        ((Integer[]) rs.getArray("threads_to_delete").getArray())
      ).toList(),
      Arrays.stream(
        ((Integer[]) rs.getArray("joins_to_check").getArray())
      ).toList(),
      Arrays.stream(
        ((Integer[]) rs.getArray("forks_to_delete").getArray())
      ).toList()
    );
  }
}
