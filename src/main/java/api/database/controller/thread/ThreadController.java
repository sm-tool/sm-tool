package api.database.controller.thread;

import api.database.model.QdsResponseUpdateList;
import api.database.model.thread.QdsInfoThreadAdd;
import api.database.model.thread.QdsResponseThreadWithObjects;
import api.database.service.core.ThreadDeleteService;
import api.database.service.thread.ThreadService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/thread")
public class ThreadController {

  private final ThreadService threadService;
  private final ThreadDeleteService threadDeleteService;

  @Autowired
  public ThreadController(
    ThreadService threadService,
    ThreadDeleteService threadDeleteService
  ) {
    this.threadService = threadService;
    this.threadDeleteService = threadDeleteService;
  }

  @PostMapping("/add")
  public ResponseEntity<QdsResponseUpdateList> addThread(
    @RequestBody QdsInfoThreadAdd thread,
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(threadService.addThread(scenarioId, thread));
  }

  @GetMapping("/all")
  public ResponseEntity<List<QdsResponseThreadWithObjects>> getAllThreads(
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(threadService.getScenarioThreads(scenarioId));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<QdsResponseUpdateList> deleteThread(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer id
  ) {
    return ResponseEntity.ok(threadDeleteService.removeThread(scenarioId, id));
  }
}
