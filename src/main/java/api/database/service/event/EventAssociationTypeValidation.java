package api.database.service.event;

import api.database.model.association.QdsInfoAssociationObjectTypes;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.service.core.ObjectTypeOperations;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class EventAssociationTypeValidation {

  private final ObjectTypeOperations objectTypeOperations;

  public EventAssociationTypeValidation(
    ObjectTypeOperations objectTypeOperations
  ) {
    this.objectTypeOperations = objectTypeOperations;
  }

  public void checkTypeCompatibility(
    Integer object1Id,
    Integer object2Id,
    Integer associationTypeId
  ) {
    Map<Integer, Integer> objectTypes = objectTypeOperations.getObjectsTypes(
      new ArrayList<>(List.of(object1Id, object2Id))
    );
    QdsInfoAssociationObjectTypes associationObjectTypes =
      objectTypeOperations.getObjectTypesFromAssociationType(associationTypeId);
    if (
      !objectTypeOperations.checkIfTypesAreInHierarchy(
        objectTypes.get(object1Id),
        associationObjectTypes.getFirstObjectTypeId()
      ) ||
      !objectTypeOperations.checkIfTypesAreInHierarchy(
        objectTypes.get(object2Id),
        associationObjectTypes.getSecondObjectTypeId()
      )
    ) throw new ApiException(
      ErrorCode.INCOMPATIBLE_TYPES,
      ErrorGroup.ASSOCIATION_TYPE,
      HttpStatus.BAD_REQUEST
    );
  }
}
