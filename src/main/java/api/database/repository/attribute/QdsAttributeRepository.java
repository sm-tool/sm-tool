package api.database.repository.attribute;

import api.database.entity.object.QdsAttribute;
import api.database.model.constant.QdsAttributeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsAttributeRepository
  extends JpaRepository<QdsAttribute, Integer> {
  @Query(
    value = "SELECT type FROM qds_attribute a JOIN qds_attribute_template t ON a.attribute_template_id = t.id" +
    " WHERE a.id=:id",
    nativeQuery = true
  )
  QdsAttributeType getAttributeType(@Param("id") Integer id);
}
