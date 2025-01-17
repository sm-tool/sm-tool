package api.database.service.event.processor;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.AssociationChangeData;
import api.database.model.data.AttributeChangeData;
import api.database.model.domain.association.InternalAssociationKey;
import api.database.model.domain.event.InternalEvent;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.update.EventUpdateRequest;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Procesor zarządzający zmianami atrybutów i asocjacji w wydarzeniach.
/// Odpowiada za:
/// - Dodawanie nowych zmian
/// - Aktualizację istniejących zmian
/// - Usuwanie zmian i porządkowanie stanu
/// - Wykrywanie rzeczywistych różnic między stanami
@Component
public class EventChangeProcessor {

  private final AttributeChangeExecutor attributeExecutor;
  private final AssociationChangeExecutor associationExecutor;

  /// Reprezentuje zestawy zmian do wykonania dla atrybutów/asocjacji
  private record ChangeSets<T>(
    Set<T> toAdd,
    Set<T> toUpdate,
    Set<T> toDelete
  ) {}

  @Autowired
  public EventChangeProcessor(
    AttributeChangeExecutor attributeExecutor,
    AssociationChangeExecutor associationExecutor
  ) {
    this.attributeExecutor = attributeExecutor;
    this.associationExecutor = associationExecutor;
  }

  private void execute(
    Integer eventId,
    ChangeSets<AttributeChangeData> attributeChanges,
    ChangeSets<AssociationChangeData> associationChanges
  ) {
    attributeExecutor.executeChanges(
      eventId,
      attributeChanges.toAdd,
      attributeChanges.toUpdate,
      attributeChanges.toDelete
    );

    associationExecutor.executeChanges(
      eventId,
      associationChanges.toAdd(),
      associationChanges.toDelete()
    );
  }

  /// Wykonuje nowy zestaw zmian dla wydarzenia.
  /// Wszystkie zmiany traktowane są jako dodawanie nowych wartości.
  ///
  /// @param eventId id wydarzenia
  /// @param attributeChanges lista zmian atrybutów
  /// @param associationChanges lista zmian asocjacji
  public void applyNewChanges(
    Integer eventId,
    List<AttributeChangeData> attributeChanges,
    List<AssociationChangeData> associationChanges
  ) {
    execute(
      eventId,
      new ChangeSets<>(new HashSet<>(attributeChanges), Set.of(), Set.of()),
      new ChangeSets<>(new HashSet<>(associationChanges), Set.of(), Set.of())
    );
  }

  /// Usuwa zmiany asocjacji dla wydarzenia.
  /// Używane przy usuwaniu wydarzenia aby zachować spójność historii zmian.
  ///
  /// @param eventId id wydarzenia
  /// @param associationChanges lista zmian do usunięcia
  public void deleteAssociationChanges(
    Integer eventId,
    List<AssociationChangeData> associationChanges
  ) {
    execute(
      eventId,
      new ChangeSets<>(Set.of(), Set.of(), Set.of()),
      new ChangeSets<>(Set.of(), Set.of(), new HashSet<>(associationChanges))
    );
  }

  /// Przetwarza zmiany dla istniejącego wydarzenia.
  /// Proces obejmuje:
  /// 1. Obliczenie rzeczywistych zmian atrybutów (dodane/zmienione/usunięte)
  /// 2. Obliczenie zmian asocjacji (dodane/usunięte)
  /// 3. Wykonanie wszystkich zmian w odpowiedniej kolejności
  ///
  /// @param eventId id wydarzenia
  /// @param existingEvent aktualne wydarzenie ze zmianami
  /// @param newChanges nowy zestaw zmian
  public void processExistingChanges(
    Integer eventId,
    InternalEvent existingEvent,
    EventUpdateRequest newChanges,
    Boolean isStartEvent
  ) {
    ChangeSets<AttributeChangeData> attributeChanges =
      calculateAttributeChanges(
        existingEvent.attributeChanges(),
        newChanges.attributeChanges()
      );

    if (
      isStartEvent &&
      (!attributeChanges.toDelete.isEmpty() ||
        !attributeChanges.toAdd.isEmpty())
    ) throw new ApiException(
      ErrorCode.CANNOT_DELETE_OR_ADD_CHANGE_TO_START_EVENT,
      ErrorGroup.ATTRIBUTE_CHANGE,
      HttpStatus.CONFLICT
    );

    ChangeSets<AssociationChangeData> associationChanges =
      calculateAssociationChanges(
        existingEvent.associationChanges(),
        newChanges.associationChanges()
      );

    execute(eventId, attributeChanges, associationChanges);
  }

