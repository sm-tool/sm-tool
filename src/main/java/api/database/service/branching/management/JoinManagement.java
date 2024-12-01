package api.database.service.branching.management;

import api.database.entity.thread.QdsBranching;
import api.database.model.QdsResponseUpdateList;
import api.database.model.branching.QdsInfoJoinAdd;
import api.database.model.constant.QdsBranchingType;
import api.database.model.constant.QdsEventType;
import api.database.model.event.QdsInfoEventModifyLast;
import api.database.model.internal.thread.QdsInternalThreadAddBranched;
import api.database.model.thread.QdsInfoThreadAdd;
import api.database.repository.thread.ObjectTransferRepository;
import api.database.repository.thread.QdsBranchingRepository;
import api.database.service.branching.BranchingValidation;
import api.database.service.branching.ThreadBranchingOperations;
import api.database.service.core.EventBaseOperations;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Zarządza operacjami łączenia (join) wątków w scenariuszu. Odpowiada za:
/// - Tworzenie nowych operacji join z transferem obiektów
/// - Tworzenie wątku wynikowego z operacji join
/// - Usuwanie operacji join
@Component
public class JoinManagement {

  private final QdsBranchingRepository qdsBranchingRepository;
  private final EventBaseOperations eventBaseOperations;
  private final ThreadBranchingOperations threadBranchingOperations;
  private final BranchingValidation branchingValidation;
  private final ObjectTransferRepository objectTransferRepository;

  @Autowired
  public JoinManagement(
    QdsBranchingRepository qdsBranchingRepository,
    EventBaseOperations eventBaseOperations,
    ThreadBranchingOperations threadBranchingOperations,
    BranchingValidation branchingValidation,
    ObjectTransferRepository objectTransferRepository
  ) {
    this.qdsBranchingRepository = qdsBranchingRepository;
    this.eventBaseOperations = eventBaseOperations;
    this.threadBranchingOperations = threadBranchingOperations;
    this.branchingValidation = branchingValidation;
    this.objectTransferRepository = objectTransferRepository;
  }

  //--------------------------------------------------Dodawanie rozgałęzień---------------------------------------------------------

  //TODO - sprawdzić
  /// Dodaje nową operację łączenia wątków.
  /// Proces łączenia:
  /// 1. Weryfikuje czy nie łączymy wątku globalnego
  /// 2. Tworzy wpis operacji join w bazie
  /// 3. Tworzy nowy wątek wynikowy (z eventami JOIN_OUT i END)
  /// 4. Dla każdego łączonego wątku:
  ///    - Zmienia jego ostatni event na JOIN_IN
  ///    - Transferuje jego obiekty do wątku wynikowego
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param info dane operacji join
  /// @return status aktualizacji
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public QdsResponseUpdateList addJoin(
    Integer scenarioId,
    QdsInfoJoinAdd info
  ) {
    branchingValidation.checkIfTriedToBranchGlobalThread(
      scenarioId,
      info.threadIdsToJoin()
    );
    //Dodanie łączenia
    Integer joinId = qdsBranchingRepository
      .save(
        new QdsBranching(
          null,
          scenarioId,
          info.joinTime(),
          info.joinTitle(),
          info.joinDescription(),
          QdsBranchingType.JOIN,
          null,
          null
        )
      )
      .getId();
    //Dodanie wątku
    Integer branchedThreadId = threadBranchingOperations.addBranchedThread(
      scenarioId,
      new QdsInternalThreadAddBranched(
        new QdsInfoThreadAdd(
          info.threadTitle(),
          info.threadDescription(),
          info.joinTime()
        ),
        joinId,
        QdsBranchingType.JOIN
      )
    );
    //Dodawanie łączeń na wątkach
    for (Integer joiningThreadId : info.threadIdsToJoin()) {
      //Pobranie ostatni event
      eventBaseOperations.saveModifiedLastEvent(
        eventBaseOperations.getAndCheckLastEvent(joiningThreadId, null),
        new QdsInfoEventModifyLast(
          info.joinTime(),
          QdsEventType.JOIN_IN,
          joinId
        )
      );
      transferObjectsOnJoin(joiningThreadId, branchedThreadId);
    }
    return new QdsResponseUpdateList(List.of("thread", "branching", "event"));
  }

  //--------------------------------------------------Uswanie branchingu---------------------------------------------------------

  /// Usuwa operację join z bazy.
  /// UWAGA: Wymaga wcześniejszego wywołania deleteJoinedThread z ThreadService
  /// dla zachowania spójności danych.
  ///
  /// @param joinId identyfikator operacji join do usunięcia
  /// @apiNote Funkcja wykonywana w ramach transakcji nadrzędnej
  public void deleteJoin(Integer joinId) {
    qdsBranchingRepository.deleteById(joinId);
  }

  /// Przenosi obiekty między wątkami podczas operacji join.
  ///
  /// @param from id wątku źródłowego
  /// @param to id wątku docelowego
  /// @apiNote Wykonywana w ramach tranakcji nadrzędnej
  public void transferObjectsOnJoin(Integer from, Integer to) {
    objectTransferRepository.transferObjectsOnJoin(from, to);
  }
}
