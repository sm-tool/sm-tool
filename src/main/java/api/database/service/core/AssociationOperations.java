package api.database.service.core;

import api.database.model.association.QdsInfoAssociationLastChange;
import api.database.repository.association.QdsAssociationChangeRepository;
import api.database.repository.association.QdsAssociationRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Dostarcza podstawowe operacje na asocjacjach i ich zmianach.
/// Skupia się na operacjach czyszczenia nieużywanych asocjacji
/// oraz pobieraniu historycznych zmian.
@Component
public class AssociationOperations {

  private final QdsAssociationRepository qdsAssociationRepository;
  private final QdsAssociationChangeRepository qdsAssociationChangeRepository;

  @Autowired
  public AssociationOperations(
    QdsAssociationRepository qdsAssociationRepository,
    QdsAssociationChangeRepository qdsAssociationChangeRepository
  ) {
    this.qdsAssociationRepository = qdsAssociationRepository;
    this.qdsAssociationChangeRepository = qdsAssociationChangeRepository;
  }

  /// Usuwa asocjacje, które nie są już używane po usunięciu zmian asocjacji.
  /// Wykonuje czyszczenie "osieroconych" rekordów.
  ///
  /// @apiNote Operacja wykonywana w ramach transakcji nadrzędnej
  public void deleteNotUsedAssociations() {
    qdsAssociationRepository.deleteEmptyAssociations();
  }

  /// Pobiera ostatnie zmiany asocjacji dla wskazanych obiektów,
  /// które nastąpiły przed określonym czasem.
  ///
  /// @param objectIds lista identyfikatorów obiektów
  /// @param eventTime punkt w czasie, przed którym szukamy zmian
  /// @return lista ostatnich zmian asocjacji dla obiektów
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public List<QdsInfoAssociationLastChange> getLastAssociationChanges(
    List<Integer> objectIds,
    Integer eventTime
  ) {
    return qdsAssociationChangeRepository.getLastAssociationChanges(
      objectIds,
      eventTime
    );
  }
}
