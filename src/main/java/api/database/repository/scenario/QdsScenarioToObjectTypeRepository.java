package api.database.repository.scenario;

import api.database.entity.scenario.QdsScenarioToObjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface QdsScenarioToObjectTypeRepository
  extends JpaRepository<QdsScenarioToObjectType, Integer> {
  @Query(
    value = """
    INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id)
    SELECT nextval('qds_scenario_to_object_type_id_seq'), :scenarioId, actor_type_id
    FROM qds_configuration
    WHERE id = :configId
    UNION ALL
    SELECT nextval('qds_scenario_to_object_type_id_seq'), :scenarioId, observer_type_id
    FROM qds_configuration
    WHERE id = :configId
    """,
    nativeQuery = true
  )
  @Modifying
  void addDefaultTypes(
    @Param("scenarioId") Integer scenarioId,
    @Param("configId") Integer configId
  );

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
}
