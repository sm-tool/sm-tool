package api.database.service.core;

import api.database.entity.event.Event;
import api.database.model.constant.EventType;
import api.database.repository.special.IdleEventRepository;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.stereotype.Component;

/// Zarządza wydarzeniami typu IDLE w systemie.
/// Odpowiada za:
/// - Wypełnianie luk czasowych wydarzeniami IDLE
/// - Konwersję wydarzeń IDLE na wydarzenia rozgałęzień
/// - Czyszczenie nieaktualnych wydarzeń IDLE
///
/// # Zastosowanie
/// Wydarzenia IDLE służą jako:
/// - Wypełniacze przestrzeni czasowej między wydarzeniami
/// - Potencjalne miejsca na przyszłe wydarzenia rozgałęzień (FORK/JOIN)
/// - Wskaźniki braku aktywności w danym przedziale czasu
///
/// # Ważne zasady
/// - Wydarzenia IDLE nie mogą zawierać zmian atrybutów ani asocjacji
/// - Mogą być przekształcane w wydarzenia rozgałęzień (FORK/JOIN)
/// - Są automatycznie czyszczone gdy stają się nieaktualne
@Component
public class IdleEventManager {

  private final IdleEventRepository idleEventRepository;

  public IdleEventManager(IdleEventRepository idleEventRepository) {
    this.idleEventRepository = idleEventRepository;
  }

  /// Wypełnia przedział czasowy w wątku wydarzeniami typu IDLE.
  /// Tworzy wydarzenia IDLE dla każdej jednostki czasu w zadanym przedziale.
  ///
  /// @param threadId identyfikator wątku
  /// @param timeFrom początek przedziału czasowego (włącznie)
  /// @param timeTo koniec przedziału czasowego (wyłącznie)
  public void fillWithIdleEvents(
    Integer threadId,
    Integer timeFrom,
    Integer timeTo
  ) {
    List<Event> idleEvents = IntStream.range(timeFrom, timeTo)
      .mapToObj(time -> Event.createIdle(time, threadId))
      .collect(Collectors.toList());

    idleEventRepository.saveAll(idleEvents);
  }

  /// Pobiera wydarzenie IDLE dla konkretnego czasu i wątku.
  ///
  /// @param time jednostka czasu
  /// @param threadId identyfikator wątku
  /// @return wydarzenie IDLE lub null jeśli nie znaleziono
  public Event getIdleEventInTimeAndThread(Integer time, Integer threadId) {
    return idleEventRepository.getIdleEventInTimeAndThread(time, threadId);
  }

  /// Przekształca wydarzenie IDLE w wydarzenie rozgałęzienia (FORK/JOIN).
  /// Aktualizuje typ wydarzenia i usuwa niepotrzebne pola.
  ///
  /// @param event wydarzenie IDLE do przekształcenia
  /// @param branchingId identyfikator rozgałęzienia
  /// @param eventType nowy typ wydarzenia (FORK_IN/FORK_OUT/JOIN_IN/JOIN_OUT)
  public void changeIdleToBranched(
    Event event,
    Integer branchingId,
    EventType eventType
  ) {
    event.setBranchingId(branchingId);
    event.setEventType(eventType);
    event.setDescription(null);
    event.setTitle(null);
    idleEventRepository.save(event);
  }

  /// Czyści wszystkie nieaktualne wydarzenia IDLE w scenariuszu.
  ///
  /// @param scenarioId identyfikator scenariusza
  public void cleanupIdleEvents(Integer scenarioId) {
    idleEventRepository.cleanupIdleEvents(scenarioId);
  }

  /// Usuwa wydarzenia IDLE z podanego przedziału czasowego w wątku.
  ///
  /// @param threadId identyfikator wątku
  /// @param timeFrom początek przedziału czasowego (włącznie)
  /// @param timeTo koniec przedziału czasowego (wyłącznie)
  public void cleanIdleEvents(
    Integer threadId,
    Integer timeFrom,
    Integer timeTo
  ) {
    idleEventRepository.cleanIdleEvents(threadId, timeFrom, timeTo);
  }
}
