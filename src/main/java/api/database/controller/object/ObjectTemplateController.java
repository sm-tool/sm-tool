package api.database.controller.object;

import api.database.entity.object.ObjectTemplate;
import api.database.model.request.AssignIdsRequest;
import api.database.model.request.create.ObjectTemplateCreateRequest;
import api.database.model.request.update.ObjectTemplateUpdateRequest;
import api.database.service.core.provider.ObjectTemplateProvider;
import api.database.service.global.ObjectTemplateService;
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
@RequestMapping("/api/object-templates")
public class ObjectTemplateController {

  private final ObjectTemplateService objectTemplateService;
  private final ObjectTemplateProvider objectTemplateProvider;
  private final PagedResourcesAssembler<ObjectTemplate> pagedResourcesAssembler;

  @Autowired
  public ObjectTemplateController(
    ObjectTemplateService objectTemplateService,
    ObjectTemplateProvider objectTemplateProvider,
    PagedResourcesAssembler<ObjectTemplate> pagedResourcesAssembler
  ) {
    this.objectTemplateService = objectTemplateService;
    this.objectTemplateProvider = objectTemplateProvider;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
  }

  //--------------------------------------------------Endpointy GET---------------------------------------------------------

  @GetMapping("/findIdsByScenarioId")
  public List<Integer> findIdsByScenarioId(@RequestHeader Integer scenarioId) {
    return objectTemplateProvider.findIdsByScenarioId(scenarioId);
  }

  @GetMapping("/findByScenarioId/{scenarioId}")
  public PagedModel<EntityModel<ObjectTemplate>> getAllTemplatesInScenario(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort,
    @PathVariable Integer scenarioId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectTemplate> templates = objectTemplateProvider.findAllTemplates(
      pageable,
      scenarioId
    );
    return pagedResourcesAssembler.toModel(templates);
  }

  @GetMapping
  public PagedModel<EntityModel<ObjectTemplate>> getAllTemplates(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort,
    @RequestHeader(required = false) Integer scenarioId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectTemplate> templates = objectTemplateProvider.findAllTemplates(
      pageable,
      scenarioId
    );
    return pagedResourcesAssembler.toModel(templates);
  }

  @GetMapping("/search/findByTitle")
  public PagedModel<EntityModel<ObjectTemplate>> findByTitle(
    @RequestParam("title") String title,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort,
    @RequestHeader(required = false) Integer scenarioId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectTemplate> templates =
      objectTemplateProvider.findByTitleContaining(title, pageable, scenarioId);
    return pagedResourcesAssembler.toModel(templates);
  }

  @GetMapping("/search/findByScenarioIdAndObjectTypeId/{objectTypeId}")
  public PagedModel<
    EntityModel<ObjectTemplate>
  > findByScenarioIdAndObjectTypeId(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer objectTypeId,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "title") Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<ObjectTemplate> templates =
      objectTemplateProvider.getTemplatesByScenarioIdAndObjectType(
        scenarioId,
        objectTypeId,
        pageable
      );
    return pagedResourcesAssembler.toModel(templates);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ObjectTemplate getTemplateById(@PathVariable Integer id) {
    return objectTemplateProvider.getTemplateById(id);
  }

  //--------------------------------------------------Endpointy POST---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PostMapping
  public ObjectTemplate addObjectTemplate(
    @Valid @RequestBody ObjectTemplateCreateRequest objectTemplateInfo,
    @RequestHeader(required = false) Integer scenarioId
  ) {
    return objectTemplateService.addObjectTemplate(
      objectTemplateInfo,
      scenarioId
    );
  }

  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/scenario")
  public void assignTemplatesToScenario(
    @RequestBody @Valid AssignIdsRequest templateIds,
    @RequestHeader Integer scenarioId
  ) {
    objectTemplateService.assignTemplatesToScenario(
      templateIds.assign(),
      scenarioId
    );
  }

  //--------------------------------------------------Endpointy POST---------------------------------------------------------

  @PutMapping("/{id}")
  public ObjectTemplate updateObjectTemplate(
    @PathVariable Integer id,
    @Valid @RequestBody ObjectTemplateUpdateRequest updatedTemplate
  ) {
    return objectTemplateService.updateObjectTemplate(id, updatedTemplate);
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void delete(@PathVariable Integer id) {
    objectTemplateService.deleteTemplate(id);
  }
}
