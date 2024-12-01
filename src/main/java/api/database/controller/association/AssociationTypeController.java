package api.database.controller.association;

import api.database.entity.association.QdsAssociationType;
import api.database.service.association.AssociationTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/association-type")
@Tag(
  name = "Association management",
  description = "API for managing association of objects"
)
public class AssociationTypeController {

  @Autowired
  private AssociationTypeService associationTypeService;

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
          schema = @Schema(implementation = QdsAssociationType.class)
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
  @PostMapping
  public QdsAssociationType createAssociationType(
    @RequestBody @Valid @Parameter(
      description = "Association type details",
      required = true
    ) QdsAssociationType association
  ) {
    return associationTypeService.createAssociationType(association);
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
          schema = @Schema(implementation = QdsAssociationType.class)
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
  @GetMapping("/{id}")
  public final QdsAssociationType getAssociationById(
    @PathVariable final Integer id
  ) {
    return associationTypeService
      .findById(id)
      .orElseThrow(() -> new RuntimeException("AssociationType not found"));
  }

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
  public final void deleteAssociationType(@PathVariable final Integer id) {
    associationTypeService.deleteById(id);
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
        schema = @Schema(implementation = QdsAssociationType.class)
      )
    )
  )
  @GetMapping
  public final Page<QdsAssociationType> getAssociationTypes(
    @PageableDefault(size = 20, sort = "description") final Pageable pageable,
    @RequestHeader("scenarioId") Integer scenarioId,
    @RequestParam(
      value = "hierarchical",
      required = false
    ) Boolean hierarchical,
    @RequestParam(
      value = "firstObjectTypeId",
      required = false
    ) Integer firstObjectTypeId,
    @RequestParam(
      value = "secondObjectTypeId",
      required = false
    ) Integer secondObjectTypeId
  ) {
    return associationTypeService.getAssociationTypes(
      pageable,
      scenarioId,
      firstObjectTypeId,
      secondObjectTypeId,
      hierarchical
    );
  }
}
