package api.database.controller.thread;

import api.database.model.request.composite.ThreadShiftRequest;
import api.database.model.request.composite.create.ThreadCreateRequest;
import api.database.model.request.update.ThreadUpdateRequest;
import api.database.model.response.ThreadResponse;
import api.database.service.core.ThreadRemovalService;
import api.database.service.core.ThreadShifter;
import api.database.service.thread.ThreadService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/threads")
public class ThreadController {

  private final ThreadService threadService;
  private final ThreadRemovalService threadRemovalService;
  private final ThreadShifter threadShifter;

  @Autowired
  public ThreadController(
    ThreadService threadService,
    ThreadRemovalService threadRemovalService,
    ThreadShifter threadShifter
  ) {
    this.threadService = threadService;
    this.threadRemovalService = threadRemovalService;
    this.threadShifter = threadShifter;
  }

  //--------------------------------------------------Endpoint GET---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public List<ThreadResponse> getThreads(@RequestHeader Integer scenarioId) {
    return threadService.getScenarioThreads(scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{threadId}")
  public ThreadResponse getOneThread(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer threadId
  ) {
    return threadService.getOneThread(threadId, scenarioId);
  }

  //--------------------------------------------------Endpoint POST---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PostMapping
  public ThreadResponse addThread(
    @Valid @RequestBody ThreadCreateRequest thread,
    @RequestHeader Integer scenarioId
  ) {
    return threadService.addThread(scenarioId, thread);
  }

  //--------------------------------------------------Endpoint PUT---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public ThreadResponse updateThread(
    @RequestHeader Integer scenarioId,
    @Valid @RequestBody ThreadUpdateRequest threadChange,
    @PathVariable Integer id
  ) {
    return threadService.changeThread(id, threadChange, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/shift/{threadId}")
  public void shiftThread(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer threadId,
    @Valid @RequestBody ThreadShiftRequest request
  ) {
    threadShifter.shift(request, threadId, scenarioId);
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @DeleteMapping("/{id}")
  public void deleteThread(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer id
  ) {
    threadRemovalService.removeThread(scenarioId, id);
  }
}
