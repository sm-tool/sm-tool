package api.database.model.domain.association;

import api.database.model.constant.AssociationOperation;

/// Projekcja JPA reprezentująca zmianę asocjacji w kontekście wydarzenia.
/// Zawiera informacje o typie asocjacji, powiązanych obiektach oraz rodzaju
/// operacji (dodanie/usunięcie) wykonanej w danym wydarzeniu.
public interface InternalEventAssociationChange {
  /// @return identyfikator typu asocjacji
  Integer getAssociationTypeId();
  /// @return identyfikator pierwszego obiektu
  Integer getObject1Id();
  /// @return identyfikator drugiego obiektu
  Integer getObject2Id();
  /// @return identyfikator wydarzenia
  Integer getEventId();
  /// @return rodzaj operacji na asocjacji (INSERT/DELETE)
  AssociationOperation getAssociationOperation();
}
