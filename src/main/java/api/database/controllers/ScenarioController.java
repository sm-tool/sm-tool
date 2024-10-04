package api.database.controllers;

import api.database.classes.QdsScenarioDetails;
import api.database.entities.QdsScenario;
import api.database.services.ScenarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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

  // GET all scenarios - lista wymaga scenariusza +
  // użytkownika (aktuanie GLOBAL) + uprawnień (aktualnie dla GLOBALA) + co najmniej 1 wpisu w historii
  @GetMapping("/list")
  public ResponseEntity<List<QdsScenarioDetails>> getAllScenarios() {
    //Interceptorem z SID
    List<QdsScenarioDetails> scenarios = scenarioService.getScenarioList(0);
    return ResponseEntity.ok(scenarios);
  }

  // GET scenario by ID
  @GetMapping("/one")
  public ResponseEntity<QdsScenario> getScenarioById(
    @RequestHeader("scenario") Integer id
  ) {
    QdsScenario scenario = scenarioService.getScenarioById(id);
    if (scenario != null) {
      return ResponseEntity.ok(scenario);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping("/add")
  public ResponseEntity<QdsScenario> createScenario(
    @Valid @RequestBody QdsScenario scenario
  ) {
    QdsScenario createdScenario = scenarioService.addScenario(scenario);
    return ResponseEntity.ok(createdScenario);
  }
  //  // POST a new scenario
  //  @PostMapping
  //  public ResponseEntity<QdsScenario> createScenario(
  //    @RequestBody QdsScenario scenario
  //  ) {
  //    QdsScenario createdScenario = scenarioService.saveScenario(scenario);
  //    return ResponseEntity.ok(createdScenario);
  //  }
  //
  //  // PUT to update an existing scenario
  //  @PutMapping("/{id}")
  //  public ResponseEntity<QdsScenario> updateScenario(
  //    @PathVariable Integer id,
  //    @RequestBody QdsScenario scenarioDetails
  //  ) {
  //    QdsScenario updatedScenario = scenarioService.updateScenario(
  //      id,
  //      scenarioDetails
  //    );
  //    return ResponseEntity.ok(updatedScenario);
  //  }
  //
  //  // DELETE scenario by ID
  //  @DeleteMapping("/{id}")
  //  public ResponseEntity<Void> deleteScenario(@PathVariable Integer id) {
  //    scenarioService.deleteScenario(id);
  //    return ResponseEntity.noContent().build();
  //  }
}
