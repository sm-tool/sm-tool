package api.database.service.core.validator;

import api.database.model.constant.AssociationOperation;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.BranchingData;
import api.database.model.data.EventAssociationsStateData;
import api.database.model.data.OffspringObjectTransferData;
import api.database.model.domain.transfer.InternalThreadObjects;
import api.database.model.exception.ApiException;
import api.database.service.core.ObjectInstanceTransfer;
import api.database.service.core.ScenarioManager;
import api.database.service.core.provider.BranchingProvider;
import api.database.service.core.provider.EventStateProvider;
import api.database.service.core.provider.ObjectInstanceProvider;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Walidator operacji na rozgałęzieniach (FORK/JOIN) sprawdzający:
/// - Poprawność transferu obiektów między wątkami
/// - Spójność asocjacji przy podziale obiektów
/// - Możliwość wykonania operacji na wątkach
///
/// # Walidacje transferów
/// - Brak duplikatów obiektów w transferze
/// - Transfer wszystkich wymaganych obiektów lokalnych
/// - Zachowanie spójności asocjacji w wątkach potomnych
///
/// # Spójność asocjacji
/// Przy transferze do wątku potomnego:
/// - Obiekty globalne mogą być pominięte w transferze
/// - Obiekty lokalne połączone asocjacją muszą być transferowane razem
/// - Nie można rozdzielić obiektów połączonych asocjacją między wątki
@Component
public class BranchingValidator {

  private final ScenarioManager scenarioManager;
  private final ObjectInstanceProvider objectInstanceProvider;
  private final EventStateProvider eventStateProvider;
  private final BranchingProvider branchingProvider;
  private final ObjectInstanceTransfer objectInstanceTransfer;

  @Autowired
  public BranchingValidator(
    ScenarioManager scenarioManager,
    ObjectInstanceProvider objectInstanceProvider,
    EventStateProvider eventStateProvider,
    BranchingProvider branchingProvider,
    ObjectInstanceTransfer objectInstanceTransfer
  ) {
    this.scenarioManager = scenarioManager;
    this.objectInstanceProvider = objectInstanceProvider;
    this.eventStateProvider = eventStateProvider;
    this.branchingProvider = branchingProvider;
    this.objectInstanceTransfer = objectInstanceTransfer;
  }

  /// Sprawdza możliwość wykonania operacji FORK/JOIN na wątkach.
  /// Weryfikuje:
  /// - Przynależność wątków do scenariusza
  /// - Brak próby rozgałęzienia wątku globalnego
  ///
  /// @param threadIds lista id wątków do sprawdzenia
  /// @param scenarioId id scenariusza
  /// @throws ApiException gdy walidacja nie powiedzie się
  public void checkThreads(List<Integer> threadIds, Integer scenarioId) {
    Set<Integer> threadIdSet = new HashSet<>(threadIds);
    if (threadIdSet.size() != threadIds.size()) throw new ApiException(
      ErrorCode.DUPLICATED_THREAD_IDS,
      ErrorGroup.BRANCHING,
      HttpStatus.CONFLICT
    );
    scenarioManager.checkIfThreadsAreInScenario(threadIds, scenarioId);
    if (threadIds.contains(0)) throw new ApiException(
      ErrorCode.TRIED_TO_BRANCH_GLOBAL_THREAD,
      ErrorGroup.BRANCHING,
      HttpStatus.CONFLICT
    );
  }

  /// Weryfikuje ogólną poprawność transferu obiektów.
  /// Sprawdza:
  /// - Brak duplikatów w transferowanych obiektach
  /// - Transfer wszystkich obiektów lokalnych z wątku źródłowego
  ///
  /// @param objects obiekty dostępne w wątku źródłowym
  /// @param offsprings lista transferów do wątków potomnych
  /// @throws ApiException gdy wykryto duplikaty lub brak transferu wszystkich obiektów
  private void verifyCorrectness(
    InternalThreadObjects objects,
    List<OffspringObjectTransferData> offsprings
  ) {
    //Spłaszczenie listy
    List<Integer> flattenedTransfer = offsprings
      .stream()
      .flatMap(offspring -> offspring.objectIds().stream())
      .sorted()
      .toList();
    //Sprawdzenie duplikatów
    Set<Integer> setObjectTransfer = new HashSet<>(flattenedTransfer);
    if (
      setObjectTransfer.size() != flattenedTransfer.size()
    ) throw new ApiException(
      ErrorCode.DUPLICATED_OBJECTS_IN_TRANSFER,
      ErrorGroup.OBJECT_TRANSFER,
      HttpStatus.BAD_REQUEST
    );

    //Sprawdzenie przekazania wszystkich obiektów
    if (!flattenedTransfer.equals(objects.local())) throw new ApiException(
      ErrorCode.NOT_ALL_OBJECTS_WERE_TRANSFERRED,
      ErrorGroup.OBJECT_TRANSFER,
      HttpStatus.BAD_REQUEST
    );
  }

