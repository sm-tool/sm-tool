package api.database.service.branching;

import api.database.model.QdsResponseUpdateList;
import api.database.model.branching.QdsInfoForkAdd;
import api.database.model.branching.QdsInfoForkChange;
import api.database.model.branching.QdsInfoJoinAdd;
import api.database.model.branching.QdsResponseBranching;
import api.database.repository.thread.QdsBranchingRepository;
import api.database.service.branching.management.ForkManagement;
import api.database.service.branching.management.JoinManagement;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/// Serwis zarządzający rozgałęzieniami wątków w scenariuszu (fork/join).
/// Stanowi fasadę dla szczegółowych operacji zarządzania rozgałęzieniami,
/// delegując wykonanie do wyspecjalizowanych klas.
@Service
public class BranchingService {

  private final QdsBranchingRepository qdsBranchingRepository;
  private final JoinManagement joinManagement;
  private final ForkManagement forkManagement;

  @Autowired
  public BranchingService(
    QdsBranchingRepository qdsBranchingRepository,
    JoinManagement joinManagement,
    ForkManagement forkManagement
  ) {
    this.qdsBranchingRepository = qdsBranchingRepository;
    this.joinManagement = joinManagement;
    this.forkManagement = forkManagement;
  }

  //--------------------------------------------------Pobieranie rozgałęzień------------------------------------------------

  /// Pobiera wszystkie rozgałęzienia dla danego scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @return lista rozgałęzień z ich szczegółami
  public List<QdsResponseBranching> getBranchingForScenario(
    Integer scenarioId
  ) {
    return qdsBranchingRepository.getBranchingForScenario(scenarioId);
  }

  //----------------------------------------------------Dodawanie rozgałęzień----------------------------------------------
  /// Dodaje nową operację podziału wątku (fork).
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param forkInfo dane operacji fork
  /// @return status aktualizacji
  public QdsResponseUpdateList addFork(
    Integer scenarioId,
    QdsInfoForkAdd forkInfo
  ) {
    return forkManagement.addFork(scenarioId, forkInfo);
  }

  /// Dodaje nową operację łączenia wątków (join).
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param joinInfo dane operacji join
  /// @return status aktualizacji
  public QdsResponseUpdateList addJoin(
    Integer scenarioId,
    QdsInfoJoinAdd joinInfo
  ) {
    return joinManagement.addJoin(scenarioId, joinInfo);
  }

  //-----------------------------------------------------Zmiana rozgałęzień----------------------------------------------------
  /// Modyfikuje istniejącą operację podziału wątku.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param forkInfo dane zmian w operacji fork
  /// @return status aktualizacji
  public QdsResponseUpdateList changeFork(
    Integer scenarioId,
    QdsInfoForkChange forkInfo
  ) {
    return forkManagement.changeFork(scenarioId, forkInfo);
  }

  //------------------------------------------------------Usuwanie rozgałęzień----------------------------------------------------
  /// Usuwa operację podziału wątku.
  ///
  /// @param forkId identyfikator operacji fork
  /// @return status aktualizacji
  public QdsResponseUpdateList deleteFork(Integer scenarioId, Integer forkId) {
    return forkManagement.deleteFork(scenarioId, forkId);
  }
}
