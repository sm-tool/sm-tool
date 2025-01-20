package api.database.repository.scenario;

import api.database.entity.scenario.ScenarioToObjectTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ScenarioToObjectTemplateRepository
  extends JpaRepository<ScenarioToObjectTemplate, Integer> {
  /// Sprawdza czy obiekt o danym szablonie może być dodany do scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param templateId identyfikator szablonu
  /// @return true jeśli obiekt może być dodany
  @Query(
    value = """
        SELECT EXISTS(
            SELECT 1 FROM qds_scenario_to_object_template
            WHERE template_id=:templateId AND scenario_id=:scenarioId)
    """,
    nativeQuery = true
  )
  Boolean canAddObjectToScenario(
    @Param("scenarioId") Integer scenarioId,
    @Param("templateId") Integer templateId
  );

  @Modifying
  @Query(
    value = """
    INSERT INTO qds_scenario_to_object_template(id, scenario_id, template_id)
    SELECT nextval('qds_scenario_to_object_template_id_seq'), :scenarioId, template_id
    FROM UNNEST(:templateIds) AS template_id
    ON CONFLICT DO NOTHING;
    """,
    nativeQuery = true
  )
  void addTemplatesToScenario(
    @Param("scenarioId") Integer scenarioId,
    @Param("templateIds") Integer[] templateIds
  );
}
