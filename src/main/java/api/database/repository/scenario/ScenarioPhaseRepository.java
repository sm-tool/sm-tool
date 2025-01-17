package api.database.repository.scenario;

import api.database.entity.scenario.ScenarioPhase;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScenarioPhaseRepository
  extends JpaRepository<ScenarioPhase, Integer> {
  @Query(
    value = "SELECT * " +
    "FROM qds_scenario_phase p WHERE p.scenario_id = :scenarioId",
    nativeQuery = true
  )
  List<ScenarioPhase> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId
  );

  ScenarioPhase findQdsScenarioPhaseById(Integer id);

  @Query(
    value = """
    SELECT EXISTS (
        SELECT 1 FROM qds_scenario_phase
        WHERE scenario_id = :scenarioId
        AND (:excludedPhaseId IS NULL OR id != :excludedPhaseId)
        AND start_time < :endTime
        AND end_time > :startTime
    )
    """,
    nativeQuery = true
  )
  boolean existsOverlappingPhase(
    @Param("scenarioId") Integer scenarioId,
    @Param("startTime") Integer startTime,
    @Param("endTime") Integer endTime,
    @Param("excludedPhaseId") Integer excludedPhaseId
  );
}
