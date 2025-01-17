package api.database.repository.attribute;

import api.database.entity.object.AttributeTemplate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttributeTemplateRepository
  extends JpaRepository<AttributeTemplate, Integer> {
  @Query(
    """
    SELECT a FROM AttributeTemplate a
    WHERE a.objectTemplateId = :templateId
    ORDER BY a.id
    """
  )
  List<AttributeTemplate> findAllByTemplateId(
    @Param("templateId") Integer templateId
  );
}
