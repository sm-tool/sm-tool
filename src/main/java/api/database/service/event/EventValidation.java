package api.database.service.event;

import api.database.entity.object.QdsAttributeChange;
import api.database.model.association.QdsInfoAssociationChange;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.QdsEventType;
import api.database.model.event.QdsDataEvent;
import api.database.model.event.QdsInfoAttributeChange;
import api.database.model.exception.ApiException;
import api.database.model.internal.association.QdsInternalAssociationChangeEvent;
import api.database.model.internal.object.QdsInternalObjectInEvent;
import api.database.repository.event.QdsEventRepository;
import api.database.service.core.AssociationOperations;
import api.database.service.object.AttributeService;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Klasa odpowiedzialna za walidację zmian w eventach scenariusza.
/// Sprawdza poprawność i możliwość wykonania zmian w kontekście atrybutów i asocjacji,
/// uwzględniając różne typy eventów (normalne i globalne) oraz konflikty czasowe.
@Component
public class EventValidation {

  private final QdsEventRepository eventRepository;
  private final AttributeService attributeService;
  private final EventAssociationService eventAssociationService;
  private final EventObjectManagement eventObjectManagement;
  private final AssociationOperations associationOperations;

  EventValidation(
    QdsEventRepository eventRepository,
    AttributeService attributeService,
    EventAssociationService eventAssociationService,
    EventObjectManagement eventObjectManagement,
    AssociationOperations associationOperations
  ) {
    this.eventRepository = eventRepository;
    this.attributeService = attributeService;
    this.eventAssociationService = eventAssociationService;
    this.eventObjectManagement = eventObjectManagement;
    this.associationOperations = associationOperations;
  }

  /// Weryfikuje możliwość wykonania zmian w kontekście dostępności obiektów na danym wątku.
  /// Sprawdza, czy:
  /// - wszystkie obiekty użyte w asocjacjach są dostępne na wątku
  /// - wszystkie atrybuty, które mają być zmienione, należą do dostępnych obiektów
  ///
  /// @param objects lista obiektów dostępnych na wątku
  /// @param associations lista planowanych zmian w asocjacjach
  /// @param attributes lista planowanych zmian w atrybutach
  /// @throws ApiException gdy próba użycia niedostępnych obiektów lub atrybutów
  public void checkChangesPossibilities(
    List<QdsInternalObjectInEvent> objects,
    List<QdsInfoAssociationChange> associations,
    List<QdsInfoAttributeChange> attributes
  ) {
    Set<String> wrongObjects = new HashSet<>();

    Set<Integer> objectIds = objects
      .stream()
      .map(QdsInternalObjectInEvent::id)
      .collect(Collectors.toSet());

    // Sprawdzanie asocjacji
    associations.forEach(association -> {
      Integer object1Id = association.object1Id();
      Integer object2Id = association.object2Id();

      if (!objectIds.contains(object1Id)) wrongObjects.add(
        object1Id.toString()
      );
      if (!objectIds.contains(object2Id)) wrongObjects.add(
        object2Id.toString()
      );
    });

    if (!wrongObjects.isEmpty()) throw new ApiException(
      ErrorCode.CANNOT_USE_OBJECTS_IN_THREAD,
      wrongObjects.stream().toList(),
      ErrorGroup.ASSOCIATION_CHANGE,
      HttpStatus.BAD_REQUEST
    );

    Set<Integer> availableAttributes = objects
      .stream()
      .flatMap(obj -> obj.attributes().stream())
      .collect(Collectors.toSet());

    Set<String> wrongAttributes = attributes
      .stream()
      .map(QdsInfoAttributeChange::attributeId)
      .filter(attributeId -> !availableAttributes.contains(attributeId))
      .map(Object::toString)
      .collect(Collectors.toSet());
    if (!wrongAttributes.isEmpty()) throw new ApiException(
      ErrorCode.CANNOT_USE_ATTRIBUTES_IN_THREAD,
      wrongAttributes.stream().toList(),
      ErrorGroup.EVENT,
      HttpStatus.BAD_REQUEST
    );
  }

