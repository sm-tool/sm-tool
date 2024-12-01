package api.database.model.internal.mappers;

import api.database.model.branching.QdsInfoOffspringObjectTransfer;
import api.database.model.branching.QdsResponseBranching;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.QdsBranchingType;
import api.database.model.exception.ApiException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.RowMapper;

public class QdsBranchingRowMapper implements RowMapper<QdsResponseBranching> {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public QdsResponseBranching mapRow(ResultSet rs, int rowNum)
    throws SQLException {
    //Typ
    QdsBranchingType type = QdsBranchingType.valueOf(
      rs.getString("branching_type")
    );
    //Transfer obiektów (tylko dla fork)
    List<QdsInfoOffspringObjectTransfer> transfers = null;
    if (type == QdsBranchingType.FORK) {
      try {
        String objectTransferJson = rs.getString("object_transfer");
        transfers = objectMapper.readValue(
          objectTransferJson,
          new TypeReference<>() {}
        );
      } catch (JsonProcessingException e) {
        throw new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.SERVER,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    return new QdsResponseBranching(
      rs.getInt("id"),
      type,
      rs.getObject("is_correct", Boolean.class),
      rs.getString("title"),
      rs.getString("description"),
      rs.getInt("branching_time"),
      (Integer[]) rs.getArray("coming_in").getArray(),
      (Integer[]) rs.getArray("coming_out").getArray(),
      transfers
    );
  }
}
