package api.database.model.domain.association;

import api.database.model.constant.AssociationOperation;

/// Projekcja JPA reprezentująca ostatnią operację wykonaną na asocjacji.
/// Łączy identyfikator asocjacji z typem ostatniej wykonanej na niej
/// operacji (dodanie lub usunięcie).
public interface InternalLastAssociationOperation {
  /// @return identyfikator asocjacji
  Integer getAssociationId();
  /// @return rodzaj operacji (INSERT/DELETE)
  AssociationOperation getAssociationOperation();
}
