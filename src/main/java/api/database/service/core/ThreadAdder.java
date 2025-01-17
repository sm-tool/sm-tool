package api.database.service.core;

import api.database.entity.thread.Thread;
import api.database.model.constant.EventType;
import api.database.model.domain.event.InternalSpecialEvent;
import api.database.model.domain.thread.InternalBranchedThreadCreate;
import api.database.model.request.composite.create.ThreadCreateRequest;
import api.database.repository.thread.ThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Serwis odpowiedzialny za tworzenie nowych wątków w systemie.
/// Obsługuje tworzenie:
/// - Standardowych wątków rozpoczynających się od START
/// - Wątków potomnych z rozgałęzień (FORK/JOIN)
/// - Wątku globalnego dla scenariusza
///
/// # Rodzaje wątków
/// - Standardowy: START -> wydarzenia -> END
/// - Rozgałęziony: FORK_OUT/JOIN_OUT -> wydarzenia -> END
/// - Globalny: START -> wydarzenia -> END (najwyższy priorytet)
@Component
public class ThreadAdder {

  private final ThreadRepository threadRepository;
  private final EventManager eventManager;

  @Autowired
  public ThreadAdder(
    ThreadRepository threadRepository,
    EventManager eventManager
  ) {
    this.threadRepository = threadRepository;
    this.eventManager = eventManager;
  }

  /// Tworzy nowy wątek wraz z jego pierwszym i opcjonalnie ostatnim eventem.
  /// Konfiguruje:
  /// - Podstawowe dane wątku (tytuł, opis, globalność)
  /// - Typ pierwszego eventu (START/FORK_OUT/JOIN_OUT)
  /// - Opcjonalnie dodanie końcowego eventu END
  ///
  /// @param scenarioId id scenariusza
  /// @param title tytuł wątku
  /// @param description opis wątku
  /// @param isGlobal czy wątek jest globalny
  /// @param startTime czas początkowy
  /// @param startEventType typ pierwszego eventu
  /// @param branchingId id rozgałęzienia (dla FORK/JOIN)
  /// @param addLastEvent czy dodać końcowy event END
  /// @return id utworzonego wątku
  private Integer addThreadWithFirstAndLastEvents(
    Integer scenarioId,
    String title,
    String description,
    boolean isGlobal,
    Integer startTime,
    EventType startEventType,
    Integer branchingId,
    Boolean addLastEvent
  ) {
    Thread thread = new Thread(
      null,
      scenarioId,
      title,
      description,
      isGlobal,
      null
    );
    Integer threadId = threadRepository.save(thread).getId();

    // Dodaj wydarzenia
    eventManager.addSpecialEvent(
      new InternalSpecialEvent(threadId, startEventType, startTime, branchingId)
    );
    if (addLastEvent) {
      eventManager.addSpecialEvent(
        new InternalSpecialEvent(threadId, EventType.END, startTime + 1, null)
      );
    }

    return threadId;
  }

  /// Dodaje nowy wątek powstały z rozgałęzienia (FORK/JOIN).
  /// Dla pierwszego wątku potomnego z FORK event END nie jest dodawany,
  /// ponieważ eventy z wątku źródłowego są do niego przenoszone.
  /// Dla pozostałych wątków potomnych event END jest dodawany.
  ///
  /// @param scenarioId id scenariusza
  /// @param info informacje o nowym wątku i rozgałęzieniu
  /// @param addLastEvent czy dodać końcowy event END
  /// @return id utworzonego wątku
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public Integer addBranchedThread(
    Integer scenarioId,
    InternalBranchedThreadCreate info,
    Boolean addLastEvent
  ) {
    return addThreadWithFirstAndLastEvents(
      scenarioId,
      info.threadInfo().title(),
      info.threadInfo().description(),
      false,
      info.threadInfo().startTime(),
      EventType.valueOf(info.branchingType().name() + "_OUT"),
      info.branchingId(),
      addLastEvent
    );
  }

  /// Tworzy nowy standardowy wątek rozpoczynający się od eventu START.
  /// Automatycznie dodaje event END w następnej jednostce czasu.
  ///
  /// @param scenarioId id scenariusza
  /// @param info dane tworzonego wątku
  /// @return id utworzonego wątku
  public Integer addThread(Integer scenarioId, ThreadCreateRequest info) {
    return addThreadWithFirstAndLastEvents(
      scenarioId,
      info.title(),
      info.description(),
      false,
      info.startTime(),
      EventType.START,
      null,
      true
    );
  }

  /// Tworzy wątek globalny dla scenariusza.
  /// Wątek globalny to specjalny wątek o najwyższym priorytecie, którego
  /// wydarzenia (typu GLOBAL) mogą nadpisywać zmiany z innych wątków.
  /// Dodawany wraz ze scenariuszem, dla każdego istnieje tylko jeden.
  /// Zawsze zaczyna się w czasie 0 z eventem START.
  ///
  /// @param scenarioId id scenariusza
  /// @apiNote Metoda musi być wykonywana w ramach transakcji nadrzędnej
  public void addGlobalThread(Integer scenarioId) {
    addThreadWithFirstAndLastEvents(
      scenarioId,
      "Global thread",
      "Global thread",
      true,
      0,
      EventType.START,
      null,
      true
    );
  }
}
