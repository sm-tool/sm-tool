package api.database.service.branching;

import api.database.entity.thread.Branching;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.BranchingData;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.create.ForkCreateRequest;
import api.database.model.request.composite.create.JoinCreateRequest;
import api.database.model.request.composite.update.ForkUpdateRequest;
import api.database.model.request.composite.update.JoinUpdateRequest;
import api.database.model.request.update.BranchingUpdateRequest;
import api.database.model.response.UpdateListResponse;
import api.database.repository.branching.BranchingRepository;
import api.database.service.core.BranchingDeleter;
import api.database.service.core.EventManager;
import api.database.service.core.IdleEventManager;
import api.database.service.core.ThreadRemovalService;
import api.database.service.core.provider.BranchingProvider;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/// Serwis zarządzający rozgałęzieniami wątków w scenariuszu (fork/join).
/// Stanowi fasadę dla szczegółowych operacji zarządzania rozgałęzieniami,
/// delegując wykonanie do wyspecjalizowanych klas.
@Service
public class BranchingService {

  private final ForkService forkService;
  private final JoinService joinService;
  private final BranchingRepository branchingRepository;
  private final BranchingProvider branchingProvider;
  private final IdleEventManager idleEventManager;
  private final EventManager eventManager;
  private final ThreadRemovalService threadRemovalService;
  private final BranchingDeleter branchingDeleter;

  @Autowired
  public BranchingService(
    ForkService forkService,
    JoinService joinService,
    BranchingRepository branchingRepository,
    BranchingProvider branchingProvider,
    IdleEventManager idleEventManager,
    EventManager eventManager,
    ThreadRemovalService threadRemovalService,
    BranchingDeleter branchingDeleter
  ) {
    this.forkService = forkService;
    this.joinService = joinService;
    this.branchingRepository = branchingRepository;
    this.branchingProvider = branchingProvider;
    this.idleEventManager = idleEventManager;
    this.eventManager = eventManager;
    this.threadRemovalService = threadRemovalService;
    this.branchingDeleter = branchingDeleter;
  }

  //----------------------------------------------------Dodawanie rozgałęzień----------------------------------------------
  /// Dodaje nową operację podziału wątku (fork).
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param forkInfo dane operacji fork
  /// @return status aktualizacji
  public UpdateListResponse addFork(
    Integer scenarioId,
    ForkCreateRequest forkInfo
  ) {
    forkService.addFork(forkInfo, scenarioId);
    return new UpdateListResponse(List.of("branching", "thread", "event"));
  }

  /// Dodaje nową operację łączenia wątków (join).
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param joinInfo dane operacji join
  public void addJoin(Integer scenarioId, JoinCreateRequest joinInfo) {
    joinService.addJoin(scenarioId, joinInfo);
  }

  //-----------------------------------------------------Zmiana rozgałęzień----------------------------------------------------
  /// Modyfikuje istniejącą operację podziału wątku.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param forkInfo dane zmian w operacji fork
  /// @return status aktualizacji

  public UpdateListResponse changeFork(
    Integer forkId,
    ForkUpdateRequest forkInfo,
    Integer scenarioId
  ) {
    forkService.changeFork(forkId, forkInfo, scenarioId);
    return new UpdateListResponse(List.of("branching", "event", "thread"));
  }

  public UpdateListResponse changeJoin(
    Integer joinId,
    JoinUpdateRequest joinInfo,
    Integer scenarioId
  ) {
    joinService.changeJoin(joinId, joinInfo, scenarioId);
    return new UpdateListResponse(List.of("branching", "thread", "event"));
  }

  @Transactional
  public void updateBranchingInfo(
    BranchingUpdateRequest request,
    Integer branchingId,
    Integer scenarioId
  ) {
    Branching branchingData = branchingRepository
      .findById(branchingId)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.BRANCHING,
          HttpStatus.NOT_FOUND
        )
      );
    if (
      !branchingData.getScenarioId().equals(scenarioId)
    ) throw new ApiException(
      ErrorCode.CONFLICT_BETWEEN_SCENARIOS_IN_HEADER_AND_ENTITY,
      ErrorGroup.SCENARIO,
      HttpStatus.CONFLICT
    );
    branchingData.setDescription(request.description());
    branchingData.setTitle(request.title());
    branchingRepository.save(branchingData);
  }

  //------------------------------------------------------Usuwanie rozgałęzień----------------------------------------------------
  /// Usuwa rozgałęzienie wątku wraz z jego konsekwencjami.
  /// Dla pojedynczego wątku potomnego (1-1):
  /// - Przenosi eventy z wątku źródłowego
  /// - Usuwa eventy rozgałęzienia
  /// W innym wypadku:
  /// - Usuwa wszystkie wątki potomne
  /// - Zastępuje eventy rozgałęzień przez END
  ///
  /// @param branchingId id usuwanego rozgałęzienia
  /// @param scenarioId id scenariusza
  @Transactional
  public void deleteBranching(Integer scenarioId, Integer branchingId) {
    List<BranchingData> branchings = branchingProvider.getBranchingsByIds(
      List.of(branchingId)
    );
    if (branchings.isEmpty()) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      List.of(branchingId.toString()),
      ErrorGroup.BRANCHING,
      HttpStatus.NOT_FOUND
    );
    BranchingData branching = branchings.getFirst();

    if (branching.comingOut().length == 1 && branching.comingIn().length == 1) {
      branchingDeleter.deleteBranchings(List.of(branchingId)); // Usunięcie branchingu wraz z jego eventami
      // Wypełnienie pustej przestrzeni po eventach branchingu
      idleEventManager.fillWithIdleEvents(
        branching.comingIn()[0],
        branching.time(),
        branching.time() + 1
      );
      // Przesunięcie eventów do wątku wchodząccego
      eventManager.moveEventsBetweenThreads(
        branching.comingOut(),
        branching.comingIn(),
        0
      );
      threadRemovalService.removeThreadsAfterMove(branching.comingOut());
    } else {
      //Usuwanie już niewystępujących wątków
      for (Integer threadId : branching.comingOut()) {
        threadRemovalService.removeThread(scenarioId, threadId);
      }
    }
  }
}
