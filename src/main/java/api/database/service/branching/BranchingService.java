package api.database.service.branching;

import api.database.model.request.composite.create.ForkCreateRequest;
import api.database.model.request.composite.create.JoinCreateRequest;
import api.database.model.request.composite.update.ForkUpdateRequest;
import api.database.model.request.composite.update.JoinUpdateRequest;
import api.database.model.response.UpdateListResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/// Serwis zarządzający rozgałęzieniami wątków w scenariuszu (fork/join).
/// Stanowi fasadę dla szczegółowych operacji zarządzania rozgałęzieniami,
/// delegując wykonanie do wyspecjalizowanych klas.
@Service
public class BranchingService {

  private final ForkService forkService;
  private final JoinService joinService;

  @Autowired
  public BranchingService(ForkService forkService, JoinService joinService) {
    this.forkService = forkService;
    this.joinService = joinService;
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

  //------------------------------------------------------Usuwanie rozgałęzień----------------------------------------------------
  /// Usuwa operację podziału wątku.
  ///
  /// @param forkId identyfikator operacji fork
  public void deleteFork(Integer scenarioId, Integer forkId) {
    forkService.deleteFork(scenarioId, forkId);
  }

  public void deleteJoin(Integer scenarioId, Integer joinId) {
    joinService.deleteJoin(scenarioId, joinId);
  }
}
