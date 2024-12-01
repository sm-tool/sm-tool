package api.database.controller.object;

import api.database.model.QdsResponseUpdateList;
import api.database.model.object.QdsDataObject;
import api.database.model.object.QdsDataObjectSimple;
import api.database.service.object.ObjectService;
import java.util.List;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/object")
public class ObjectController {

  private final ObjectService objectService;

  public ObjectController(ObjectService objectService) {
    this.objectService = objectService;
  }

  @PostMapping
  public ResponseEntity<QdsResponseUpdateList> addObject(
    @RequestHeader("scenarioId") Integer scenarioId,
    @RequestBody QdsDataObject info
  ) {
    return ResponseEntity.ok(objectService.addObject(scenarioId, info));
  }

  @GetMapping
  public ResponseEntity<List<QdsDataObjectSimple>> getObjectsByScenarioId(
    @RequestHeader("scenarioId") Integer scenarioId
  ) {
    List<QdsDataObjectSimple> dataObjects =
      objectService.getObjectsByScenarioId(scenarioId);
    return ResponseEntity.ok(dataObjects);
  }

  //TODO
  @PutMapping
  public ResponseEntity<QdsDataObject> updateObject() {
    throw new NotImplementedException();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteObject(
    @PathVariable("id") Integer objectId
  ) {
    objectService.deleteObjectById(objectId);
    return ResponseEntity.ok(
      "Object with ID " + objectId + " has been deleted."
    );
  }
}
