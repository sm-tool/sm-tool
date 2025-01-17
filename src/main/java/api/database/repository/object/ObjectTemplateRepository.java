package api.database.repository.object;

import api.database.entity.object.ObjectTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ObjectTemplateRepository
  extends JpaRepository<ObjectTemplate, Integer> {
  @Query(
    "SELECT t FROM ObjectTemplate t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))"
  )
  Page<ObjectTemplate> findByTitleContaining(
    @Param("title") String title,
    Pageable pageable
  );

  @Query(
    "SELECT t FROM ObjectTemplate t WHERE LOWER(t.description) LIKE LOWER(CONCAT('%', :description, '%'))"
  )
  Page<ObjectTemplate> findByDescriptionContaining(
    @Param("description") String description,
    Pageable pageable
  );

  @Query("SELECT t FROM ObjectTemplate t WHERE t.objectTypeId = :objectTypeId")
  Page<ObjectTemplate> findByObjectTypeId(
    @Param("objectTypeId") Integer objectTypeId,
    Pageable pageable
  );

  @Query(
    "SELECT t FROM ObjectTemplate t " +
    "JOIN ScenarioToObjectTemplate s2t ON t.id = s2t.templateId " +
    "WHERE s2t.scenarioId = :scenarioId"
  )
  Page<ObjectTemplate> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  @Query(
    "SELECT stot.template FROM ScenarioToObjectTemplate stot " +
    "WHERE stot.scenario.id = :scenarioId " +
    "AND (:objectTypeId IS NULL OR stot.template.objectTypeId = :objectTypeId)"
  )
  Page<ObjectTemplate> findTemplatesByScenarioIdAndObjectTypeId(
    @Param("scenarioId") Integer scenarioId,
    @Param("objectTypeId") Integer objectTypeId,
    Pageable pageable
  );
}
