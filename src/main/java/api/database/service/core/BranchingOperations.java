package api.database.service.core;

import api.database.repository.event.QdsEventRepository;
import api.database.repository.thread.ObjectTransferRepository;
import api.database.repository.thread.QdsBranchingRepository;
import java.util.Collection;
import java.util.List;
import org.springframework.stereotype.Component;

/// Narzędzia pomocnicze do zarządzania rozgałęzieniami i transferem obiektów.
/// Dostarcza funkcjonalności związane z propagacją obiektów przez łańcuchy JOIN-ów
/// oraz walidacją poprawności FORK-ów.
@Component
public class BranchingOperations {

  private final ObjectTransferRepository objectTransferRepository;
  private final QdsBranchingRepository branchingRepository;
  private final QdsEventRepository qdsEventRepository;

  public BranchingOperations(
    ObjectTransferRepository objectTransferRepository,
    QdsBranchingRepository branchingRepository,
    QdsEventRepository qdsEventRepository
  ) {
    this.objectTransferRepository = objectTransferRepository;
    this.branchingRepository = branchingRepository;
    this.qdsEventRepository = qdsEventRepository;
  }

  /// Propaguje obiekty przez łańcuch operacji JOIN.
  /// Funkcja rekurencyjnie przenosi obiekty przez wszystkie JOIN-y
  /// dostępne z danego wątku początkowego.
  ///
  /// ## DZIAŁANIE
  /// Funkcja rekurencyjnie sprawdza kolejne wątki osiągalne przez JOIN-y.
  /// Dla każdej pary (wątek, obiekt) tworzy nowy wpis w qds_thread_to_object.
  ///
  /// @param threadId wątek początkowy
  /// @param objectIds lista propagowanych obiektów
  public void transferAdditionalObjectsOnJoins(
    Integer threadId,
    List<Integer> objectIds
  ) {
    objectTransferRepository.transferAdditionalObjectsOnJoins(
      threadId,
      objectIds.toArray(new Integer[0])
    );
  }

  /// Znajduje i oznacza niepoprawne operacje FORK w łańcuchu rozgałęzień.
  ///
  /// ## OPIS
  /// Możliwe scenariusze:
  /// 1. Wątek kończy się END - brak dalszych operacji
  /// 2. Wątek kończy się FORK_IN - oznaczenie FORK jako niepoprawny
  /// 3. Wątek kończy się JOIN_IN - analiza wątku wyjściowego z JOIN
  ///
  /// ## DZIAŁANIE
  /// 1. Znajduje event typu IN (FORK_IN/JOIN_IN) w wątku startowym
  /// 2. Dla FORK_IN - oznacza FORK jako niepoprawny
  /// 3. Dla JOIN_IN:
  ///    - Znajduje odpowiadający JOIN_OUT
  ///    - Przechodzi do kolejnego wątku
  ///    - Powtarza proces rekurencyjnie
  ///
  /// Kończy gdy znajdzie FORK_IN lub skończą się JOIN-y do prześledzenia.
  ///
  /// @param threadId wątek początkowy
  public void findIncorrectForksAndMarkThem(Integer threadId) {
    objectTransferRepository.findIncorrectForksAndMarkThem(threadId);
  }

  /// Usuwa wszystkie rozgałęzienia dla scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  public void deleteScenarioBranchings(Integer scenarioId) {
    branchingRepository.deleteScenarioBranchings(scenarioId);
  }

  public void deleteBranchings(Collection<Integer> allBranchingsToDelete) {
    branchingRepository.deleteBranchingByIds(
      allBranchingsToDelete.toArray(new Integer[0])
    );
  }

  public void markAsIncorrect(Integer forkId) {
    branchingRepository.markForkAsIncorrect(forkId);
  }

  public void deleteEventsForBranchings(Integer[] branchingIds) {
    qdsEventRepository.deleteEventsForBranchings(branchingIds);
  }
}
