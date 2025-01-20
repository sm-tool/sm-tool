package api.database.service.event;

import api.database.entity.event.Event;
import api.database.entity.object.AttributeChange;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.EventAssociationsStateData;
import api.database.model.domain.association.InternalEventAssociationChange;
import api.database.model.domain.association.InternalLastAssociationChange;
import api.database.model.domain.attribute.InternalLastAttributeChange;
import api.database.model.domain.event.InternalEvent;
import api.database.model.exception.ApiException;
import api.database.model.response.*;
import api.database.repository.event.EventRepository;
import api.database.service.core.ScenarioManager;
import api.database.service.core.provider.EventStateProvider;
import api.database.service.core.provider.GlobalThreadProvider;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/// Serwis dostarczający dane wydarzeń wraz z ich zmianami.
/// Odpowiada za:
/// - Pobieranie wydarzeń dla scenariusza i wątku
/// - Pobieranie zmian atrybutów i asocjacji dla wydarzeń
/// - Mapowanie danych wewnętrznych na struktury odpowiedzi
@Service
public class EventProvider {

  private final EventStateProvider eventStateProvider;
  private final EventRepository eventRepository;
  private final ScenarioManager scenarioManager;
  private final GlobalThreadProvider globalThreadProvider;

  /// Struktura pomocnicza przechowująca aktualne i poprzednie zmiany dla wydarzenia.
  private record EventChanges(
    List<InternalEventAssociationChange> currentAssociationChanges,
    List<InternalLastAssociationChange> lastAssociationChanges,
    List<AttributeChange> currentAttributeChanges,
    List<InternalLastAttributeChange> lastAttributeChanges
  ) {}

  @Autowired
  public EventProvider(
    EventStateProvider eventStateProvider,
    EventRepository eventRepository,
    ScenarioManager scenarioManager,
    GlobalThreadProvider globalThreadProvider
  ) {
    this.eventStateProvider = eventStateProvider;
    this.eventRepository = eventRepository;
    this.scenarioManager = scenarioManager;
    this.globalThreadProvider = globalThreadProvider;
  }

  //----------------------------------------------Mapowanie odpowiedzi-------------------------------------------------
  private List<AssociationChangeResponse> getResponseAssociationChangesForEvent(
    List<InternalEventAssociationChange> currentAssociationChanges,
    List<InternalLastAssociationChange> lastAssociationChanges
  ) {
    return currentAssociationChanges
      .stream()
      .map(current -> {
        InternalLastAssociationChange last = lastAssociationChanges
          .stream()
          .filter(
            l ->
              l.getAssociationTypeId().equals(current.getAssociationTypeId()) &&
              l.getObject1Id().equals(current.getObject1Id()) &&
              l.getObject2Id().equals(current.getObject2Id())
          )
          .findFirst()
          .orElse(null);

        return AssociationChangeResponse.create(current, last);
      })
      .toList();
  }

  private List<AttributeChangeResponse> getResponseAttributeChangesForEvent(
    List<AttributeChange> currentAttributeChanges,
    List<InternalLastAttributeChange> lastAttributeChanges
  ) {
    return currentAttributeChanges
      .stream()
      .map(current -> {
        InternalLastAttributeChange last = lastAttributeChanges
          .stream()
          .filter(l -> l.getAttributeId().equals(current.getAttributeId()))
          .findFirst()
          .orElse(null);

        return AttributeChangeResponse.create(current, last);
      })
      .toList();
  }

  private EventResponse mapEventWithChanges(
    Event event,
    EventChanges eventChanges
  ) {
    List<AssociationChangeResponse> eventAssociationChanges =
      getResponseAssociationChangesForEvent(
        eventChanges.currentAssociationChanges,
        eventChanges.lastAssociationChanges
      );

    List<AttributeChangeResponse> eventAttributeChanges =
      getResponseAttributeChangesForEvent(
        eventChanges.currentAttributeChanges,
        eventChanges.lastAttributeChanges
      );

    return EventResponse.from(
      event,
      eventAssociationChanges,
      eventAttributeChanges
    );
  }

  //----------------------------------------------Pobranie zmian--------------------------------------------------------
  private EventChanges getChangesForEvents(List<Integer> eventIds) {
    return new EventChanges(
      eventStateProvider.getAssociationChangesForEvents(eventIds),
      eventStateProvider.getLastAssociationChanges(eventIds),
      eventStateProvider.getAttributeChangesForEvents(eventIds),
      eventStateProvider.getLastAttributeChanges(eventIds)
    );
  }

  //---------------------------------------------Pobranie wielu wątków--------------------------------------------------
  private List<EventResponse> getMultipleEvents(List<Event> events) {
    List<Integer> eventIds = events.stream().map(Event::getId).toList();

    EventChanges changes = getChangesForEvents(eventIds);
    Map<Integer, List<InternalEventAssociationChange>> currentAssocByEventId =
      changes
        .currentAssociationChanges()
        .stream()
        .collect(
          Collectors.groupingBy(InternalEventAssociationChange::getEventId)
        );

    Map<Integer, List<InternalLastAssociationChange>> lastAssocByEventId =
      changes
        .lastAssociationChanges()
        .stream()
        .collect(
          Collectors.groupingBy(InternalLastAssociationChange::getTargetEventId)
        );

    Map<Integer, List<AttributeChange>> currentAttrByEventId = changes
      .currentAttributeChanges()
      .stream()
      .collect(Collectors.groupingBy(AttributeChange::getEventId));

    Map<Integer, List<InternalLastAttributeChange>> lastAttrByEventId = changes
      .lastAttributeChanges()
      .stream()
      .collect(
        Collectors.groupingBy(InternalLastAttributeChange::getTargetEventId)
      );

    return events
      .stream()
      .map(event ->
        mapEventWithChanges(
          event,
          new EventChanges(
            currentAssocByEventId.getOrDefault(event.getId(), List.of()),
            lastAssocByEventId.getOrDefault(event.getId(), List.of()),
            currentAttrByEventId.getOrDefault(event.getId(), List.of()),
            lastAttrByEventId.getOrDefault(event.getId(), List.of())
          )
        )
      )
      .toList();
  }

