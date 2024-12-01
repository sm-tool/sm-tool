package api.database.service.branching;

import api.database.model.association.QdsInfoAssociationLastChange;
import api.database.model.branching.QdsInfoOffspringObjectTransfer;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.QdsAssociationOperation;
import api.database.model.exception.ApiException;
import api.database.repository.object.QdsObjectRepository;
import api.database.service.core.AssociationOperations;
import api.database.service.core.ThreadBaseOperations;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class BranchingValidation {

  private final ThreadBaseOperations threadBaseOperations;
  private final AssociationOperations associationOperations;
  private final BranchingGlobalObjectProvider branchingGlobalObjectProvider;
  private final QdsObjectRepository objectRepository;

  @Autowired
  public BranchingValidation(
    ThreadBaseOperations threadBaseOperations,
    AssociationOperations associationOperations,
    BranchingGlobalObjectProvider branchingGlobalObjectProvider,
    QdsObjectRepository objectRepository
  ) {
    this.threadBaseOperations = threadBaseOperations;
    this.associationOperations = associationOperations;
    this.branchingGlobalObjectProvider = branchingGlobalObjectProvider;
    this.objectRepository = objectRepository;
  }

  public void checkIfTriedToBranchGlobalThread(
    Integer scenarioId,
    List<Integer> inputThreadIds
  ) {
    Integer globalThreadId = threadBaseOperations.getGlobalThreadId(scenarioId);
    if (
      inputThreadIds.contains(0) || inputThreadIds.contains(globalThreadId)
    ) throw new ApiException(
      ErrorCode.TRIED_TO_JOIN_GLOBAL_THREAD,
      ErrorGroup.BRANCHING,
      HttpStatus.BAD_REQUEST
    );
  }

  /// Weryfikuje poprawność transferu obiektów dla pojedynczego wątku.
  /// Sprawdza czy obiekty połączone asocjacjami (dla associationChange - INSERT) będą dostępne
  /// w nowym wątku (transferowane lub globalne).
  ///
  /// @param objectIds lista identyfikatorów transferowanych obiektów
  /// @param eventTime czas zdarzenia
  /// @param scenarioId id scenariusza
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public void verifyOneThreadTransfer(
    List<Integer> objectIds,
    Integer eventTime,
    Integer scenarioId
  ) {
    //Pobranie ostatnich zmian asocjacji dla wszystkich obiektów które są przekazane do danego wątku
    Set<Integer> objectIdSet = new HashSet<>(objectIds);
    List<QdsInfoAssociationLastChange> lastChanges =
      associationOperations.getLastAssociationChanges(objectIds, eventTime);
    //Obiekty wstrzykiwane globalnie
    Set<Integer> globalObjects = new HashSet<>(
      branchingGlobalObjectProvider.getGlobalObjects(scenarioId)
    );
    //Sprawdzanie asocjacji
    for (QdsInfoAssociationLastChange lastChange : lastChanges) {
      if (
        lastChange.operation() == QdsAssociationOperation.INSERT &&
        ((!objectIdSet.contains(lastChange.object1Id()) &&
            !globalObjects.contains(lastChange.object1Id())) ||
          (!objectIdSet.contains(lastChange.object2Id()) &&
            !globalObjects.contains(lastChange.object2Id())))
      ) {
        throw new ApiException(
          ErrorCode.WRONG_ASSOCIATIONS,
          ErrorGroup.WRONG_OBJECT_TRANSFER,
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  /// Weryfikuje możliwość transferu obiektów podczas podziału wątku.
  /// Sprawdza:
  /// - Brak duplikatów obiektów w transferze
  /// - Transfer wszystkich wymaganych obiektów
  /// - Poprawność transferu obiektów połączonych asocjacjami
  ///
  /// @param threadId id wątku źródłowego (null jeśli obiekty już znane)
  /// @param allThreadObjects lista wszystkich obiektów do przeniesienia
  /// @param offsprings informacje o transferach do wątków potomnych
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public void verifyTransfer(
    Integer threadId,
    List<Integer> allThreadObjects,
    List<QdsInfoOffspringObjectTransfer> offsprings
  ) {
    if (threadId != null) allThreadObjects =
      objectRepository.getAllThreadObjects(threadId);
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
      ErrorGroup.WRONG_OBJECT_TRANSFER,
      HttpStatus.BAD_REQUEST
    );

    //Sprawdzenie przekazania wszystkich obiektów
    if (!flattenedTransfer.equals(allThreadObjects)) throw new ApiException(
      ErrorCode.NOT_ALL_OBJECTS_WERE_TRANSFERRED,
      ErrorGroup.WRONG_OBJECT_TRANSFER,
      HttpStatus.BAD_REQUEST
    );
  }
}
