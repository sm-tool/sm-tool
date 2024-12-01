package api.database.repository.scenario;

import api.database.entity.scenario.QdsScenario;
import api.database.entity.scenario.QdsScenarioPhase;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsScenarioPhaseRepository
  extends JpaRepository<QdsScenarioPhase, Integer> {
  @Query(
    value = "SELECT * " +
    "FROM qds_scenario_phase p WHERE p.scenario_id = :scenarioId",
    nativeQuery = true
  )
  List<QdsScenarioPhase> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId
  );

  QdsScenarioPhase findQdsScenarioPhaseById(Integer id);
}
