package api.database.classes.mappers;

import api.database.classes.enums.QdsBranchingType;
import api.database.classes.threads.response.QdsBranching;
import api.database.classes.threads.response.QdsEvent;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.RowMapper;

public class QdsBranchingRowMapper implements RowMapper<QdsBranching> {

  @Override
  public QdsBranching mapRow(ResultSet rs, int rowNum) throws SQLException {
    Integer event = rs.getObject("event_id", Integer.class);
    Integer[][] objectTransfer = (Integer[][]) rs
      .getArray("object_transfer")
      .getArray();
    return new QdsBranching(
      rs.getInt("id"),
      QdsBranchingType.valueOf(rs.getString("branching_type")),
      (Integer[]) rs.getArray("coming_in").getArray(),
      (Integer[]) rs.getArray("coming_out").getArray(),
      event == null
        ? null
        : new QdsEvent(
          event,
          rs.getString("title"),
          rs.getString("description")
        ),
      rs.getInt("d_time"),
      Arrays.stream(objectTransfer)
        // Process inner arrays
        .map(innerArray ->
          Arrays.stream(innerArray)
            // Filter out null elements within inner arrays
            .filter(Objects::nonNull)
            .collect(Collectors.toList())
        )
        .collect(Collectors.toList())
    );
  }
}
