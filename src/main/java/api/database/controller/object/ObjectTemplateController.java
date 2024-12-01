package api.database.controller.object;

import api.database.entity.object.QdsObjectTemplate;
import api.database.model.object.QdsInfoAddObjectTemplate;
import api.database.service.template.ObjectTemplateService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/object-template")
public class ObjectTemplateController {

  private final ObjectTemplateService objectTemplateService;

  @Autowired
  public ObjectTemplateController(ObjectTemplateService objectTemplateService) {
    this.objectTemplateService = objectTemplateService;
  }

  @PostMapping("/add")
  public ResponseEntity<Integer> addObjectTemplate(
    @RequestBody QdsInfoAddObjectTemplate objectTemplate,
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(
      objectTemplateService.addObjectTemplate(objectTemplate, scenarioId)
    );
  }

  @GetMapping("/one")
  public ResponseEntity<QdsObjectTemplate> getOneObjectTemplate(
    @RequestHeader Integer templateId
  ) {
    return ResponseEntity.ok(objectTemplateService.getTemplate(templateId));
  }

  @GetMapping("/list/scenario")
  public ResponseEntity<Page<QdsObjectTemplate>> getScenarioObjectTemplates(
    @RequestHeader Integer scenarioId,
    @PageableDefault(size = 20, sort = "title") Pageable pageable
  ) {
    Page<QdsObjectTemplate> templates =
      objectTemplateService.getScenarioTemplates(scenarioId, pageable);
    return ResponseEntity.ok(templates);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteObjectTemplate(@PathVariable Integer id) {
    objectTemplateService.deleteTemplate(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/list/scenario-object-type")
  public ResponseEntity<List<QdsObjectTemplate>> getTemplatesByScenarioId(
    @RequestHeader("scenarioId") Integer scenarioId,
    @RequestParam(value = "objectTypeId", required = false) Integer objectTypeId
  ) {
    List<QdsObjectTemplate> templates =
      objectTemplateService.getTemplatesByScenarioIdAndObjectType(
        scenarioId,
        objectTypeId
      );
    return ResponseEntity.ok(templates);
  }

  @PostMapping("/copy/{sourceScenarioId}/to/{targetScenarioId}")
  public void copyObjectTemplatesBetweenScenarios(
    @PathVariable Integer sourceScenarioId,
    @PathVariable Integer targetScenarioId
  ) {
    objectTemplateService.copyObjectTemplatesBetweenScenarios(
      sourceScenarioId,
      targetScenarioId
    );
  }
}