  /// Sprawdza konflikty w zmianach atrybutów dla danego czasu.
  /// Dla eventów normalnych zgłasza błąd przy próbie modyfikacji tego samego obiektu.
  /// Dla eventów globalnych usuwa kolidujące zmiany.
  ///
  /// @param eventIds identyfikatory eventów do sprawdzenia
  /// @param info dane aktualnego eventu
  /// @param objects dostępne obiekty
  /// @param eventType typ eventu określający sposób obsługi konfliktów
  /// @throws ApiException dla eventów typu NORMAL gdy wykryto konflikt zmian
  private void checkAttributeChanges(
    List<Integer> eventIds,
    QdsDataEvent info,
    List<QdsInternalObjectInEvent> objects,
    QdsEventType eventType
  ) {
    //Istniejące obecnie zmiany atrybutów w danym czasie
    List<Integer> databaseUsedAttributes = attributeService
      .getAttributeChangesForEvents(eventIds)
      .stream()
      .map(QdsAttributeChange::getAttributeId)
      .toList();
    //Obiekty użyte w danym evencie
    List<Integer> allUsedAttributes = info
      .attributeChanges()
      .stream()
      .map(QdsInfoAttributeChange::attributeId)
      .toList();
    List<QdsInternalObjectInEvent> allUsedObjects = objects
      .stream()
      .filter(object ->
        !Collections.disjoint(object.attributes(), allUsedAttributes)
      )
      .toList();
    List<QdsInternalObjectInEvent> objectsUsedMoreThanOnce = allUsedObjects
      .stream()
      .filter(object ->
        !Collections.disjoint(object.attributes(), databaseUsedAttributes)
      )
      .toList();
    //Dla zwykłego wątku - błąd próby zmiany 1 obiektu na różnych wątkach
    if (
      eventType == QdsEventType.NORMAL && !objectsUsedMoreThanOnce.isEmpty()
    ) throw new ApiException(
      ErrorCode.MANY_OBJECT_CHANGES_AT_THE_SAME_TIME,
      objectsUsedMoreThanOnce
        .stream()
        .map(QdsInternalObjectInEvent::id)
        .map(Object::toString)
        .toList(),
      ErrorGroup.EVENT,
      HttpStatus.BAD_REQUEST
    );
    //Globalny wątek wymusza dane zmiany
    else if (
      eventType == QdsEventType.GLOBAL && !objectsUsedMoreThanOnce.isEmpty()
    ) {
      eventObjectManagement.deleteAttributeChanges(
        info.time(),
        objectsUsedMoreThanOnce
          .stream()
          .map(QdsInternalObjectInEvent::id)
          .toList()
      );
    }
  }

  /// Waliduje zmiany w asocjacjach pod kątem konfliktów czasowych.
  /// Sprawdza, czy te same asocjacje (określone przez pary object1Id:object2Id)
  /// nie są modyfikowane przez inne eventy w tym samym czasie.
  ///
  /// @param eventIds identyfikatory eventów do sprawdzenia
  /// @param info dane aktualnego eventu
  /// @param eventType typ eventu określający sposób obsługi konfliktów
  /// @throws ApiException dla eventów typu NORMAL gdy wykryto próbę modyfikacji tej samej asocjacji
  private void checkAssociationChanges(
    List<Integer> eventIds,
    QdsDataEvent info,
    QdsEventType eventType
  ) {
    List<QdsInternalAssociationChangeEvent> associationChanges =
      eventAssociationService.getAssociationChangesForEvents(eventIds);
    List<QdsInternalAssociationChangeEvent> matchingAssociations =
      associationChanges
        .stream()
        .filter(change ->
          info
            .associationsChanges()
            .stream()
            .anyMatch(
              infoChange ->
                change.object1Id().equals(infoChange.object1Id()) &&
                change.object2Id().equals(infoChange.object2Id())
            )
        )
        .toList();
    if (
      eventType == QdsEventType.NORMAL && !matchingAssociations.isEmpty()
    ) throw new ApiException(
      ErrorCode.MULTIPLE_SAME_ASSOCIATION_CHANGE_DEFINITIONS,
      matchingAssociations
        .stream()
        .map(a -> a.object1Id() + ":" + a.object2Id())
        .toList(),
      ErrorGroup.EVENT,
      HttpStatus.BAD_REQUEST
    );
    else if (
      eventType == QdsEventType.GLOBAL && !matchingAssociations.isEmpty()
    ) {
      eventObjectManagement.deleteAssociationChanges(
        info.time(),
        matchingAssociations
      );
      associationOperations.deleteNotUsedAssociations();
    }
  }

  /// Sprawdza, czy wprowadzane zmiany nie kolidują z innymi eventami w danym czasie.
  /// Dla eventów typu NORMAL weryfikuje czy nie ma konfliktów z istniejącymi zmianami.
  /// Dla eventów typu GLOBAL usuwa kolidujące zmiany, gdyż wątek globalny ma priorytet.
  ///
  /// @param scenarioId ID scenariusza, w którym następują zmiany
  /// @param objects lista obiektów dostępnych w kontekście eventu
  /// @param info dane eventu zawierające czas i planowane zmiany
  /// @param eventType typ eventu (NORMAL/GLOBAL) określający strategię obsługi konfliktów
  public void checkOtherEventsChanges(
    Integer scenarioId,
    List<QdsInternalObjectInEvent> objects,
    QdsDataEvent info,
    QdsEventType eventType
  ) {
    //Wszystkie wydarzenia scenriusza w danym czasie
    List<Integer> eventIds = eventRepository.getScenarioEventIdsInTime(
      scenarioId,
      info.time()
    );
    checkAttributeChanges(eventIds, info, objects, eventType);
    checkAssociationChanges(eventIds, info, eventType);
  }
}
