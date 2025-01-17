package api.database.controller.event;

import api.database.model.request.composite.update.EventUpdateRequest;
import api.database.model.response.EventResponse;
import api.database.model.response.EventStateResponse;
import api.database.service.event.EventProvider;
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
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

  private final EventService eventService;
  private final EventProvider eventProvider;

  @Autowired
  public EventController(
    EventService eventService,
    EventProvider eventProvider
  ) {
    this.eventService = eventService;
    this.eventProvider = eventProvider;
  }

  //--------------------------------------------------Endpoint GET------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public List<EventResponse> getEvents(@RequestHeader Integer scenarioId) {
    return eventProvider.getEventsForScenario(scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public EventResponse getOneEvent(
    @PathVariable Integer id,
    @RequestHeader Integer scenarioId
  ) {
    return eventProvider.getOneEvent(id, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/thread/{threadId}")
  public List<EventResponse> getThreadEvents(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer threadId
  ) {
    return eventProvider.getEventsForThread(threadId, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/state/{id}")
  public EventStateResponse getEventState(
    @PathVariable("id") Integer eventId,
    @RequestHeader Integer scenarioId
  ) {
    return eventProvider.getEventState(eventId, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/previous-state/{id}")
  public EventStateResponse getEventPreviousState(
    @PathVariable("id") Integer eventId,
    @RequestHeader Integer scenarioId
  ) {
    return eventProvider.getEventPreviousState(eventId, scenarioId);
  }

  // ----------------------------------------------------Endpoint PUT---------------------------------------------------
  @Operation(
    summary = "Add a new event",
    operationId = "addEvent",
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      description = "Information about the event to add",
      required = true,
      content = @Content(
        mediaType = "application/json",
        schema = @Schema(implementation = EventUpdateRequest.class)
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
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public EventResponse changeEvent(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer id,
    @Valid @RequestBody EventUpdateRequest info
  ) {
    return eventService.changeEvent(id, info, scenarioId);
  }
}
