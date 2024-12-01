package api.database.service.event;

import api.database.entity.event.QdsEvent;
import api.database.entity.object.QdsAttributeChange;
import api.database.model.QdsResponseUpdateList;
import api.database.model.association.QdsInfoAssociationChange;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.QdsEventType;
import api.database.model.event.*;
import api.database.model.exception.ApiException;
import api.database.model.internal.association.QdsInternalAssociationChangeEvent;
import api.database.model.internal.object.QdsInternalObjectInEvent;
import api.database.repository.event.QdsEventRepository;
import api.database.service.core.EventBaseOperations;
import api.database.service.core.ThreadBaseOperations;
import api.database.service.core.ThreadObjectManagement;
import api.database.service.object.AttributeService;
import jakarta.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/// Serwis zarządzający wydarzeniami w scenariuszu. Odpowiada za:
/// - Pobieranie i zwracanie wydarzeń wraz z ich zmianami
/// - Dodawanie nowych wydarzeń z walidacją zmian
/// - Synchronizację zmian między wątkami normalnymi i globalnym
@Service
public class EventService {

  private final QdsEventRepository qdsEventRepository;
  private final EventAssociationService eventAssociationService;
  private final AttributeService attributeService;
  private final ThreadBaseOperations threadBaseOperations;
  private final EventBaseOperations eventBaseOperations;
  private final ThreadObjectManagement threadObjectManagement;
  private final EventValidation eventValidation;

  @Autowired
  public EventService(
    QdsEventRepository qdsEventRepository,
    EventAssociationService eventAssociationService,
    AttributeService attributeService,
    ThreadBaseOperations threadBaseOperations,
    EventBaseOperations eventBaseOperations,
    ThreadObjectManagement threadObjectManagement,
    EventValidation eventValidation
  ) {
    this.qdsEventRepository = qdsEventRepository;
    this.eventAssociationService = eventAssociationService;
    this.attributeService = attributeService;
    this.threadBaseOperations = threadBaseOperations;
    this.eventBaseOperations = eventBaseOperations;
    this.threadObjectManagement = threadObjectManagement;
    this.eventValidation = eventValidation;
  }

  //--------------------------------------------------Pobieranie zdarzeń---------------------------------------------------------

  //TODO - testy
  /// Pobiera wszystkie wydarzenia scenariusza wraz ze zmianami atrybutów i asocjacji.
  /// Grupuje zmiany per wydarzenie i mapuje je na strukturę odpowiedzi.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @return lista wydarzeń z przypisanymi zmianami
  /// @apiNote Wykonywana w ramach własnej transakcji
  @Transactional
  public List<QdsDataEvent> getEventsForScenario(Integer scenarioId) {
    List<QdsEvent> events = qdsEventRepository.getScenarioEvents(scenarioId);
    List<Integer> eventIds = events.stream().map(QdsEvent::getId).toList();
    List<QdsInternalAssociationChangeEvent> associationChanges =
      eventAssociationService.getAssociationChangesForEvents(eventIds);
    List<QdsAttributeChange> attributeChanges =
      attributeService.getAttributeChangesForEvents(eventIds);

    Map<
      Integer,
      List<QdsInternalAssociationChangeEvent>
    > associationChangesByEventId = associationChanges
      .stream()
      .collect(
        Collectors.groupingBy(QdsInternalAssociationChangeEvent::eventId)
      );

    Map<Integer, List<QdsAttributeChange>> attributeChangesByEventId =
      attributeChanges
        .stream()
        .collect(Collectors.groupingBy(QdsAttributeChange::getEventId));

    return events
      .stream()
      .map(event -> {
        List<QdsInternalAssociationChangeEvent> eventAssociationChanges =
          associationChangesByEventId.getOrDefault(event.getId(), List.of());
        List<QdsAttributeChange> eventAttributeChanges =
          attributeChangesByEventId.getOrDefault(event.getId(), List.of());

        return new QdsDataEvent(
          event.getId(),
          event.getThreadId(),
          event.getEventTime(),
          event.getEventType(),
          event.getDescription(),
          event.getTitle(),
          eventAssociationChanges
            .stream()
            .map(associationChange ->
              new QdsInfoAssociationChange(
                associationChange.associationTypeId(),
                associationChange.object1Id(),
                associationChange.object2Id(),
                associationChange.associationOperation()
              )
            )
            .toList(),
          eventAttributeChanges
            .stream()
            .map(attributeChange ->
              new QdsInfoAttributeChange(
                attributeChange.getAttributeId(),
                attributeChange.getValue()
              )
            )
            .toList()
        );
      })
      .toList();
  }

