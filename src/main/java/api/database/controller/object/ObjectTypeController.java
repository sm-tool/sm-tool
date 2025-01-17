package api.database.controller.object;

import api.database.entity.object.ObjectType;
import api.database.model.request.save.ObjectTypeSaveRequest;
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

  @Autowired
  public ObjectTypeController(
    ObjectTypeService objectTypeService,
    PagedResourcesAssembler<ObjectType> pagedResourcesAssembler,
    ObjectTypeProvider objectTypeProvider
  ) {
    this.objectTypeService = objectTypeService;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
    this.objectTypeProvider = objectTypeProvider;
  }

  //--------------------------------------------------Endpointy GET---------------------------------------------------------

  @GetMapping
  public PagedModel<EntityModel<ObjectType>> getAllObjectTypes(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectType> objectTypes = objectTypeProvider.findAll(pageable);
    return pagedResourcesAssembler.toModel(objectTypes);
  }

  @GetMapping("/search/findByTitle")
  public PagedModel<EntityModel<ObjectType>> findByTitle(
    @RequestParam("title") String title,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectType> objectTypes = objectTypeProvider.findByTitleContaining(
      title,
      pageable
    );
    return pagedResourcesAssembler.toModel(objectTypes);
  }

  @GetMapping("/search/findByDescription")
  public PagedModel<EntityModel<ObjectType>> findByDescription(
    @RequestParam("description") String description,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectType> objectTypes =
      objectTypeProvider.findByDescriptionContaining(description, pageable);
    return pagedResourcesAssembler.toModel(objectTypes);
  }

  @GetMapping("/scenario")
  public PagedModel<EntityModel<ObjectType>> getObjectTypesByScenarioId(
    @RequestHeader Integer scenarioId,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectType> objectTypes = objectTypeProvider.findAllByScenarioId(
      scenarioId,
      pageable
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

  //  @PostMapping("/copy/{sourceScenarioId}/to/{targetScenarioId}")
  //  @ResponseStatus(HttpStatus.OK)
  //  public void copyObjectTypesBetweenScenarios(
  //    @PathVariable Integer sourceScenarioId,
  //    @PathVariable Integer targetScenarioId
  //  ) {
  //    objectTypeService.copyObjectTypesBetweenScenarios(
  //      sourceScenarioId,
  //      targetScenarioId
  //    );
  //  }

  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/scenario/{objectTypeId}")
  public void assignObjectTypeToScenario(
    @PathVariable Integer objectTypeId,
    @RequestHeader Integer scenarioId
  ) {
    objectTypeService.assignObjectTypeToScenario(objectTypeId, scenarioId);
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
