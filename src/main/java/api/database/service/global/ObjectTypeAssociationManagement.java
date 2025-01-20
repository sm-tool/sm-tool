package api.database.service.global;

import api.database.entity.association.Association;
import api.database.entity.association.AssociationType;
import api.database.entity.object.ObjectInstance;
import api.database.repository.association.AssociationRepository;
import api.database.service.core.ObjectTypeManager;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ObjectTypeAssociationManagement {

  private final AssociationRepository associationRepository;
  private final ObjectTypeManager objectTypeManager;

  public ObjectTypeAssociationManagement(
    AssociationRepository associationRepository,
    ObjectTypeManager objectTypeManager
  ) {
    this.associationRepository = associationRepository;
    this.objectTypeManager = objectTypeManager;
  }

  public void checkAssociationsAndDeleteIfInvalid(Integer objectTypeId) {
    List<Association> associations =
      associationRepository.findAssociationsByObjectTypeId(objectTypeId);

    List<Integer> associationsToDelete = associations
      .stream()
      .filter(association -> {
        AssociationType associationType = association.getAssociationType();
        ObjectInstance object1 = association.getObject1();
        ObjectInstance object2 = association.getObject2();

        boolean isFirstTypeValid = objectTypeManager.checkIfTypesAreInHierarchy(
          associationType.getFirstObjectTypeId(),
          object1.getObjectTypeId()
        );
        boolean isSecondTypeValid =
          objectTypeManager.checkIfTypesAreInHierarchy(
            associationType.getSecondObjectTypeId(),
            object2.getObjectTypeId()
          );

        return !isFirstTypeValid || !isSecondTypeValid;
      })
      .map(Association::getId)
      .toList();

    associationRepository.deleteAllById(associationsToDelete);
  }
}