  //--------------------------------------------------Dodawanie zdarzeń---------------------------------------------------------

  //TODO - sprawdzenie
  /// Dodaje nowe wydarzenie wraz ze zmianami atrybutów i asocjacji.
  /// Obsługuje wydarzenia typu NORMAL i GLOBAL, z różną logiką walidacji.
  /// Proces dodawania:
  /// 1. Określa typ wydarzenia (NORMAL/GLOBAL)
  /// 2. Modyfikuje ostatnie wydarzenie wątku
  /// 3. Waliduje dostępność obiektów i możliwość zmian
  /// 4. Zapisuje wydarzenie i jego zmiany
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param info dane wydarzenia do dodania
  /// @return status aktualizacji
  /// @apiNote Operacja wykonywana w ramach odrębnej transakcji
  @Transactional
  public QdsResponseUpdateList addEvent(Integer scenarioId, QdsDataEvent info) {
    //Globalny wątek
    Integer globalThreadId = threadBaseOperations.getGlobalThreadId(scenarioId);
    QdsEventType type = globalThreadId.intValue() ==
        info.threadId().intValue() ||
      info.threadId() == 0
      ? QdsEventType.GLOBAL
      : QdsEventType.NORMAL;
    //Ostatni event
    eventBaseOperations.saveModifiedLastEvent(
      eventBaseOperations.getAndCheckLastEvent(
        type == QdsEventType.GLOBAL ? globalThreadId : info.threadId(),
        info.time()
      ),
      new QdsInfoEventModifyLast(info.time() + 1, QdsEventType.END, null)
    );
    //Sprawdzenie dostępności obiektów/atrybutów
    List<QdsInternalObjectInEvent> objects =
      threadObjectManagement.getObjectsAvailableForThread(
        info.threadId(), //jeżeli byłoby to zero jest po prostu zignorowany jako że żaden wątek nie ma id=0
        globalThreadId
      );
    eventValidation.checkChangesPossibilities(
      objects,
      info.associationsChanges(),
      info.attributeChanges()
    );
    //Sprawdzenie innych zmian w tym samym czasie
    eventValidation.checkOtherEventsChanges(scenarioId, objects, info, type);

    //Dodanie zdarzenia
    Integer eventId = qdsEventRepository
      .save(
        new QdsEvent(
          null,
          type == QdsEventType.GLOBAL ? globalThreadId : info.threadId(),
          info.time(),
          type,
          info.title(),
          info.description(),
          null,
          null,
          null
        )
      )
      .getId();
    //TODO - fork może się zabić - naprawić to trzeba Zmieniono asocjacje obiektów przed FORK
    //Dodanie zmian asocjacji
    for (QdsInfoAssociationChange associationChange : info.associationsChanges()) {
      eventAssociationService.addAssociationChange(
        new QdsInfoAssociationChange(
          associationChange.associationTypeId(),
          associationChange.object1Id(),
          associationChange.object2Id(),
          associationChange.associationOperation()
        ),
        eventId
      );
    }
    //Dodanie zmian atrybutów
    for (QdsInfoAttributeChange attributeChange : info.attributeChanges()) {
      attributeService.addAttributeChange(
        new QdsInfoAttributeChange(
          attributeChange.attributeId(),
          attributeChange.value()
        ),
        eventId
      );
    }
    return new QdsResponseUpdateList(List.of("event"));
  }

  //---------------------Usuwanie eventu------------------------------

  @Transactional
  public void deleteEventIfValid(Integer eventId) {
    if (!qdsEventRepository.existsById(eventId)) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.EVENT,
        HttpStatus.NOT_FOUND
      );
    }
    QdsEvent event = qdsEventRepository.findById(eventId).get();
    if (!isDeletableEventType(event.getEventType())) {
      throw new ApiException(
        ErrorCode.EVENT_NOT_DELETABLE,
        ErrorGroup.EVENT,
        HttpStatus.BAD_REQUEST
      );
    }
    qdsEventRepository.delete(event);
  }

  private boolean isDeletableEventType(QdsEventType eventType) {
    return (
      !eventType.equals(QdsEventType.FORK_OUT) &&
      !eventType.equals(QdsEventType.FORK_IN) &&
      !eventType.equals(QdsEventType.JOIN_IN) &&
      !eventType.equals(QdsEventType.JOIN_OUT) &&
      !eventType.equals(QdsEventType.START) &&
      !eventType.equals(QdsEventType.END)
    );
  }
}
