package api.database.controller.association;

import api.database.entity.association.AssociationType;
import api.database.model.request.create.AssociationTypeCreateRequest;
import api.database.model.request.update.AssociationTypeUpdateRequest;
import api.database.service.core.provider.AssociationTypeProvider;
import api.database.service.global.AssociationTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/association-types")
@Tag(
  name = "Association management",
  description = "API for managing association of objects"
)
public class AssociationTypeController {

  private final AssociationTypeService associationTypeService;
  private final AssociationTypeProvider associationTypeProvider;
  private final PagedResourcesAssembler<
    AssociationType
  > pagedResourcesAssembler;

  @Autowired
  public AssociationTypeController(
    AssociationTypeService associationTypeService,
    AssociationTypeProvider associationTypeProvider,
    PagedResourcesAssembler<AssociationType> pagedResourcesAssembler
  ) {
    this.associationTypeService = associationTypeService;
    this.associationTypeProvider = associationTypeProvider;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
  }

  //--------------------------------------------------Endpointy GET---------------------------------------------------------

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/object-type/{objectTypeId}")
  public List<AssociationType> getAssociationTypesForObjectType(
    @PathVariable Integer objectTypeId
  ) {
    return associationTypeProvider.getByObjectType(objectTypeId);
  }

  @Operation(summary = "Get all association types")
  @GetMapping
  public PagedModel<EntityModel<AssociationType>> getAllAssociationTypes(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "description") Sort sort
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<AssociationType> types = associationTypeProvider.findAll(pageable);
    return pagedResourcesAssembler.toModel(types);
  }

  @Operation(
    summary = "Get all association types",
    description = "Retrieves a list of all association types"
  )
  @ApiResponse(
    responseCode = "200",
    description = "List of association types retrieved successfully",
    content = @Content(
      mediaType = "application/json",
      array = @ArraySchema(
        schema = @Schema(implementation = AssociationType.class)
      )
    )
  )
  @GetMapping("/scenario")
  public PagedModel<
    EntityModel<AssociationType>
  > getAssociationTypesForScenario(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "description") Sort sort,
    @RequestHeader("scenarioId") Integer scenarioId,
    @Parameter(description = "Enable hierarchical search") @RequestParam(
      required = false
    ) Boolean hierarchical,
    @Parameter(description = "Filter by first object type") @RequestParam(
      required = false
    ) Integer firstObjectTypeId,
    @Parameter(description = "Filter by second object type") @RequestParam(
      required = false
    ) Integer secondObjectTypeId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<AssociationType> types = associationTypeProvider.getAssociationTypes(
      pageable,
      scenarioId,
      firstObjectTypeId,
      secondObjectTypeId,
      hierarchical
    );
    return pagedResourcesAssembler.toModel(types);
  }

  @Operation(summary = "Search association types by description")
  @GetMapping("/search/findByDescription")
  public PagedModel<EntityModel<AssociationType>> findByDescription(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "description") Sort sort,
    @Parameter(
      description = "Description to search for",
      required = true
    ) @RequestParam("description") String description
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<AssociationType> types =
      associationTypeProvider.findByDescriptionContaining(
        description,
        pageable
      );
    return pagedResourcesAssembler.toModel(types);
  }

  @Operation(summary = "Search association types by first object type ID")
  @GetMapping("/search/findByFirstObjectTypeId")
  public PagedModel<EntityModel<AssociationType>> findByFirstObjectTypeId(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "description") Sort sort,
    @Parameter(
      description = "First object type ID",
      required = true
    ) @RequestParam("typeId") Integer typeId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<AssociationType> types =
      associationTypeProvider.findByFirstObjectTypeId(typeId, pageable);
    return pagedResourcesAssembler.toModel(types);
  }

  @Operation(summary = "Search association types by second object type ID")
  @GetMapping("/search/findBySecondObjectTypeId")
  public PagedModel<EntityModel<AssociationType>> findBySecondObjectTypeId(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @SortDefault(sort = "description") Sort sort,
    @Parameter(
      description = "Second object type ID",
      required = true
    ) @RequestParam("typeId") Integer typeId
  ) {
    Pageable pageable = PageRequest.of(page, Math.min(size, 50), sort);
    Page<AssociationType> types =
      associationTypeProvider.findBySecondObjectTypeId(typeId, pageable);
    return pagedResourcesAssembler.toModel(types);
  }

  @Operation(
    summary = "Get association type by ID",
    description = "Retrieves a specific association type using its ID"
  )
  @ApiResponses(
    value = {
      @ApiResponse(
        responseCode = "200",
        description = "Association type found",
        content = @Content(
          schema = @Schema(implementation = AssociationType.class)
        )
      ),
      @ApiResponse(
        responseCode = "404",
        description = "Association type not found",
        content = @Content(
          schema = @Schema(implementation = RuntimeException.class)
        )
      ),
    }
  )
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public AssociationType getAssociationType(@PathVariable Integer id) {
    return associationTypeProvider.findById(id);
  }

  //--------------------------------------------------Endpoint POST---------------------------------------------------------

  @Operation(
    summary = "Create new association between two objects",
    description = "Creates association with its label value with an ability to use hierarchical structure"
  )
  @ApiResponses(
    value = {
      @ApiResponse(
        responseCode = "200",
        description = "Association type created successfully",
        content = @Content(
          mediaType = "application/json",
          schema = @Schema(implementation = AssociationType.class)
        )
      ),
      @ApiResponse(
        responseCode = "400",
        description = "Invalid input data",
        content = @Content(
          mediaType = "application/json",
          schema = @Schema(implementation = RuntimeException.class)
        )
      ),
      // TODO: add 403, 401
    }
  )
  @ResponseStatus(HttpStatus.OK)
  @PostMapping
  public AssociationType addAssociationType(
    @Valid @RequestBody @Parameter(
      description = "Association type details",
      required = true
    ) AssociationTypeCreateRequest associationInfo
  ) {
    return associationTypeService.addAssociationType(associationInfo);
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------

  @Operation(
    summary = "Delete association type",
    description = "Deletes an association type by its ID"
  )
  @ApiResponses(
    value = {
      @ApiResponse(
        responseCode = "204",
        description = "Association type successfully deleted"
      ),
      @ApiResponse(
        responseCode = "404",
        description = "Association type not found"
      ),
    }
  )
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteAssociationType(@PathVariable Integer id) {
    associationTypeService.deleteById(id);
  }

  //---------------------------------------------------Endpoint PUT-----------------------------------------

  @PutMapping("/{id}")
  public AssociationType updateAssociationType(
    @PathVariable Integer id,
    @Valid @RequestBody AssociationTypeUpdateRequest info
  ) {
    return associationTypeService.updateAssociationType(id, info);
  }
}
