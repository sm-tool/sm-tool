package api.database.controller.scenario;

import api.database.entity.scenario.Scenario;
import api.database.model.request.save.ScenarioSaveRequest;
import api.database.service.global.ScenarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.data.web.SortDefault;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scenarios")
public class ScenarioController {

  private final ScenarioService scenarioService;
  private final PagedResourcesAssembler<Scenario> pagedResourcesAssembler;

  @Autowired
  public ScenarioController(
    ScenarioService scenarioService,
    PagedResourcesAssembler<Scenario> pagedResourcesAssembler
  ) {
    this.scenarioService = scenarioService;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
  }

  //--------------------------------------------------Endpointy GET---------------------------------------------------------

  @GetMapping
  public PagedModel<EntityModel<Scenario>> getAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @SortDefault(sort = "id", direction = Sort.Direction.DESC) Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<Scenario> scenarios = scenarioService.findAll(pageable);
    return pagedResourcesAssembler.toModel(scenarios);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public Scenario getById(@PathVariable Integer id) {
    return scenarioService.getScenarioById(id);
  }

  @GetMapping("/search/findByTitle")
  public PagedModel<EntityModel<Scenario>> findByTitle(
    @RequestParam("title") String title,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @SortDefault(sort = "id", direction = Sort.Direction.DESC) Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<Scenario> scenarios = scenarioService.findByTitleContaining(
      title,
      pageable
    );

    return pagedResourcesAssembler.toModel(scenarios);
  }

  @GetMapping("/search/findByDescription")
  public PagedModel<EntityModel<Scenario>> findByDescription(
    @RequestParam("description") String description,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @SortDefault(sort = "id", direction = Sort.Direction.DESC) Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<Scenario> scenarios = scenarioService.findByDescriptionContaining(
      description,
      pageable
    );
    return pagedResourcesAssembler.toModel(scenarios);
  }

  //--------------------------------------------------Endpoint POST---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PostMapping
  public Scenario addScenario(
    @Valid @RequestBody ScenarioSaveRequest scenarioInfo
  ) {
    return scenarioService.addScenario(scenarioInfo);
  }

  //--------------------------------------------------Endpoint PUT---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public Scenario update(
    @PathVariable Integer id,
    @Valid @RequestBody ScenarioSaveRequest scenarioDetails
  ) {
    return scenarioService.updateScenario(id, scenarioDetails);
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void delete(@PathVariable Integer id) {
    scenarioService.deleteScenario(id);
  }
}
