package api.database.service.event;

import api.database.entity.event.Event;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.EventType;
import api.database.model.domain.event.InternalEvent;
import api.database.model.domain.event.InternalValidationEvent;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.update.EventUpdateRequest;
import api.database.model.response.EventResponse;
import api.database.repository.event.EventRepository;
import api.database.service.core.provider.GlobalThreadProvider;
import api.database.service.core.validator.BranchingValidator;
import api.database.service.event.processor.EventChangeProcessor;
import api.database.service.event.validator.EventValidator;
import api.database.service.operations.ScenarioValidator;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/// Serwis zarządzający wydarzeniami w systemie, odpowiada za:
/// - Kompleksową obsługę modyfikacji wydarzeń i ich zawartości
/// - Synchronizację zmian między wątkami normalnymi i globalnym
/// - Walidację spójności zmian atrybutów i asocjacji
/// - Zachowanie integralności przy rozgałęzieniach (FORK/JOIN)
@Service
public class EventService {

  private final EventRepository eventRepository;
  private final GlobalThreadProvider globalThreadProvider;
  private final ScenarioValidator scenarioValidator;
  private final EventProvider eventProvider;
  private final EventChangeProcessor eventChangeProcessor;
  private final EventValidator eventValidator;
  private final BranchingValidator branchingValidator;

  @Autowired
  public EventService(
    EventRepository eventRepository,
    GlobalThreadProvider globalThreadProvider,
    ScenarioValidator scenarioValidator,
    EventProvider eventProvider,
    EventChangeProcessor eventChangeProcessor,
    EventValidator eventValidator,
    BranchingValidator branchingValidator
  ) {
    this.eventRepository = eventRepository;
    this.globalThreadProvider = globalThreadProvider;
    this.scenarioValidator = scenarioValidator;
    this.eventProvider = eventProvider;
    this.eventChangeProcessor = eventChangeProcessor;
    this.eventValidator = eventValidator;
    this.branchingValidator = branchingValidator;
  }

  //----------------------------------------------Zmiana wydarzenia-----------------------------------------------------
  /// Modyfikuje istniejące wydarzenie wraz z jego zmianami.
  /// Proces modyfikacji:
  /// 1. Weryfikacja możliwości modyfikacji typu
  /// 2. Walidacja zmian w kontekście zdarzeń równoległych
  /// 3. Aktualizacja podstawowych danych (poza START)
  /// 4. Przetworzenie zmian atrybutów i asocjacji
  /// 5. Sprawdzenie spójności rozgałęzień
  ///
  /// @param eventId id modyfikowanego wydarzenia
  /// @param request nowe dane wydarzenia
  /// @param scenarioId id scenariusza
  /// @return zaktualizowane wydarzenie
  /// @throws ApiException gdy:
  ///   - Wydarzenie jest niemodyfikowalne (FORK/JOIN/END)
  ///   - Wykryto konflikty czasowe zmian
  ///   - Wątek nie należy do scenariusza
  ///   - Próba niedozwolonej modyfikacji START
  @Transactional
  public EventResponse changeEvent(
    Integer eventId,
    EventUpdateRequest request,
    Integer scenarioId
  ) {
    // 1. Pobranie kontekstu
    InternalEvent event = eventProvider.getInternalEvent(eventId);
    Integer globalThreadId = globalThreadProvider.getGlobalThreadId(scenarioId);

    // 2. Podstawowa walidacja i update eventu
    validateAndUpdateEvent(event, request, globalThreadId, scenarioId);

    // 3. Przetworzenie zmian zawartości
    if (event.eventType().equals(EventType.IDLE)) {
      processNewChanges(event, request, globalThreadId, scenarioId);
    } else {
      processExistingChanges(event, request, globalThreadId, scenarioId);
    }

    // 4. Walidacja spójności rozgałęzień i zwrócenie rezultatu
    branchingValidator.verifyFirstForkAfterChange(event.threadId(), scenarioId);
    return eventProvider.getOneEvent(eventId, scenarioId);
  }

  //--------------------------------------------Funkcje wewnętrzne------------------------------------------------------

  //-----------------------2. Podstawowa walidacja i update eventu------------------------------------------------------

