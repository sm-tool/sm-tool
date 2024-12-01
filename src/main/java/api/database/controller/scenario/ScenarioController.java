package api.database.controller.scenario;

import api.database.entity.scenario.QdsScenario;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.service.scenario.ScenarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scenario")
public class ScenarioController {

  private final ScenarioService scenarioService;

  @Autowired
  public ScenarioController(ScenarioService scenarioService) {
    this.scenarioService = scenarioService;
  }

  @GetMapping("/list")
  public ResponseEntity<Page<QdsScenario>> getAllScenarios(Pageable pageable) {
    Page<QdsScenario> scenarios = scenarioService.getScenarioList(pageable);
    return ResponseEntity.ok(scenarios);
  }

  // GET scenario by ID
  @GetMapping("/one")
  public ResponseEntity<QdsScenario> getScenarioById(
    @RequestHeader("scenarioId") Integer id
  ) {
    QdsScenario scenario = scenarioService.getScenarioById(id);
    if (scenario == null) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SCENARIO,
        HttpStatus.NOT_FOUND
      );
    } else return ResponseEntity.ok(scenario);
  }

  //TODO sprawdzenie
  @PostMapping("/add")
  public ResponseEntity<QdsScenario> createScenario(
    @Valid @RequestBody QdsScenario scenario
  ) {
    QdsScenario createdScenario = scenarioService.addScenario(scenario);
    return ResponseEntity.ok(createdScenario);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteScenario(@PathVariable Integer id) {
    scenarioService.deleteScenario(id);
    return ResponseEntity.ok("Scenario deleted successfully.");
  }

  @PutMapping("/{id}")
  public ResponseEntity<QdsScenario> updateScenario(
    @PathVariable Integer id,
    @RequestBody QdsScenario scenarioDetails
  ) {
    QdsScenario updatedScenario = scenarioService.updateScenario(
      id,
      scenarioDetails
    );
    return ResponseEntity.ok(updatedScenario);
  }
  //  // DELETE scenario by ID
  //  @DeleteMapping("/{id}")
  //  public ResponseEntity<Void> deleteScenario(@PathVariable Integer id) {
  //    scenarioService.deleteScenario(id);
  //    return ResponseEntity.noContent().build();
  //  }
}
