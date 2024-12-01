package api.database.controller.event;

import api.database.model.QdsResponseUpdateList;
import api.database.model.event.QdsDataEvent;
import api.database.service.event.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/event")
public class EventController {

  private final EventService eventService;

  @Autowired
  public EventController(EventService eventService) {
    this.eventService = eventService;
  }

  @GetMapping("/all")
  public ResponseEntity<List<QdsDataEvent>> getAllEvents(
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(eventService.getEventsForScenario(scenarioId));
  }

  @Operation(
    summary = "Add a new event",
    operationId = "addEvent",
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      description = "Information about the event to add",
      required = true,
      content = @Content(
        mediaType = "application/json",
        schema = @Schema(implementation = QdsDataEvent.class)
      )
    ),
    parameters = {
      @Parameter(
        name = "scenarioId",
        description = "ID of the scenario",
        required = true,
        in = io.swagger.v3.oas.annotations.enums.ParameterIn.HEADER,
        schema = @Schema(type = "integer")
      ),
    }
  )
  @ApiResponses(
    value = {
      @ApiResponse(
        responseCode = "200",
        description = "Event added successfully",
        content = @Content(
          mediaType = "application/json",
          schema = @Schema(implementation = Integer.class)
        )
      ),
      @ApiResponse(responseCode = "400", description = "Invalid input"),
    }
  )
  @PostMapping("/add")
  public ResponseEntity<QdsResponseUpdateList> addEvent(
    @Valid @RequestBody QdsDataEvent info,
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(eventService.addEvent(scenarioId, info));
  }

  @DeleteMapping("/{eventId}")
  public ResponseEntity<String> deleteEvent(@PathVariable Integer eventId) {
    eventService.deleteEventIfValid(eventId);
    return ResponseEntity.ok("Event deleted successfully.");
  }
}