  /// Sprawdza czy typ wydarzenia pozwala na jego modyfikację.
  /// Wydarzenia typu FORK_IN/OUT, JOIN_IN/OUT i END nie mogą być modyfikowane.
  ///
  /// @param eventType typ wydarzenia do sprawdzenia
  /// @return true jeśli modyfikacja jest niedozwolona
  private boolean isNotModifiableEventType(EventType eventType) {
    return (
      eventType != EventType.GLOBAL &&
      eventType != EventType.NORMAL &&
      eventType != EventType.IDLE &&
      eventType != EventType.START
    );
  }

  /// Oblicza typ wydarzenia na podstawie jego zawartości i kontekstu:
  /// - START pozostaje bez zmian
  /// - Puste wydarzenia stają się IDLE
  /// - Wydarzenia w wątku globalnym stają się GLOBAL
  /// - Pozostałe stają się NORMAL
  ///
  /// @param eventType obecny typ
  /// @param request nowe dane
  /// @param globalThreadId id wątku globalnego
  /// @param threadId id wątku
  /// @return obliczony typ wydarzenia
  private EventType calculateEventType(
    EventType eventType,
    EventUpdateRequest request,
    Integer globalThreadId,
    Integer threadId
  ) {
    if (eventType.equals(EventType.START)) return EventType.START;
    if (
      request.associationChanges().isEmpty() &&
      request.attributeChanges().isEmpty()
    ) return EventType.IDLE;
    if (Objects.equals(globalThreadId, threadId)) return EventType.GLOBAL;
    else return EventType.NORMAL;
  }

  /// Weryfikuje możliwość zmiany wydarzenia i aktualizuje jego podstawowe dane.
  /// Sprawdza:
  /// - Czy typ pozwala na modyfikację
  /// - Czy wątek należy do scenariusza
  /// - Oblicza nowy typ na podstawie zmian
  ///
  /// @param event wydarzenie do weryfikacji
  /// @param request nowe dane
  /// @param globalThreadId id wątku globalnego
  /// @param scenarioId id scenariusza
  /// @throws ApiException gdy modyfikacja jest niedozwolona
  private void validateAndUpdateEvent(
    InternalEvent event,
    EventUpdateRequest request,
    Integer globalThreadId,
    Integer scenarioId
  ) {
    if (isNotModifiableEventType(event.eventType())) {
      throw new ApiException(
        ErrorCode.EVENT_NOT_MODIFIABLE,
        ErrorGroup.EVENT,
        HttpStatus.BAD_REQUEST
      );
    }

    scenarioValidator.checkIfThreadsAreInScenario(
      List.of(event.threadId().equals(globalThreadId) ? 0 : event.threadId()),
      scenarioId
    );

    if (!event.eventType().equals(EventType.START)) {
      EventType newType = calculateEventType(
        event.eventType(),
        request,
        globalThreadId,
        event.threadId()
      );
      eventRepository.save(Event.from(event, request, newType));
    }
  }

  /// Przetwarza nowy zestaw zmian dla wydarzenia typu IDLE.
  ///
  /// @param event aktualne wydarzenie
  /// @param request nowe zmiany
  /// @param globalThreadId id wątku globalnego
  /// @param scenarioId id scenariusza
  private void processNewChanges(
    InternalEvent event,
    EventUpdateRequest request,
    Integer globalThreadId,
    Integer scenarioId
  ) {
    // Weryfikacja zmian
    eventValidator.validateEvent(
      InternalValidationEvent.from(request, event),
      event.threadId(),
      globalThreadId,
      scenarioId,
      null //Nie występowały żadne zmiany dlatego można pominąć
    );

    eventChangeProcessor.applyNewChanges(
      event.id(),
      request.attributeChanges(),
      request.associationChanges()
    );
  }

  /// Przetwarza zmiany dla istniejącego wydarzenia z atrybutami/asocjacjami.
  ///
  /// @param event aktualne wydarzenie
  /// @param request nowe zmiany
  /// @param globalThreadId id wątku globalnego
  /// @param scenarioId id scenariusza
  private void processExistingChanges(
    InternalEvent event,
    EventUpdateRequest request,
    Integer globalThreadId,
    Integer scenarioId
  ) {
    // Weryfikacja zmian
    eventValidator.validateEvent(
      InternalValidationEvent.from(request, event),
      event.threadId(),
      globalThreadId,
      scenarioId,
      event.id()
    );
    // Przetwarzanie zmian
    eventChangeProcessor.processExistingChanges(
      event.id(),
      event,
      request,
      event.eventType() == EventType.START
    );
  }
}
