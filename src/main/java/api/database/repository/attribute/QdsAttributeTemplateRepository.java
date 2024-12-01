package api.database.repository.attribute;

import api.database.entity.object.QdsAttributeTemplate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QdsAttributeTemplateRepository
  extends JpaRepository<QdsAttributeTemplate, Integer> {
  @Query(
    "SELECT a FROM QdsAttributeTemplate a " +
    "WHERE a.objectTemplateId = :templateId"
  )
  List<QdsAttributeTemplate> findAllByTemplateId(
    @Param("templateId") Integer templateId
  );
}
