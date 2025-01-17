package api.database.model.domain.association;

import api.database.model.constant.AssociationOperation;

/// Projekcja JPA reprezentująca ostatnią zmianę asocjacji w historii.
/// Zawiera informacje o typie asocjacji, powiązanych obiektach, rodzaju
/// operacji oraz wydarzeniu docelowym, w którym zmiana wystąpiła.
public interface InternalLastAssociationChange {
  /// @return identyfikator typu asocjacji
  Integer getAssociationTypeId();
  /// @return identyfikator pierwszego obiektu
  Integer getObject1Id();
  /// @return identyfikator drugiego obiektu
  Integer getObject2Id();
  /// @return rodzaj operacji na asocjacji (INSERT/DELETE)
  AssociationOperation getAssociationOperation();
  /// @return identyfikator wydarzenia docelowego
  Integer getTargetEventId();
}