  //--------------------------------------------------Pobieranie zdarzeń---------------------------------------------------------
  /// Pobiera stan wydarzenia - aktualne wartości atrybutów i asocjacji.
  ///
  /// @param eventId id wydarzenia
  /// @param scenarioId id scenariusza
  /// @return stan wydarzenia z wartościami atrybutów i asocjacji
  public EventStateResponse getEventState(Integer eventId, Integer scenarioId) {
    List<EventAssociationsStateData> associationsState =
      eventStateProvider.getEventAssociationState(eventId, scenarioId);
    List<EventAttributesStateResponse> attributesState =
      eventStateProvider.getEventAttributeState(eventId, scenarioId);
    return new EventStateResponse(attributesState, associationsState);
  }

  public EventStateResponse getEventPreviousState(
    Integer eventId,
    Integer scenarioId
  ) {
    List<EventAssociationsStateData> associationsState =
      eventStateProvider.getEventPreviousAssociationState(eventId, scenarioId);
    List<EventAttributesStateResponse> attributesState =
      eventStateProvider.getEventPreviousAttributeState(eventId, scenarioId);
    return new EventStateResponse(attributesState, associationsState);
  }

  //TODO - testy
  /// Pobiera wszystkie wydarzenia scenariusza wraz ze zmianami.
  /// Grupuje zmiany per wydarzenie i mapuje je na strukturę odpowiedzi.
  ///
  /// @param scenarioId id scenariusza
  /// @return lista wydarzeń z przypisanymi zmianami
  /// @apiNote Wykonywana w ramach własnej transakcji
  @Transactional
  public List<EventResponse> getEventsForScenario(Integer scenarioId) {
    // Pobranie wydarzeń
    List<Event> events = eventRepository.getScenarioEvents(scenarioId);

    return getMultipleEvents(events);
  }

  /// Pobiera wydarzenia dla wątku wraz z ich zmianami.
  ///
  /// @param threadId id wątku
  /// @param scenarioId id scenariusza
  /// @return lista wydarzeń z przypisanymi zmianami
  /// @throws ApiException gdy wątek nie istnieje
  public List<EventResponse> getEventsForThread(
    Integer threadId,
    Integer scenarioId
  ) {
    scenarioManager.checkIfThreadsAreInScenario(List.of(threadId), scenarioId);
    // Pobranie wydarzeń
    List<Event> events = eventRepository.getThreadEvents(threadId, scenarioId);
    if (events.isEmpty()) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.THREAD,
      HttpStatus.NOT_FOUND
    );
    return getMultipleEvents(events);
  }

  /// Pobiera pojedyncze wydarzenie wraz z jego zmianami.
  ///
  /// @param eventId id wydarzenia
  /// @return wydarzenie z przypisanymi zmianami
  /// @throws ApiException gdy wydarzenie nie istnieje
  /// @apiNote Wykonywana w ramach własnej transakcji
  @Transactional
  public EventResponse getOneEvent(Integer eventId, Integer scenarioId) {
    Integer globalThread = globalThreadProvider.getGlobalThreadId(scenarioId);
    Event event = eventRepository
      .findById(eventId)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          List.of(eventId.toString()),
          ErrorGroup.EVENT,
          HttpStatus.NOT_FOUND
        )
      );
    if (event.getThreadId().equals(globalThread)) event.setThreadId(0);
    scenarioManager.checkIfThreadsAreInScenario(
      List.of(event.getThreadId()),
      scenarioId
    );
    EventChanges changes = getChangesForEvents(List.of(eventId));

    return mapEventWithChanges(event, changes);
  }

  //----------------------------------------------------Wewnętrzny dla zmian--------------------------------------------
  /// Pobiera wydarzenie w formacie wewnętrznym do walidacji.
  ///
  /// @param eventId id wydarzenia
  /// @return wewnętrzna reprezentacja wydarzenia
  /// @throws ApiException gdy wydarzenie nie istnieje
  public InternalEvent getInternalEvent(Integer eventId) {
    Event event = eventRepository
      .findById(eventId)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.EVENT,
          HttpStatus.NOT_FOUND
        )
      );
    List<AttributeChange> attributeChanges =
      eventStateProvider.getAttributeChangesForEvents(List.of(eventId));
    List<InternalEventAssociationChange> associationChanges =
      eventStateProvider.getAssociationChangesForEvents(List.of(eventId));
    return InternalEvent.from(event, associationChanges, attributeChanges);
  }

  public List<Event> getEventsForThreadWithoutChanges(
    Integer threadId,
    Integer scenarioId
  ) {
    return eventRepository.getThreadEvents(threadId, scenarioId);
  }
}
