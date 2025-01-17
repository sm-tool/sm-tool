package api.database.repository.scenario;

import api.database.entity.scenario.ScenarioToObjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ScenarioToObjectTypeRepository
  extends JpaRepository<ScenarioToObjectType, Integer> {
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

  @Query(
    value = """
    INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id)
    SELECT nextval('qds_scenario_to_object_type_id_seq'), :scenarioId, id
    FROM qds_object_type WHERE is_base_type = TRUE;
    """,
    nativeQuery = true
  )
  @Modifying
  void addBaseTypes(@Param("scenarioId") Integer scenarioId);

  @Modifying
  @Transactional
  @Query(
    value = """
    INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id)
    SELECT nextval('qds_scenario_to_object_type_id_seq'), :targetScenarioId, object_type_id
    FROM qds_scenario_to_object_type
    WHERE scenario_id = :sourceScenarioId
    ON CONFLICT (scenario_id, object_type_id) DO NOTHING;
    """,
    nativeQuery = true
  )
  void copyObjectTypesBetweenScenarios(
    @Param("sourceScenarioId") Integer sourceScenarioId,
    @Param("targetScenarioId") Integer targetScenarioId
  );

  @Query(
    value = "SELECT EXISTS (SELECT 1 FROM qds_scenario_to_object_type WHERE scenario_id = :scenarioId AND object_type_id = :objectTypeId)",
    nativeQuery = true
  )
  boolean existsByScenarioIdAndObjectTypeId(
    @Param("scenarioId") Integer scenarioId,
    @Param("objectTypeId") Integer objectTypeId
  );
}
