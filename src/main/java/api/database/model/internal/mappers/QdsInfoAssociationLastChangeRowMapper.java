package api.database.model.internal.mappers;

import api.database.model.association.QdsInfoAssociationLastChange;
import api.database.model.constant.QdsAssociationOperation;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class QdsInfoAssociationLastChangeRowMapper
  implements RowMapper<QdsInfoAssociationLastChange> {

  @Override
  public QdsInfoAssociationLastChange mapRow(ResultSet rs, int rowNum)
    throws SQLException {
    return new QdsInfoAssociationLastChange(
      rs.getInt("object1_id"),
      rs.getInt("object2_id"),
      QdsAssociationOperation.valueOf(rs.getString("association_operation"))
    );
  }
}