  /// Weryfikuje poprawność pojedynczych transferów pod kątem asocjacji.
  /// Sprawdza czy obiekty połączone asocjacją:
  /// - Są transferowane razem do tego samego wątku
  /// - Lub przynajmniej jeden z nich jest obiektem globalnym
  ///
  /// @param eventId id eventu FORK_IN
  /// @param objects obiekty dostępne w wątku źródłowym
  /// @param offsprings lista transferów do wątków potomnych
  /// @param scenarioId id scenariusza
  /// @throws ApiException gdy wykryto niepoprawny transfer połączonych obiektów
  private void verifySingleTransfers(
    Integer eventId,
    InternalThreadObjects objects,
    List<OffspringObjectTransferData> offsprings,
    Integer scenarioId
  ) {
    // Pobranie aktualnego stanu asocjacji dla danego eventu
    List<EventAssociationsStateData> associations =
      eventStateProvider.getEventAssociationState(eventId, scenarioId);

    // Przygotowanie zbioru obiektów globalnych dla szybkiego wyszukiwania
    Set<Integer> globalObjectIds = new HashSet<>(objects.global());

    // Weryfikacja każdego transferu potomnego
    for (OffspringObjectTransferData offspring : offsprings) {
      // Zbiór obiektów transferowanych do danego wątku potomnego
      Set<Integer> transferredObjectIds = new HashSet<>(offspring.objectIds());

      for (EventAssociationsStateData association : associations) {
        if (
          association.getAssociationOperation() == AssociationOperation.INSERT
        ) {
          boolean obj1Transferred = transferredObjectIds.contains(
            association.getObject1Id()
          );
          boolean obj2Transferred = transferredObjectIds.contains(
            association.getObject2Id()
          );
          boolean obj1Global = globalObjectIds.contains(
            association.getObject1Id()
          );
          boolean obj2Global = globalObjectIds.contains(
            association.getObject2Id()
          );

          // Jeśli któryś obiekt jest globalny, to OK
          if (obj1Global || obj2Global) {
            continue;
          }

          // Jeśli nie są globalne, to muszą być albo oba transferowane, albo żaden
          if (obj1Transferred != obj2Transferred) {
            throw new ApiException(
              ErrorCode.WRONG_ASSOCIATIONS,
              ErrorGroup.OBJECT_TRANSFER,
              HttpStatus.BAD_REQUEST
            );
          }
        }
      }
    }
  }

  /// Weryfikuje poprawność transferu obiektów podczas operacji FORK.
  /// Proces obejmuje:
  /// 1. Pobranie obiektów dostępnych w wątku źródłowym
  /// 2. Sprawdzenie poprawności ogólnej transferu
  /// 3. Walidację transferów do poszczególnych wątków
  /// 4. Weryfikację zachowania spójności asocjacji
  ///
  /// @param eventId id eventu FORK_IN
  /// @param offsprings lista transferów do wątków potomnych
  /// @param threadId id wątku źródłowego
  /// @param scenarioId id scenariusza
  /// @return lista obiektów lokalnych z wątku źródłowego
  /// @throws ApiException gdy transfer jest niepoprawny
  public List<Integer> verifyTransfer(
    Integer eventId,
    List<OffspringObjectTransferData> offsprings,
    Integer threadId,
    Integer scenarioId
  ) {
    // Pobranie obiektów dostępnych na wątku
    InternalThreadObjects objects =
      objectInstanceProvider.getInternalObjectsAvailableForThread(
        threadId,
        scenarioId
      );
    // Sprawdzanie poprawności transferu - ogólnego - duplikaty i przekazanie całości
    verifyCorrectness(objects, offsprings);
    verifySingleTransfers(eventId, objects, offsprings, scenarioId);
    return objects.local();
  }

  /// Sprawdza poprawność pierwszego forka na wątku i oznacza go jako niepoprawny jeśli potrzeba
  public void verifyFirstForkAfterChange(Integer threadId, Integer scenarioId) {
    Integer forkId = branchingProvider.getFirstForkId(threadId);
    if (forkId == null) {
      return;
    }

    BranchingData fork = branchingProvider
      .getBranchingsByIds(List.of(forkId))
      .getFirst();

    try {
      // Używamy istniejącej logiki weryfikacji
      InternalThreadObjects objects =
        objectInstanceProvider.getInternalObjectsAvailableForThread(
          fork.comingIn()[0],
          scenarioId
        );
      verifyCorrectness(objects, fork.objectTransfer());
      verifySingleTransfers(forkId, objects, fork.objectTransfer(), scenarioId);
    } catch (ApiException e) {
      // Zamiast propagować wyjątek, oznaczamy fork jako niepoprawny
      if (
        e.getErrorCode() == ErrorCode.WRONG_ASSOCIATIONS ||
        e.getErrorCode() == ErrorCode.NOT_ALL_OBJECTS_WERE_TRANSFERRED
      ) {
        objectInstanceTransfer.markForkAsIncorrect(forkId);
      } else {
        throw e; // inne błędy propagujemy dalej
      }
    }
  }
}
