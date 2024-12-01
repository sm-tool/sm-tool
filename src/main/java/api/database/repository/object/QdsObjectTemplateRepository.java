package api.database.repository.object;

import api.database.entity.object.QdsObjectTemplate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QdsObjectTemplateRepository
  extends JpaRepository<QdsObjectTemplate, Integer> {
  @Query(
    "SELECT t FROM QdsObjectTemplate t " +
    "JOIN QdsScenarioToObjectTemplate s2t ON t.id = s2t.templateId " +
    "WHERE s2t.scenarioId = :scenarioId"
  )
  Page<QdsObjectTemplate> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  @Query(
    "SELECT stot.template FROM QdsScenarioToObjectTemplate stot " +
    "WHERE stot.scenario.id = :scenarioId " +
    "AND (:objectTypeId IS NULL OR stot.template.objectTypeId = :objectTypeId)"
  )
  List<QdsObjectTemplate> findTemplatesByScenarioIdAndObjectTypeId(
    @Param("scenarioId") Integer scenarioId,
    @Param("objectTypeId") Integer objectTypeId
  );
}
