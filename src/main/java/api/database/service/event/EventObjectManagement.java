package api.database.service.event;

import api.database.model.internal.association.QdsInternalAssociationChangeEvent;
import api.database.repository.association.QdsAssociationChangeRepository;
import api.database.repository.attribute.QdsAttributeChangeRepository;
import java.util.List;
import org.springframework.stereotype.Component;

/// Zarządza zmianami obiektów w kontekście eventów.
/// Odpowiada za usuwanie zmian atrybutów i asocjacji
/// dla obiektów w określonych punktach czasowych.
@Component
public class EventObjectManagement {

  private final QdsAttributeChangeRepository qdsAttributeChangeRepository;
  private final QdsAssociationChangeRepository qdsAssociationChangeRepository;

  public EventObjectManagement(
    QdsAttributeChangeRepository qdsAttributeChangeRepository,
    QdsAssociationChangeRepository qdsAssociationChangeRepository
  ) {
    this.qdsAttributeChangeRepository = qdsAttributeChangeRepository;
    this.qdsAssociationChangeRepository = qdsAssociationChangeRepository;
  }

  /// Usuwa zmiany atrybutów dla wskazanych obiektów w określonym czasie.
  ///
  /// @param time czas graniczny dla usuwanych zmian
  /// @param objects lista identyfikatorów obiektów
  public void deleteAttributeChanges(Integer time, List<Integer> objects) {
    qdsAttributeChangeRepository.deleteAttributeChangesInTimeByObjectIds(
      time,
      objects.toArray(new Integer[0])
    );
  }

  /// Usuwa zmiany asocjacji dla wskazanych par obiektów w kontekście wątku.
  ///
  /// @param threadId identyfikator wątku
  /// @param associationsToDelete lista zmian asocjacji do usunięcia
  public void deleteAssociationChanges(
    Integer threadId,
    List<QdsInternalAssociationChangeEvent> associationsToDelete
  ) {
    qdsAssociationChangeRepository.deleteAssociationChangesInTimeByObjectIds(
      threadId,
      associationsToDelete
        .stream()
        .map(QdsInternalAssociationChangeEvent::object1Id)
        .toArray(Integer[]::new),
      associationsToDelete
        .stream()
        .map(QdsInternalAssociationChangeEvent::object2Id)
        .toArray(Integer[]::new)
    );
  }
}
