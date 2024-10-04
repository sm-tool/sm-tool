package api.database.controllers;

import api.database.classes.threads.body.QdsForkInfo;
import api.database.classes.threads.body.QdsThreadActionInfo;
import api.database.classes.threads.body.QdsThreadInfo;
import api.database.classes.threads.response.ThreadsAndBranching;
import api.database.services.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/thread")
public class ThreadController {

  private final ThreadService threadService;

  @Autowired
  public ThreadController(ThreadService threadService) {
    this.threadService = threadService;
  }

  @PostMapping("/new")
  public ResponseEntity<Integer> insertThread(
    @RequestBody QdsThreadInfo thread,
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(threadService.insertThread(thread, scenarioId));
  }

  @PostMapping("/fork")
  public ResponseEntity<Integer[]> forkThread(
    @RequestBody QdsForkInfo forkInfo,
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(threadService.forkThread(forkInfo, scenarioId));
  }

  @PostMapping("/new-action")
  public ResponseEntity<Integer> insertAction(
    @RequestBody QdsThreadActionInfo action,
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(threadService.insertAction(action, scenarioId));
  }

  @GetMapping("/all")
  public ResponseEntity<ThreadsAndBranching> getAllThreads(
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(threadService.getAllThreads(scenarioId));
  }
}
