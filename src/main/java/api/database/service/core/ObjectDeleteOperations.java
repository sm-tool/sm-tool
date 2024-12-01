package api.database.service.core;

import api.database.repository.association.QdsAssociationChangeRepository;
import api.database.repository.attribute.QdsAttributeChangeRepository;
import api.database.repository.object.QdsObjectRepository;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ObjectDeleteOperations {

  private final QdsAssociationChangeRepository associationChangeRepository;
  private final QdsAttributeChangeRepository attributeChangeRepository;
  private final AssociationOperations associationOperations;
  private final QdsObjectRepository qdsObjectRepository;

  public ObjectDeleteOperations(
    QdsAssociationChangeRepository associationChangeRepository,
    QdsAttributeChangeRepository attributeChangeRepository,
    AssociationOperations associationOperations,
    QdsObjectRepository qdsObjectRepository
  ) {
    this.associationChangeRepository = associationChangeRepository;
    this.attributeChangeRepository = attributeChangeRepository;
    this.associationOperations = associationOperations;
    this.qdsObjectRepository = qdsObjectRepository;
  }

  /// Usuwa zmiany atrybutów dla obiektów po wskazanym czasie.
  ///
  /// @param time czas graniczny
  /// @param objects lista usuniętych obiektów
  public void deleteAttributeChangesAfterTime(
    Integer time,
    List<Integer> objects
  ) {
    attributeChangeRepository.deleteAttributeChangesTimeAndObjectIds(
      time,
      objects.toArray(new Integer[0])
    );
  }

  /// Usuwa zmiany asocjacji dla obiektów po wskazanym czasie.
  ///
  /// @param time czas graniczny
  /// @param objects lista usuniętych obiektów
  public void deleteAssociationChangesAfterTime(
    Integer time,
    List<Integer> objects
  ) {
    associationChangeRepository.deleteAssociationChangesByTimeAndObjectIds(
      time,
      objects.toArray(new Integer[0])
    );
    associationOperations.deleteNotUsedAssociations();
  }

  public void deleteObjectConnectionsToThreadsAfterTime(
    Integer time,
    List<Integer> objectIds
  ) {
    qdsObjectRepository.deleteObjectConnectionsToThreadsAfterTime(
      time,
      objectIds
    );
  }

  public void deleteObjectInformationAfterTime(
    Integer time,
    List<Integer> objectIds
  ) {
    deleteObjectConnectionsToThreadsAfterTime(time, objectIds);
    deleteAssociationChangesAfterTime(time, objectIds);
    deleteAttributeChangesAfterTime(time, objectIds);
  }
}
