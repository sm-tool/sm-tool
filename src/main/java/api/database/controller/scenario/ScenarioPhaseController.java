package api.database.controller.scenario;

import api.database.entity.scenario.ScenarioPhase;
import api.database.model.request.save.ScenarioPhaseSaveRequest;
import api.database.service.scenario.ScenarioPhaseService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scenario-phases")
public class ScenarioPhaseController {

  private final ScenarioPhaseService scenarioPhaseService;

  public ScenarioPhaseController(ScenarioPhaseService scenarioPhaseService) {
    this.scenarioPhaseService = scenarioPhaseService;
  }

  //--------------------------------------------------Endpoint GET---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public List<ScenarioPhase> getScenarioPhases(
    @RequestHeader("scenarioId") Integer scenarioId
  ) {
    return scenarioPhaseService.getScenarioPhases(scenarioId);
  }

  //--------------------------------------------------Endpoint POST---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PostMapping
  public ScenarioPhase addScenarioPhase(
    @RequestHeader("scenarioId") Integer scenarioId,
    @Valid @RequestBody ScenarioPhaseSaveRequest phase
  ) {
    return scenarioPhaseService.addScenarioPhase(phase, scenarioId);
  }

  //--------------------------------------------------Endpoint PUT---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public ScenarioPhase updateScenarioPhase(
    @PathVariable Integer id,
    @Valid @RequestBody ScenarioPhaseSaveRequest phase
  ) {
    return scenarioPhaseService.updatePhase(id, phase);
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteScenarioPhase(@PathVariable Integer id) {
    scenarioPhaseService.deleteScenarioPhaseById(id);
  }
}
