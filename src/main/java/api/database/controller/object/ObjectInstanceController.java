package api.database.controller.object;

import api.database.model.request.composite.PossibleAssociationRequest;
import api.database.model.request.create.ObjectInstanceCreateRequest;
import api.database.model.request.update.ObjectInstanceUpdateRequest;
import api.database.model.response.ObjectInstanceResponse;
import api.database.model.response.PossibleAssociationResponse;
import api.database.model.response.ThreadObjectsResponse;
import api.database.model.response.UpdateListResponse;
import api.database.service.core.provider.ObjectInstanceProvider;
import api.database.service.object.ObjectInstanceService;
import jakarta.validation.Valid;
import java.util.List;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/objects")
public class ObjectInstanceController {

  private final ObjectInstanceService objectInstanceService;
  private final ObjectInstanceProvider objectInstanceProvider;

  public ObjectInstanceController(
    ObjectInstanceService objectInstanceService,
    ObjectInstanceProvider objectInstanceProvider
  ) {
    this.objectInstanceService = objectInstanceService;
    this.objectInstanceProvider = objectInstanceProvider;
  }

  //--------------------------------------------------Endpoint GET---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public List<ObjectInstanceResponse> getObjects(
    @RequestHeader("scenarioId") Integer scenarioId
  ) {
    return objectInstanceProvider.getObjectsForScenario(scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{objectId}")
  public ObjectInstanceResponse getOneObject(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer objectId
  ) {
    return objectInstanceProvider.getObjectWithAttributes(objectId, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/thread/{threadId}")
  public ThreadObjectsResponse getThreadObjects(
    @PathVariable Integer threadId,
    @RequestHeader Integer scenarioId
  ) {
    return objectInstanceProvider.getObjectsAvailableForThread(
      threadId,
      scenarioId
    );
  }

  @PostMapping("/association")
  public List<PossibleAssociationResponse> getPossibleAssociations(
    @Valid @RequestBody PossibleAssociationRequest request,
    @RequestHeader Integer scenarioId
  ) {
    return objectInstanceProvider.getPossibleAssociations(request, scenarioId);
  }

  //--------------------------------------------------Endpoint POST---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PostMapping
  public ObjectInstanceResponse addObject(
    @RequestHeader("scenarioId") Integer scenarioId,
    @Valid @RequestBody ObjectInstanceCreateRequest info
  ) {
    return objectInstanceService.addObject(scenarioId, info);
  }

  //--------------------------------------------------Endpoint PUT---------------------------------------------------------

  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public ObjectInstanceResponse updateObject(
    @RequestHeader("scenarioId") Integer scenarioId,
    @PathVariable Integer id,
    @Valid @RequestBody ObjectInstanceUpdateRequest request
  ) {
    objectInstanceService.updateObject(id, request);
    return objectInstanceProvider.getObjectWithAttributes(id, scenarioId);
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteObject(@PathVariable("id") Integer objectId) {
    objectInstanceService.deleteObjectById(objectId);
  }
}
