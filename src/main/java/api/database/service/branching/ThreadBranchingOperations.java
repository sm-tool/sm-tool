package api.database.service.branching;

import api.database.entity.thread.QdsThread;
import api.database.model.constant.QdsEventType;
import api.database.model.internal.event.QdsInternalEventAddSpecial;
import api.database.model.internal.thread.QdsInternalThreadAddBranched;
import api.database.repository.thread.QdsThreadRepository;
import api.database.service.core.ThreadEventOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Obsługuje operacje związane z tworzeniem rozgałęzionych wątków.
/// Odpowiada za inicjalizację nowych wątków powstałych w wyniku
/// operacji fork lub join wraz z ich podstawowymi eventami.
@Component
public class ThreadBranchingOperations {

  private final QdsThreadRepository qdsThreadRepository;
  private final ThreadEventOperations threadEventOperations;

  @Autowired
  public ThreadBranchingOperations(
    QdsThreadRepository qdsThreadRepository,
    ThreadEventOperations threadEventOperations
  ) {
    this.qdsThreadRepository = qdsThreadRepository;
    this.threadEventOperations = threadEventOperations;
  }

  /// Dodaje nowy wątek powstały z rozgałęzienia.
  /// Proces tworzenia obejmuje:
  /// - Utworzenie nowego wątku w scenariuszu
  /// - Dodanie eventu FORK_OUT/JOIN_OUT w czasie rozgałęzienia
  /// - Dodanie eventu END w następnej jednostce czasu
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param info informacje o nowym wątku i rozgałęzieniu
  /// @return identyfikator utworzonego wątku
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public Integer addBranchedThread(
    Integer scenarioId,
    QdsInternalThreadAddBranched info
  ) {
    QdsThread thread = new QdsThread(
      null,
      scenarioId,
      info.threadInfo().title(),
      info.threadInfo().description(),
      false,
      null
    );
    Integer threadId = qdsThreadRepository.save(thread).getId();
    threadEventOperations.addSpecialEvent(
      new QdsInternalEventAddSpecial(
        threadId,
        QdsEventType.valueOf(info.branchingType().name() + "_OUT"),
        info.threadInfo().time(),
        info.branchingId()
      )
    );
    threadEventOperations.addSpecialEvent(
      new QdsInternalEventAddSpecial(
        threadId,
        QdsEventType.END,
        info.threadInfo().time() + 1,
        null
      )
    );
    return threadId;
  }
}
