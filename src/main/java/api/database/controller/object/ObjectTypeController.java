package api.database.controller.object;

import api.database.entity.object.QdsObjectType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.service.object.ObjectTypeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/object-type")
public class ObjectTypeController {

  private final ObjectTypeService objectTypeService;

  @Autowired
  public ObjectTypeController(ObjectTypeService objectTypeService) {
    this.objectTypeService = objectTypeService;
  }

  @GetMapping
  public List<QdsObjectType> getAllObjectTypes() {
    return objectTypeService.getAllObjectTypes();
  }

  @GetMapping("/{id}")
  public QdsObjectType getObjectType(@PathVariable Integer id) {
    return objectTypeService
      .findById(id)
      .orElseThrow(() -> new RuntimeException("ObjectType not found"));
  }

  @PostMapping
  public QdsObjectType createObjectType(
    @RequestBody QdsObjectType objectType,
    @RequestHeader Integer scenarioId
  ) {
    if (objectType.getId() != null) throw new ApiException(
      ErrorCode.WRONG_ENDPOINT,
      ErrorGroup.OBJECT_TYPE,
      HttpStatus.BAD_REQUEST
    );
    return objectTypeService.saveObjectType(objectType, scenarioId);
  }

  @DeleteMapping("/{id}")
  public void deleteObjectType(@PathVariable Integer id) {
    objectTypeService.deleteById(id);
  }

  @GetMapping("/scenario/{scenarioId}")
  public Page<QdsObjectType> getObjectTypesByScenarioId(
    @PathVariable Integer scenarioId,
    @PageableDefault(size = 20, sort = "title") Pageable pageable
  ) {
    return objectTypeService.findAllByScenarioId(scenarioId, pageable);
  }

  @PostMapping("/copy/{sourceScenarioId}/to/{targetScenarioId}")
  public void copyObjectTypesBetweenScenarios(
    @PathVariable Integer sourceScenarioId,
    @PathVariable Integer targetScenarioId
  ) {
    objectTypeService.copyObjectTypesBetweenScenarios(
      sourceScenarioId,
      targetScenarioId
    );
  }

  @PutMapping("/{id}/title")
  public ResponseEntity<QdsObjectType> updateObjectTypeTitle(
    @PathVariable Integer id,
    @RequestBody QdsObjectType objectTypeDetails
  ) {
    QdsObjectType updatedObjectType = objectTypeService.updateObjectTypeTitle(
      id,
      objectTypeDetails.getTitle(),
      objectTypeDetails.getDescription(),
      objectTypeDetails.getColor(),
      objectTypeDetails.getIsOnlyGlobal(),
      objectTypeDetails.getParentId()
    );
    return ResponseEntity.ok(updatedObjectType);
  }
}
