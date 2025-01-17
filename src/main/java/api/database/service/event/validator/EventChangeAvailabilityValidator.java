package api.database.service.event.validator;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.AssociationChangeData;
import api.database.model.data.AttributeChangeData;
import api.database.model.domain.object.InternalObjectInstanceAttributes;
import api.database.model.exception.ApiException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Weryfikuje możliwość wykonania zmian w kontekście dostępności obiektów na danym wątku.
/// Sprawdza, czy:
/// - wszystkie obiekty użyte w asocjacjach są dostępne na wątku
/// - wszystkie atrybuty, które mają być zmienione, należą do dostępnych obiektów
@Component
public class EventChangeAvailabilityValidator {

  /// Weryfikuje możliwość wykonania zmian w kontekście dostępności obiektów na danym wątku.
  /// Sprawdza, czy:
  /// - wszystkie obiekty użyte w asocjacjach są dostępne na wątku
  /// - wszystkie atrybuty, które mają być zmienione, należą do dostępnych obiektów
  ///
  /// @throws ApiException gdy próba użycia niedostępnych obiektów lub atrybutów
  public void validateChangesAvailability(
    List<InternalObjectInstanceAttributes> availableObjects,
    List<AssociationChangeData> associations,
    List<AttributeChangeData> attributes,
    boolean isGlobal
  ) {
    validateObjectsInAssociations(availableObjects, associations, isGlobal);
    validateAttributes(availableObjects, attributes);
  }

  private void validateObjectsInAssociations(
    List<InternalObjectInstanceAttributes> availableObjects,
    List<AssociationChangeData> associations,
    boolean isGlobal
  ) {
    Map<Integer, Integer> objectToOriginThread = availableObjects
      .stream()
      .collect(
        Collectors.toMap(
          InternalObjectInstanceAttributes::getId,
          InternalObjectInstanceAttributes::getOriginThreadId
        )
      );

    // Sprawdzenie dostępności obiektów
    Set<String> invalidObjectIds = associations
      .stream()
      .flatMap(assoc -> Stream.of(assoc.object1Id(), assoc.object2Id()))
      .filter(id -> !objectToOriginThread.containsKey(id))
      .distinct()
      .map(Object::toString)
      .collect(Collectors.toSet());

    if (!invalidObjectIds.isEmpty()) {
      throw new ApiException(
        ErrorCode.CANNOT_USE_OBJECTS_IN_THREAD,
        invalidObjectIds.stream().toList(),
        ErrorGroup.ASSOCIATION_CHANGE,
        HttpStatus.BAD_REQUEST
      );
    }
    if (isGlobal) return;
    // Sprawdzenie asocjacji między obiektami globalnymi
    boolean hasGlobalObjectsPair = associations
      .stream()
      .anyMatch(
        assoc ->
          objectToOriginThread.get(assoc.object1Id()) == 0 &&
          objectToOriginThread.get(assoc.object2Id()) == 0
      );

    if (hasGlobalObjectsPair) {
      throw new ApiException(
        ErrorCode.CANNOT_CREATE_ASSOCIATION_BETWEEN_GLOBAL_OBJECTS_IN_NOT_GLOBAL_THREAD,
        ErrorGroup.ASSOCIATION_CHANGE,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private void validateAttributes(
    List<InternalObjectInstanceAttributes> availableObjects,
    List<AttributeChangeData> attributes
  ) {
    Set<Integer> availableAttributeIds = availableObjects
      .stream()
      .flatMap(obj -> obj.getAttributes().stream())
      .collect(Collectors.toSet());

    Set<String> invalidAttributeIds = attributes
      .stream()
      .map(AttributeChangeData::attributeId)
      .filter(id -> !availableAttributeIds.contains(id))
      .map(Object::toString)
      .collect(Collectors.toSet());

    if (!invalidAttributeIds.isEmpty()) {
      throw new ApiException(
        ErrorCode.CANNOT_USE_ATTRIBUTES_IN_THREAD,
        invalidAttributeIds.stream().toList(),
        ErrorGroup.EVENT,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
