package api.database.service.core;

import api.database.model.association.QdsInfoAssociationObjectTypes;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.object.QdsObjectTypeRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Zarządza operacjami na typach obiektów.
/// Odpowiada za:
/// - Obsługę hierarchii typów
/// - Walidację typów globalnych
/// - Pobieranie informacji o typach szablonów
@Component
public class ObjectTypeOperations {

  private final QdsObjectTypeRepository objectTypeRepository;

  public ObjectTypeOperations(QdsObjectTypeRepository objectTypeRepository) {
    this.objectTypeRepository = objectTypeRepository;
  }

  /// Pobiera listę wszystkich przodków dla danego typu obiektu.
  ///
  /// @param objectTypeId identyfikator typu obiektu
  /// @return lista identyfikatorów przodków
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public List<Integer> getTypeAncestors(Integer objectTypeId) {
    return objectTypeRepository.getAllAncestors(objectTypeId);
  }

  //TODO sprawdzić
  /// Weryfikuje czy typ obiektu może być użyty w kontekście globalności.
  /// Sprawdza czy nie próbujemy użyć typu wyłącznie globalnego
  /// dla obiektu nie-globalnego.
  ///
  /// @param objectTypeId identyfikator typu
  /// @param isGlobalObject czy obiekt jest globalny
  /// @throws ApiException gdy próba użycia globalnego typu dla nie-globalnego obiektu
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public void checkForGlobalObjectType(
    Integer objectTypeId,
    Boolean isGlobalObject
  ) {
    //Weryfikacja globalnego typu dla nieglobalnego obiektu
    if (
      objectTypeRepository.checkOnlyGlobal(objectTypeId) && !isGlobalObject
    ) throw new ApiException(
      ErrorCode.TRIED_TO_ADD_GLOBAL_TYPE_TO_NOT_GLOBAL_OBJECT,
      ErrorGroup.OBJECT,
      HttpStatus.BAD_REQUEST
    );
  }

  /// Sprawdza relację hierarchiczną między dwoma typami.
  ///
  /// @param ancestor potencjalny przodek w hierarchii
  /// @param descendant potencjalny potomek w hierarchii
  /// @return true jeśli descendant jest potomkiem ancestor
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public Boolean checkIfTypesAreInHierarchy(
    Integer ancestor,
    Integer descendant
  ) {
    return objectTypeRepository.isInHierarchy(descendant, ancestor);
  }

  /// Pobiera typ dla wskazanego szablonu obiektu.
  ///
  /// @param templateId identyfikator szablonu
  /// @return identyfikator typu szablonu
  public Integer getTemplateType(Integer templateId) {
    return objectTypeRepository.getTemplateType(templateId);
  }

  public Map<Integer, Integer> getObjectsTypes(ArrayList<Integer> objectIds) {
    objectIds.sort(Integer::compareTo);
    List<Integer> typesIds = objectTypeRepository.getObjectsTypes(objectIds);
    return IntStream.range(0, objectIds.size())
      .boxed()
      .collect(Collectors.toMap(objectIds::get, typesIds::get));
  }

  public QdsInfoAssociationObjectTypes getObjectTypesFromAssociationType(
    Integer associationTypeId
  ) {
    return objectTypeRepository.getObjectTypesFromAssociationType(
      associationTypeId
    );
  }
}
