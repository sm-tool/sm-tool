package api.database.controller.object;

import api.database.entity.object.ObjectType;
import api.database.model.request.AssignIdsRequest;
import api.database.model.request.save.ObjectTypeSaveRequest;
import api.database.service.core.ObjectTypeManager;
import api.database.service.core.provider.ObjectTypeProvider;
import api.database.service.global.ObjectTypeService;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/api/object-types")
public class ObjectTypeController {

  private final ObjectTypeService objectTypeService;
  private final PagedResourcesAssembler<ObjectType> pagedResourcesAssembler;
  private final ObjectTypeProvider objectTypeProvider;
  private final ObjectTypeManager objectTypeManager;

  @Autowired
  public ObjectTypeController(
    ObjectTypeService objectTypeService,
    PagedResourcesAssembler<ObjectType> pagedResourcesAssembler,
    ObjectTypeProvider objectTypeProvider,
    ObjectTypeManager objectTypeManager
  ) {
    this.objectTypeService = objectTypeService;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
    this.objectTypeProvider = objectTypeProvider;
    this.objectTypeManager = objectTypeManager;
  }

  //--------------------------------------------------Endpointy GET---------------------------------------------------------

  @GetMapping("/findIdsByScenarioId")
  public List<Integer> findIdsByScenarioId(@RequestHeader Integer scenarioId) {
    return objectTypeProvider.findIdsByScenarioId(scenarioId);
  }

  @GetMapping("/findByScenarioId/{scenarioId}")
  public PagedModel<EntityModel<ObjectType>> getAllObjectTypesInScenario(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort,
    @PathVariable Integer scenarioId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectType> objectTypes = objectTypeProvider.findAll(
      pageable,
      scenarioId
    );
    return pagedResourcesAssembler.toModel(objectTypes);
  }

  @GetMapping
  public PagedModel<EntityModel<ObjectType>> getAllObjectTypes(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort,
    @RequestHeader(required = false) Integer scenarioId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    System.out.println("scenarioId: " + scenarioId);
    Page<ObjectType> objectTypes = objectTypeProvider.findAll(
      pageable,
      scenarioId
    );
    return pagedResourcesAssembler.toModel(objectTypes);
  }

  @GetMapping("/search/findByTitle")
  public PagedModel<EntityModel<ObjectType>> findByTitle(
    @RequestParam("title") String title,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort,
    @RequestHeader(required = false) Integer scenarioId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectType> objectTypes = objectTypeProvider.findByTitleContaining(
      title,
      pageable,
      scenarioId
    );
    return pagedResourcesAssembler.toModel(objectTypes);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/roots")
  public List<ObjectType> getRootTypes(
    @RequestHeader(required = false) Integer scenarioId
  ) {
    return objectTypeProvider.findByParentId(null, true, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/children/{parentId}")
  public List<ObjectType> getChildren(
    @PathVariable Integer parentId,
    @RequestHeader(required = false) Integer scenarioId
  ) {
    return objectTypeProvider.findByParentId(parentId, false, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ObjectType getObjectTypeById(@PathVariable Integer id) {
    return objectTypeProvider.findById(id);
  }

  //--------------------------------------------------Endpointy POST---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PostMapping
  public ObjectType addObjectType(
    @Valid @RequestBody ObjectTypeSaveRequest objectTypeInfo,
    @RequestHeader(required = false) Integer scenarioId
  ) {
    return objectTypeService.addObjectType(objectTypeInfo, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/scenario")
  public void assignObjectTypeToScenario(
    @RequestBody @Valid AssignIdsRequest objectTypeIds,
    @RequestHeader Integer scenarioId
  ) {
    objectTypeManager.assignObjectTypesToScenario(
      objectTypeIds.assign(),
      scenarioId
    );
  }

  //--------------------------------------------------Endpoint PUT---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public ObjectType updateObjectType(
    @PathVariable Integer id,
    @Valid @RequestBody ObjectTypeSaveRequest request
  ) {
    return objectTypeService.updateObjectType(id, request);
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteObjectType(@PathVariable Integer id) {
    objectTypeService.deleteById(id);
  }
}
