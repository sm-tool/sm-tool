package api.database.controller.thread;

import api.database.model.QdsResponseUpdateList;
import api.database.model.branching.QdsInfoForkAdd;
import api.database.model.branching.QdsInfoForkChange;
import api.database.model.branching.QdsResponseBranching;
import api.database.service.branching.BranchingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/branching")
public class BranchingController {

  private final BranchingService branchingService;

  public BranchingController(BranchingService branchingService) {
    this.branchingService = branchingService;
  }

  @GetMapping("/all")
  public ResponseEntity<List<QdsResponseBranching>> getAllBranching(
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(
      branchingService.getBranchingForScenario(scenarioId)
    );
  }

  @PostMapping("/fork")
  public ResponseEntity<QdsResponseUpdateList> forkThread(
    @Valid @RequestBody QdsInfoForkAdd info,
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(branchingService.addFork(scenarioId, info));
  }

  @PutMapping("/fork")
  public ResponseEntity<QdsResponseUpdateList> changeFork(
    @Valid @RequestBody QdsInfoForkChange info,
    @RequestHeader Integer scenarioId
  ) {
    return ResponseEntity.ok(branchingService.changeFork(scenarioId, info));
  }

  @DeleteMapping("/fork/{id}")
  public ResponseEntity<QdsResponseUpdateList> deleteFork(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer id
  ) {
    return ResponseEntity.ok(branchingService.deleteFork(scenarioId, id));
  }
}
