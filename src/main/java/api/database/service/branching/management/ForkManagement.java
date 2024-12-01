package api.database.service.branching.management;

import api.database.entity.event.QdsEvent;
import api.database.entity.thread.QdsBranching;
import api.database.model.QdsResponseUpdateList;
import api.database.model.branching.QdsInfoForkAdd;
import api.database.model.branching.QdsInfoForkChange;
import api.database.model.branching.QdsInfoForkOffspring;
import api.database.model.branching.QdsInfoOffspringObjectTransfer;
import api.database.model.branching.QdsResponseBranching;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.QdsBranchingType;
import api.database.model.constant.QdsEventType;
import api.database.model.event.QdsInfoEventModifyLast;
import api.database.model.exception.ApiException;
import api.database.model.internal.thread.QdsInternalThreadAddBranched;
import api.database.model.thread.QdsInfoThreadAdd;
import api.database.repository.thread.ObjectTransferRepository;
import api.database.repository.thread.QdsBranchingRepository;
import api.database.service.branching.BranchingValidation;
import api.database.service.branching.ThreadBranchingOperations;
import api.database.service.core.EventBaseOperations;
import api.database.service.core.ObjectDeleteOperations;
import api.database.service.core.ThreadDeleteService;
import api.database.service.core.ThreadEventOperations;
import jakarta.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ForkManagement {

  private final EventBaseOperations eventBaseOperations;
  private final QdsBranchingRepository qdsBranchingRepository;
  private final ThreadDeleteService threadDeleteService;
  private final ThreadBranchingOperations threadBranchingOperations;
  private final ThreadEventOperations threadEventOperations;
  private final ObjectDeleteOperations objectDeleteOperations;
  private final BranchingValidation branchingValidation;
  private final ObjectTransferRepository objectTransferRepository;

  /// Zarządza operacjami podziału (fork) wątków w scenariuszu. Odpowiada za:
  /// - Tworzenie nowych podziałów wątków z transferem obiektów
  /// - Modyfikację istniejących podziałów (zmiana wątków potomnych i transferów)
  /// - Usuwanie podziałów wraz z wątkami potomnymi
  /// - Walidację poprawności operacji na podziałach
  @Autowired
  public ForkManagement(
    EventBaseOperations eventBaseOperations,
    QdsBranchingRepository qdsBranchingRepository,
    ThreadDeleteService threadDeleteService,
    ThreadBranchingOperations threadBranchingOperations,
    ThreadEventOperations threadEventOperations,
    ObjectDeleteOperations objectDeleteOperations,
    BranchingValidation branchingValidation,
    ObjectTransferRepository objectTransferRepository
  ) {
    this.eventBaseOperations = eventBaseOperations;
    this.qdsBranchingRepository = qdsBranchingRepository;
    this.threadDeleteService = threadDeleteService;
    this.threadBranchingOperations = threadBranchingOperations;
    this.threadEventOperations = threadEventOperations;
    this.objectDeleteOperations = objectDeleteOperations;
    this.branchingValidation = branchingValidation;
    this.objectTransferRepository = objectTransferRepository;
  }

  //---------------------------------------------Operacje pomocnicze-------------------------------------

  /// Tworzy nowe wątki potomne dla operacji podziału.
  /// Dla każdego:
  /// 1. Tworzy wątek z eventami FORK_OUT i END
  /// 2. Transferuje przypisane obiekty do wątku
  ///
  /// @param offsprings informacje o nowych wątkach i ich obiektach
  /// @param forkTime czas podziału
  /// @param forkId id podziału
  /// @param scenarioId id scenariusza
  void createOffsprings(
    List<QdsInfoForkOffspring> offsprings,
    Integer forkTime,
    Integer forkId,
    Integer scenarioId
  ) {
    //Tworzenie wątków potomnych
    for (QdsInfoForkOffspring offspring : offsprings) {
      Integer threadId = threadBranchingOperations.addBranchedThread(
        scenarioId,
        new QdsInternalThreadAddBranched(
          new QdsInfoThreadAdd(
            offspring.title(),
            offspring.description(),
            forkTime
          ),
          forkId,
          QdsBranchingType.FORK
        )
      );
      transferObjects(threadId, forkTime, scenarioId, offspring.transfer());
    }
  }

  //TODO - weryfikacja i to poważna
  /// Przenosi obiekty do wątku potomnego podczas podziału.
  /// Wykonuje walidację przed transferem.
  ///
  /// @param threadId id wątku docelowego
  /// @param eventTime czas zdarzenia
  /// @param scenarioId id scenariusza
  /// @param offspring informacje o transferowanych obiektach
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public void transferObjects(
    Integer threadId,
    Integer eventTime,
    Integer scenarioId,
    QdsInfoOffspringObjectTransfer offspring
  ) {
    branchingValidation.verifyOneThreadTransfer(
      offspring.objectIds(),
      eventTime,
      scenarioId
    );
    objectTransferRepository.transferObjectsToThread(
      threadId,
      offspring.objectIds()
    );
  }

  //-------------------------------------------------------------------------------------------------------

  /// Dodaje nową operację podziału wątku.
  /// Proces podziału:
  /// 1. Weryfikuje czy nie dzielimy wątku globalnego
  /// 2. Zmienia ostatni event rodzica na FORK_IN
  /// 3. Tworzy wpis operacji fork
  /// 4. Sprawdza poprawność transferu obiektów
  /// 5. Tworzy nowe wątki potomne
  ///
  /// @param scenarioId id scenariusza
  /// @param info dane operacji fork
  /// @return status aktualizacji
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public QdsResponseUpdateList addFork(
    Integer scenarioId,
    QdsInfoForkAdd info
  ) {
    branchingValidation.checkIfTriedToBranchGlobalThread(
      scenarioId,
      List.of(info.forkedThreadId())
    );

    QdsEvent lastEvent = eventBaseOperations.getAndCheckLastEvent(
      info.forkedThreadId(),
      null
    );
    //Dodanie rozgałęzienia FORK
    Integer forkId = qdsBranchingRepository
      .save(
        new QdsBranching(
          null,
          scenarioId,
          info.forkTime(),
          info.title(),
          info.description(),
          QdsBranchingType.FORK,
          true,
          null
        )
      )
      .getId();

    eventBaseOperations.saveModifiedLastEvent(
      lastEvent,
      new QdsInfoEventModifyLast(info.forkTime() + 1, QdsEventType.END, forkId)
    );
    //Sprawdzanie ogólne przenoszenia obiektów
    branchingValidation.verifyTransfer(
      info.forkedThreadId(),
      null,
      info.offsprings().stream().map(QdsInfoForkOffspring::transfer).toList()
    );
    createOffsprings(info.offsprings(), info.forkTime(), forkId, scenarioId);

    return new QdsResponseUpdateList(List.of("thread", "branching", "event"));
  }

  //-----------------------------------------------------------Zmiana forka---------------------------------------------------------------

  /// Wykonuje podstawowe operacje podczas zmiany podziału:
  /// 1. Pobiera istniejący podział
  /// 2. Weryfikuje możliwość nowego transferu obiektów
  /// 3. Aktualizuje tytuł i opis podziału
  ///
  /// @param scenarioId id scenariusza
  /// @param forkChangeInfo informacje o zmianach w podziale
  /// @return istniejący podział z bazy
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  QdsResponseBranching baseChangeForkOperations(
    Integer scenarioId,
    QdsInfoForkChange forkChangeInfo
  ) {
    //-------------------------Pobieranie starego forka
    QdsResponseBranching fork = qdsBranchingRepository.getOneBranching(
      forkChangeInfo.forkId()
    );
    //----------------Zły endpoint - brak istniejącego forka
    if (fork == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.BRANCHING,
      HttpStatus.BAD_REQUEST
    );
    //---------------------------Weryfikacja transferu
    branchingValidation.verifyTransfer(
      null,
      fork
        .objectTransfer()
        .stream()
        .flatMap(offspring -> offspring.objectIds().stream())
        .sorted()
        .toList(),
      forkChangeInfo
        .offsprings()
        .stream()
        .map(QdsInfoForkOffspring::transfer)
        .toList()
    );
    //------------------------Zmiana tytułu/opisu
    qdsBranchingRepository.save(
      new QdsBranching(
        forkChangeInfo.forkId(),
        scenarioId,
        fork.time(),
        forkChangeInfo.title(),
        forkChangeInfo.description(),
        fork.type(),
        true,
        null
      )
    );
    return fork;
  }

  /// Usuwa nieużywane wątki po zmianie podziału.
  /// Weryfikuje czy usuwane wątki nie mają kolejnych rozgałęzień.
  ///
  /// @param databaseThreadIds id wątków w bazie
  /// @param threadIdsUpdated id wątków po aktualizacji
  /// @return zbiór id usuniętych wątków
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  private Set<Integer> deleteOldForkThreads(
    Set<Integer> databaseThreadIds,
    Set<Integer> threadIdsUpdated,
    Integer scenarioId
  ) {
    Set<Integer> deletedThreads = new HashSet<>(databaseThreadIds);
    deletedThreads.removeAll(threadIdsUpdated);
    //Usuwanie już niewystępujących wątków
    for (Integer threadId : deletedThreads) {
      threadDeleteService.removeThread(scenarioId, threadId);
    }
    return deletedThreads;
  }

  /// Aktualizuje transfery obiektów w istniejących wątkach podziału.
  /// Dla każdego wątku:
  /// 1. Weryfikuje możliwość nowego transferu
  /// 2. Usuwa stary transfer
  /// 3. Usuwa zmiany atrybutów i asocjacji dla usuniętych obiektów
  /// 4. Wykonuje nowy transfer obiektów
  ///
  /// @param existingThreads nowe transfery obiektów
  /// @param databaseExistingThreads transfery obiektów w bazie
  /// @param forkTime czas podziału
  /// @param scenarioId id scenariusza
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  private void changeExistingForkThreads(
    List<QdsInfoOffspringObjectTransfer> existingThreads,
    List<QdsInfoOffspringObjectTransfer> databaseExistingThreads,
    Integer forkTime,
    Integer scenarioId
  ) {
    for (int i = 0; i < existingThreads.size(); i++) {
      //Porównanie obiektów
      QdsInfoOffspringObjectTransfer offspring = existingThreads.get(i);
      QdsInfoOffspringObjectTransfer databaseOffspring =
        databaseExistingThreads.get(i);

      Set<Integer> newObjects = new HashSet<>(offspring.objectIds());
      Set<Integer> databaseObjects = new HashSet<>(
        databaseOffspring.objectIds()
      );

      List<Integer> deletedObjects = databaseObjects
        .stream()
        .filter(id -> !newObjects.contains(id))
        .toList();
      //Weryfikacja nowego transferu
      branchingValidation.verifyOneThreadTransfer(
        offspring.objectIds(),
        forkTime,
        scenarioId
      );
      //Usunięcie starego transferu
      objectDeleteOperations.deleteObjectInformationAfterTime(
        forkTime,
        offspring.objectIds()
      );
      //Transfer obiektów
      transferObjects(offspring.id(), forkTime, scenarioId, offspring);
    }
  }

  /// Kompleksowo modyfikuje istniejący podział wątku.
  /// Kolejno:
  /// 1. Wykonuje podstawowe operacje zmiany
  /// 2. Usuwa nieużywane wątki
  /// 3. Tworzy nowe wątki potomne
  /// 4. Aktualizuje transfery w istniejących wątkach
  ///
  /// @param scenarioId id scenariusza
  /// @param forkChangeInfo dane zmian w podziale
  /// @return status aktualizacji
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public QdsResponseUpdateList changeFork(
    Integer scenarioId,
    QdsInfoForkChange forkChangeInfo
  ) {
    QdsResponseBranching fork = baseChangeForkOperations(
      scenarioId,
      forkChangeInfo
    );
    //----------------------------Pobranie id wątków
    //-------------------------z bazy oraz przesłanych
    Set<Integer> databaseThreadIds = fork
      .objectTransfer()
      .stream()
      .map(QdsInfoOffspringObjectTransfer::id)
      .collect(Collectors.toSet());

    Set<Integer> threadIdsUpdated = forkChangeInfo
      .offsprings()
      .stream()
      .map(x -> x.transfer().id())
      .collect(Collectors.toSet());
    //------------------------------Usuwanie wątków
    Set<Integer> deletedThreads = deleteOldForkThreads(
      databaseThreadIds,
      threadIdsUpdated,
      scenarioId
    );
    //--------------------------------Tworzenie nowych wątków
    List<QdsInfoForkOffspring> newThreads = forkChangeInfo
      .offsprings()
      .stream()
      .filter(offspring -> offspring.transfer().id() == null)
      .toList();
    createOffsprings(newThreads, fork.time(), fork.id(), scenarioId);

    //--------------------------Zmiana już istniejących wątków
    List<QdsInfoOffspringObjectTransfer> existingThreads = forkChangeInfo
      .offsprings()
      .stream()
      .map(QdsInfoForkOffspring::transfer)
      .filter(transfer -> transfer.id() != null)
      .sorted(Comparator.comparing(QdsInfoOffspringObjectTransfer::id))
      .toList();
    List<QdsInfoOffspringObjectTransfer> databaseExistingThreads = fork
      .objectTransfer()
      .stream()
      .filter(offspring -> offspring.id() != null)
      .filter(offspring -> !deletedThreads.contains(offspring.id())) //odfiltrowanie usuniętych wątków
      .sorted(Comparator.comparing(QdsInfoOffspringObjectTransfer::id))
      .toList();
    changeExistingForkThreads(
      existingThreads,
      databaseExistingThreads,
      fork.time(),
      scenarioId
    );
    //----------------------------------
    return new QdsResponseUpdateList(List.of("thread", "branching", "event"));
  }

  //----------------------------------------------------------------Usuwanie forka------------------------------------------

  /// Usuwa podział wraz z jego wątkami potomnymi.
  /// Weryfikuje czy wątki potomne nie mają kolejnych rozgałęzień.
  ///
  /// @param forkId id usuwanego podziału
  /// @return status aktualizacji
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public QdsResponseUpdateList deleteFork(Integer scenarioId, Integer forkId) {
    QdsResponseBranching fork = qdsBranchingRepository.getOneBranching(forkId);
    if (fork == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.BRANCHING,
      HttpStatus.BAD_REQUEST
    );
    qdsBranchingRepository.deleteById(forkId);
    //Usuwanie już niewystępujących wątków
    for (Integer threadId : fork.comingOut()) {
      threadDeleteService.removeThread(scenarioId, threadId);
    }
    threadEventOperations.replaceForkEvent(fork.id());
    return new QdsResponseUpdateList(List.of("thread", "branching", "event"));
  }
}