  //-------------------------------------------Obliczanie zmian---------------------------------------------------------
  /// Porównuje stany atrybutów i identyfikuje rzeczywiste zmiany.
  /// Wykrywa:
  /// - Nowe atrybuty do dodania
  /// - Zmienione wartości istniejących atrybutów
  /// - Usunięte atrybuty
  private ChangeSets<AttributeChangeData> calculateAttributeChanges(
    List<AttributeChangeData> existingChanges,
    List<AttributeChangeData> newChanges
  ) {
    Map<Integer, AttributeChangeData> existingMap = existingChanges
      .stream()
      .collect(
        Collectors.toMap(AttributeChangeData::attributeId, change -> change)
      );

    Map<Integer, AttributeChangeData> newMap = newChanges
      .stream()
      .collect(
        Collectors.toMap(AttributeChangeData::attributeId, change -> change)
      );

    Set<AttributeChangeData> toDelete = existingMap
      .entrySet()
      .stream()
      .filter(entry -> !newMap.containsKey(entry.getKey()))
      .map(Map.Entry::getValue)
      .collect(Collectors.toSet());

    Set<AttributeChangeData> toAdd = newMap
      .entrySet()
      .stream()
      .filter(entry -> !existingMap.containsKey(entry.getKey()))
      .map(Map.Entry::getValue)
      .collect(Collectors.toSet());

    Set<AttributeChangeData> toUpdate = newMap
      .entrySet()
      .stream()
      .filter(entry -> existingMap.containsKey(entry.getKey()))
      .filter(entry ->
        !Objects.equals(
          existingMap.get(entry.getKey()).value(),
          entry.getValue().value()
        )
      )
      .map(Map.Entry::getValue)
      .collect(Collectors.toSet());

    return new ChangeSets<>(toAdd, toUpdate, toDelete);
  }

  /// Porównuje stany asocjacji i identyfikuje rzeczywiste zmiany.
  /// Wykrywa:
  /// - Nowe asocjacje do dodania
  /// - Asocjacje do usunięcia
  /// Uwaga: Asocjacje nie mają stanu "update" - są albo dodawane albo usuwane
  private ChangeSets<AssociationChangeData> calculateAssociationChanges(
    Collection<AssociationChangeData> existingAssociations,
    Collection<AssociationChangeData> targetAssociations
  ) {
    Map<InternalAssociationKey, AssociationChangeData> existingMap =
      existingAssociations
        .stream()
        .collect(Collectors.toMap(InternalAssociationKey::from, a -> a));

    Map<InternalAssociationKey, AssociationChangeData> targetMap =
      targetAssociations
        .stream()
        .collect(Collectors.toMap(InternalAssociationKey::from, a -> a));

    Set<AssociationChangeData> toDelete = existingMap
      .entrySet()
      .stream()
      .filter(entry -> !targetMap.containsKey(entry.getKey()))
      .map(Map.Entry::getValue)
      .collect(Collectors.toSet());

    Set<AssociationChangeData> toAdd = targetMap
      .entrySet()
      .stream()
      .filter(entry -> !existingMap.containsKey(entry.getKey()))
      .map(Map.Entry::getValue)
      .collect(Collectors.toSet());

    return new ChangeSets<>(toAdd, Set.of(), toDelete);
  }
}
