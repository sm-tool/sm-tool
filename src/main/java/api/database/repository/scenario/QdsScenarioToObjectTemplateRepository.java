package api.database.repository.scenario;

import api.database.entity.scenario.QdsScenarioToObjectTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface QdsScenarioToObjectTemplateRepository
  extends JpaRepository<QdsScenarioToObjectTemplate, Integer> {
  @Modifying
  @Transactional
  @Query(
    value = """
    INSERT INTO qds_scenario_to_object_template (id, scenario_id, template_id)
    SELECT nextval('qds_scenario_to_object_template_id_seq'), :targetScenarioId, template_id
    FROM qds_scenario_to_object_template
    WHERE scenario_id = :sourceScenarioId
    ON CONFLICT (scenario_id, template_id) DO NOTHING;
    """,
    nativeQuery = true
  )
  void copyObjectTemplatesBetweenScenarios(
    @Param("sourceScenarioId") Integer sourceScenarioId,
    @Param("targetScenarioId") Integer targetScenarioId
  );
}
