package api.database.service.thread;

import api.database.entity.thread.QdsThread;
import api.database.model.QdsResponseUpdateList;
import api.database.model.constant.QdsEventType;
import api.database.model.internal.event.QdsInternalEventAddSpecial;
import api.database.model.thread.QdsInfoThreadAdd;
import api.database.model.thread.QdsInfoThreadChange;
import api.database.model.thread.QdsResponseThreadWithObjects;
import api.database.repository.thread.QdsThreadRepository;
import api.database.service.core.ThreadBaseOperations;
import api.database.service.core.ThreadEventOperations;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/// Zarządza podstawowymi operacjami na wątkach scenariusza:
/// - Pobieranie wątków z ich obiektami
/// - Tworzenie nowych wątków z bazowymi eventami
/// - Modyfikacja istniejących wątków
@Service
public class ThreadService {

  private final QdsThreadRepository qdsThreadRepository;
  private final ThreadBaseOperations threadBaseOperations;
  private final ThreadEventOperations threadEventOperations;

  @Autowired
  public ThreadService(
    QdsThreadRepository qdsThreadRepository,
    ThreadBaseOperations threadBaseOperations,
    ThreadEventOperations threadEventOperations
  ) {
    this.qdsThreadRepository = qdsThreadRepository;
    this.threadBaseOperations = threadBaseOperations;
    this.threadEventOperations = threadEventOperations;
  }

  //--------------------------------------------------Pobieranie wątków---------------------------------------------------------

  /// Pobiera wszystkie wątki scenariusza wraz z ich obiektami.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @return lista wątków z ich obiektami
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public List<QdsResponseThreadWithObjects> getScenarioThreads(
    Integer scenarioId
  ) {
    return qdsThreadRepository.getScenarioThreadsWithObjects(scenarioId);
  }

  //----------------------------------------------------Dodawanie wątków-------------------------------------------------------
  /// Dodaje nowy wątek do scenariusza.
  /// Automatycznie tworzy dwa eventy:
  /// - START w czasie rozpoczęcia wątku
  /// - END w następnej jednostce czasu
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param info dane nowego wątku
  /// @return status aktualizacji
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public QdsResponseUpdateList addThread(
    Integer scenarioId,
    QdsInfoThreadAdd info
  ) {
    QdsThread thread = new QdsThread(
      null,
      scenarioId,
      info.title(),
      info.description(),
      false,
      null
    );
    Integer threadId = qdsThreadRepository.save(thread).getId();
    threadEventOperations.addSpecialEvent(
      new QdsInternalEventAddSpecial(
        threadId,
        QdsEventType.START,
        info.time(),
        null
      )
    );
    threadEventOperations.addSpecialEvent(
      new QdsInternalEventAddSpecial(
        threadId,
        QdsEventType.END,
        info.time() + 1,
        null
      )
    );
    return new QdsResponseUpdateList(List.of("thread", "event"));
  }

  //------------------------------------------------------------Zmiana wątków----------------------------------------------
  /// Modyfikuje podstawowe informacje o wątku.
  /// Obsługuje zarówno wątki normalne, jak i globalny.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param info dane do zmiany w wątku
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public void changeThread(Integer scenarioId, QdsInfoThreadChange info) {
    QdsThread thread = new QdsThread(
      info.threadId() == 0
        ? threadBaseOperations.getGlobalThreadId(scenarioId)
        : info.threadId(),
      scenarioId,
      info.title(),
      info.description(),
      info.threadId() == 0,
      null
    );
    qdsThreadRepository.save(thread);
  }
}
