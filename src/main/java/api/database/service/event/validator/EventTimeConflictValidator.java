package api.database.service.event.validator;

import api.database.entity.object.AttributeChange;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.EventType;
import api.database.model.data.AssociationChangeData;
import api.database.model.data.AttributeChangeData;
import api.database.model.domain.association.InternalAssociationKey;
import api.database.model.domain.association.InternalEventAssociationChange;
import api.database.model.domain.event.InternalValidationEvent;
import api.database.model.domain.object.InternalObjectInstanceAttributes;
import api.database.model.exception.ApiException;
import api.database.repository.event.EventRepository;
import api.database.service.core.ObjectStateCleaner;
import api.database.service.core.provider.EventStateProvider;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Walidator konfliktów czasowych dla zmian atrybutów i asocjacji w wydarzeniach.
/// Odpowiada za:
/// - Sprawdzanie konfliktów zmian dla tego samego obiektu w tym samym czasie
/// - Usuwanie konfliktowych zmian dla wydarzeń globalnych
/// - Wykrywanie prób modyfikacji tych samych atrybutów/asocjacji
@Component
public class EventTimeConflictValidator {

  private final EventRepository eventRepository;
  private final ObjectStateCleaner objectStateCleaner;
  private final EventStateProvider eventStateProvider;

  @Autowired
  public EventTimeConflictValidator(
    EventRepository eventRepository,
    ObjectStateCleaner objectStateCleaner,
    EventStateProvider eventStateProvider
  ) {
    this.eventRepository = eventRepository;
    this.objectStateCleaner = objectStateCleaner;
    this.eventStateProvider = eventStateProvider;
  }

  /// Waliduje konflikty czasowe dla zmian w wydarzeniu.
  /// Sprawdza:
  /// 1. Zmiany atrybutów tych samych obiektów
  /// 2. Zmiany tych samych asocjacji
  /// Dla wydarzeń globalnych usuwa konflikty, dla normalnych rzuca wyjątek.
  ///
  /// @param objects lista obiektów dostępnych w kontekście
  /// @param event walidowane wydarzenie
  /// @param scenarioId id scenariusza
  /// @param modifiedEventId id modyfikowanego eventu (null dla nowego)
  /// @throws ApiException gdy wykryto konflikt dla wydarzenia normalnego
  public void validateTimeConflicts(
    List<InternalObjectInstanceAttributes> objects,
    InternalValidationEvent event,
    Integer scenarioId,
    Integer modifiedEventId
  ) {
    List<Integer> eventIdsInTime = eventRepository
      .getScenarioEventIdsInTime(scenarioId, event.time())
      .stream()
      .filter(id -> !id.equals(modifiedEventId))
      .toList();
    validateAttributeConflicts(eventIdsInTime, objects, event, scenarioId);
    validateAssociationConflicts(eventIdsInTime, event, scenarioId);
  }

  /// Waliduje konflikty czasowe dla zmian atrybutów.
  /// Wykrywa próby modyfikacji tych samych atrybutów obiektów
  /// w tym samym czasie przez różne wydarzenia.
  ///
  /// @param eventIds lista id wydarzeń do sprawdzenia
  /// @param objects lista dostępnych obiektów z atrybutami
  /// @param info informacje o wydarzeniu
  /// @throws ApiException gdy wykryto konflikt dla wydarzenia normalnego
  private void validateAttributeConflicts(
    List<Integer> eventIds,
    List<InternalObjectInstanceAttributes> objects,
    InternalValidationEvent info,
    Integer scenarioId
  ) {
    List<Integer> existingChangedAttributes = eventStateProvider
      .getAttributeChangesForEvents(eventIds)
      .stream()
      .map(AttributeChange::getAttributeId)
      .toList();

    Set<Integer> objectsWithConflictingChanges =
      findObjectsWithConflictingAttributeChanges(
        objects,
        info.attributeChanges(),
        existingChangedAttributes
      );

    if (objectsWithConflictingChanges.isEmpty()) {
      return;
    }

    if (info.eventType() == EventType.NORMAL) {
      throw new ApiException(
        ErrorCode.MANY_OBJECT_CHANGES_AT_THE_SAME_TIME,
        objectsWithConflictingChanges.stream().map(Object::toString).toList(),
        ErrorGroup.EVENT,
        HttpStatus.BAD_REQUEST
      );
    }

    // Dla GLOBAL usuwamy konflikty
    objectStateCleaner.deleteAttributeChangesInTime(
      info.time(),
      objectsWithConflictingChanges.stream().toList(),
      scenarioId
    );
  }

