package api.database.service.core.validator;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.object.ObjectTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ObjectTypeValidator {

  private final ObjectTypeRepository objectTypeRepository;

  @Autowired
  public ObjectTypeValidator(ObjectTypeRepository objectTypeRepository) {
    this.objectTypeRepository = objectTypeRepository;
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
}
