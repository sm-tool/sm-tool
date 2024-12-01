package api.database.controller.scenario;

import api.database.entity.scenario.QdsScenarioPhase;
import api.database.model.scenario.QdsInfoScenarioPhaseAdd;
import api.database.service.scenario.ScenarioPhaseService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scenario-phase")
public class ScenarioPhaseController {

  private final ScenarioPhaseService scenarioPhaseService;

  public ScenarioPhaseController(ScenarioPhaseService scenarioPhaseService) {
    this.scenarioPhaseService = scenarioPhaseService;
  }

  @PostMapping("/add")
  public ResponseEntity<QdsScenarioPhase> addPhase(
    @RequestHeader("scenarioId") Integer scenarioId,
    @RequestBody QdsInfoScenarioPhaseAdd phase
  ) {
    return ResponseEntity.ok(scenarioPhaseService.addPhase(scenarioId, phase));
  }

  @PutMapping("/{id}")
  public ResponseEntity<QdsScenarioPhase> updatePhase(
    @PathVariable Integer id,
    @RequestBody QdsInfoScenarioPhaseAdd phase
  ) {
    return ResponseEntity.ok(scenarioPhaseService.updatePhase(id, phase));
  }

  @GetMapping("/all")
  public ResponseEntity<List<QdsScenarioPhase>> getScenarioPhases(
    @RequestHeader("scenarioId") Integer scenarioId
  ) {
    return ResponseEntity.ok(
      scenarioPhaseService.getScenarioPhases(scenarioId)
    );
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteScenarioPhase(@PathVariable Integer id) {
    scenarioPhaseService.deleteScenarioPhaseById(id);
    return ResponseEntity.noContent().build();
  }
}