  /// Znajduje obiekty z konfliktowymi zmianami atrybutów.
  /// Obiekt ma konflikt gdy:
  /// - Posiada atrybut modyfikowany w nowych zmianach
  /// - Ten sam atrybut jest modyfikowany w istniejącym wydarzeniu
  ///
  /// @param objects lista obiektów z atrybutami
  /// @param newChanges lista nowych zmian atrybutów
  /// @param existingChangedAttributes lista już zmienionych atrybutów
  /// @return zbiór id obiektów z konfliktami
  private Set<Integer> findObjectsWithConflictingAttributeChanges(
    List<InternalObjectInstanceAttributes> objects,
    List<AttributeChangeData> newChanges,
    List<Integer> existingChangedAttributes
  ) {
    if (existingChangedAttributes.isEmpty()) {
      return Collections.emptySet();
    }

    return objects
      .stream()
      .filter(object -> {
        List<Integer> objectAttributes = newChanges
          .stream()
          .map(AttributeChangeData::attributeId)
          .filter(object.getAttributes()::contains)
          .toList();
        return !Collections.disjoint(
          objectAttributes,
          existingChangedAttributes
        );
      })
      .map(InternalObjectInstanceAttributes::getId)
      .collect(Collectors.toSet());
  }

  /// Waliduje konflikty czasowe dla zmian asocjacji.
  /// Wykrywa próby modyfikacji tych samych asocjacji w tym samym czasie.
  ///
  /// @param eventIds lista id wydarzeń do sprawdzenia
  /// @param info informacje o wydarzeniu
  /// @throws ApiException gdy wykryto konflikt dla wydarzenia normalnego
  private void validateAssociationConflicts(
    List<Integer> eventIds,
    InternalValidationEvent info,
    Integer scenarioId
  ) {
    List<InternalEventAssociationChange> conflictingAssociations =
      findConflictingAssociations(eventIds, info.associationChanges());

    if (conflictingAssociations.isEmpty()) {
      return;
    }

    if (info.eventType() == EventType.NORMAL) {
      throw new ApiException(
        ErrorCode.MULTIPLE_SAME_ASSOCIATION_CHANGE_DEFINITIONS,
        conflictingAssociations
          .stream()
          .map(a -> a.getObject1Id() + ":" + a.getObject2Id())
          .toList(),
        ErrorGroup.EVENT,
        HttpStatus.BAD_REQUEST
      );
    }

    // Dla GLOBAL usuwamy konflikty
    objectStateCleaner.deleteAssociationChangesInTime(
      info.time(),
      conflictingAssociations,
      scenarioId
    );
    objectStateCleaner.deleteNotUsedAssociations();
  }

  /// Znajduje konfliktowe zmiany asocjacji.
  /// Konflikt występuje gdy:
  /// - Te same obiekty są łączone tym samym typem asocjacji
  /// - W tym samym czasie w różnych wydarzeniach
  ///
  /// @param eventIds lista id wydarzeń do sprawdzenia
  /// @param newChanges lista nowych zmian asocjacji
  /// @return lista konfliktowych zmian asocjacji
  private List<InternalEventAssociationChange> findConflictingAssociations(
    List<Integer> eventIds,
    List<AssociationChangeData> newChanges
  ) {
    return eventStateProvider
      .getAssociationChangesForEvents(eventIds)
      .stream()
      .filter(existing ->
        newChanges
          .stream()
          .anyMatch(newChange ->
            InternalAssociationKey.from(newChange).equals(
              InternalAssociationKey.from(existing)
            )
          )
      )
      .toList();
  }
}
