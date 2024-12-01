package api.database.service.core;

import api.database.entity.event.QdsEvent;
import api.database.model.internal.event.QdsInternalEventAddSpecial;
import api.database.repository.event.QdsEventRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

//TODO zrobić cokolwiek podzielić
/// Zarządza specjalnymi eventami w wątkach scenariusza.
/// Odpowiada za dodawanie i modyfikację eventów związanych z:
/// - Łączeniem wątków (JOIN_IN, JOIN_OUT)
/// - Podziałem wątków (FORK_IN, FORK_OUT)
/// - Kontrolą wątków (START, END)
@Component
public class ThreadEventOperations {

  private final QdsEventRepository qdsEventRepository;

  @Autowired
  public ThreadEventOperations(QdsEventRepository qdsEventRepository) {
    this.qdsEventRepository = qdsEventRepository;
  }

  /// Dodaje specjalny event, który nie może zawierać zmian asocjacji i atrybutów.
  /// Obsługuje typy eventów:
  /// - JOIN_IN, JOIN_OUT
  /// - FORK_IN, FORK_OUT
  /// - START, END
  ///
  /// @param info dane nowego eventu specjalnego
  /// @apiNote Operacja wykonywana w ramach transakcji nadrzędnej
  public void addSpecialEvent(QdsInternalEventAddSpecial info) {
    QdsEvent event = new QdsEvent(
      null,
      info.threadId(),
      info.time(),
      info.eventType(),
      null,
      null,
      info.branchingId(),
      null,
      null
    );
    qdsEventRepository.save(event);
  }

  //--------------------------------------------------Zmiana zdarzenia---------------------------------------------------------

  /// Zamienia eventy typu JOIN_IN na END dla wskazanego joinId.
  /// Nie usuwa samej operacji JOIN.
  ///
  /// @param joinId identyfikator operacji join
  public void replaceJoinEvents(Integer joinId) {
    qdsEventRepository.replaceJoinEvents(joinId);
  }

  /// Zamienia event typu FORK_IN na END dla wskazanego forkId.
  /// Nie usuwa samej operacji FORK.
  ///
  /// @param forkId identyfikator operacji fork
  public void replaceForkEvent(Integer forkId) {
    qdsEventRepository.replaceForkEvent(forkId);
  }

  //--------------------------------------------------Usuwanie zdarzeń---------------------------------------------------------

  /// Usuwa wszystkie eventy dla wskazanych wątków.
  /// Nie weryfikuje stanu rozgałęzień.
  ///
  /// @param threadIds lista identyfikatorów wątków do wyczyszczenia
  public void deleteThreadsEvents(List<Integer> threadIds) {
    qdsEventRepository.deleteThreadEvents(threadIds.toArray(new Integer[0]));
  }
}
