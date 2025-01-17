package api.database.controller.thread;

import api.database.model.data.BranchingData;
import api.database.model.request.composite.create.ForkCreateRequest;
import api.database.model.request.composite.create.JoinCreateRequest;
import api.database.model.request.composite.update.ForkUpdateRequest;
import api.database.model.request.composite.update.JoinUpdateRequest;
import api.database.model.response.UpdateListResponse;
import api.database.service.branching.BranchingService;
import api.database.service.core.provider.BranchingProvider;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/branchings")
public class BranchingController {

  private final BranchingService branchingService;
  private final BranchingProvider branchingProvider;

  public BranchingController(
    BranchingService branchingService,
    BranchingProvider branchingProvider
  ) {
    this.branchingService = branchingService;
    this.branchingProvider = branchingProvider;
  }

  //--------------------------------------------------Endpoint GET---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public List<BranchingData> getBranchingsForScenario(
    @RequestHeader Integer scenarioId
  ) {
    return branchingProvider.getBranchingsForScenario(scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public BranchingData getBranching(@PathVariable Integer id) {
    return branchingProvider.getOneBranching(id);
  }

  //--------------------------------------------------Endpointy POST---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/fork")
  public UpdateListResponse addFork(
    @Valid @RequestBody ForkCreateRequest info,
    @RequestHeader Integer scenarioId
  ) {
    return branchingService.addFork(scenarioId, info);
  }

  @ResponseStatus(HttpStatus.OK)
  @PostMapping("/join")
  public void addJoin(
    @Valid @RequestBody JoinCreateRequest joinInfo,
    @RequestHeader Integer scenarioId
  ) {
    branchingService.addJoin(scenarioId, joinInfo);
  }

  //--------------------------------------------------Endpoint PUT---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/fork/{id}")
  public UpdateListResponse updateFork(
    @Valid @RequestBody ForkUpdateRequest info,
    @RequestHeader Integer scenarioId,
    @PathVariable Integer id
  ) {
    return branchingService.changeFork(id, info, scenarioId);
  }

  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/join/{id}")
  public UpdateListResponse updateJoin(
    @Valid @RequestBody JoinUpdateRequest info,
    @RequestHeader Integer scenarioId,
    @PathVariable Integer id
  ) {
    return branchingService.changeJoin(id, info, scenarioId);
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------

  @DeleteMapping("/fork/{id}")
  public void deleteFork(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer id
  ) {
    branchingService.deleteFork(scenarioId, id);
  }

  @DeleteMapping("/join/{id}")
  public void deleteJoin(
    @RequestHeader Integer scenarioId,
    @PathVariable Integer id
  ) {
    branchingService.deleteJoin(scenarioId, id);
  }
}
