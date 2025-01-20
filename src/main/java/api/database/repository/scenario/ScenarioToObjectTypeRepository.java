package api.database.repository.scenario;

import api.database.entity.scenario.ScenarioToObjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScenarioToObjectTypeRepository
  extends JpaRepository<ScenarioToObjectType, Integer> {
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

  @Query(
    value = "SELECT EXISTS (SELECT 1 FROM qds_scenario_to_object_type WHERE scenario_id = :scenarioId AND object_type_id = :objectTypeId)",
    nativeQuery = true
  )
  boolean existsByScenarioIdAndObjectTypeId(
    @Param("scenarioId") Integer scenarioId,
    @Param("objectTypeId") Integer objectTypeId
  );

  @Modifying
  @Query(
    value = """
    INSERT INTO qds_scenario_to_object_type(id, scenario_id, object_type_id)
    SELECT nextval('qds_scenario_to_object_type_id_seq'), :scenarioId, type_id
    FROM UNNEST(:typeIds) AS type_id
    ON CONFLICT DO NOTHING;
    """,
    nativeQuery = true
  )
  void addTypesToScenario(
    @Param("scenarioId") Integer scenarioId,
    @Param("typeIds") Integer[] typeIds
  );
}
