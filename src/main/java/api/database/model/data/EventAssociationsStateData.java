package api.database.model.data;

import api.database.model.constant.AssociationOperation;

/// Projekcja JPA reprezentująca stan asocjacji w kontekście wydarzenia.
/// Używana do bezpośredniego mapowania wyników zapytań o stan asocjacji,
/// agregując identyfikatory obiektów, typ asocjacji oraz rodzaj operacji.
///
/// @apiNote To jest interfejs projekcji JPA, implementowany automatycznie przez Hibernate
/// podczas mapowania wyników zapytań. Nie należy tworzyć własnych implementacji.
public interface EventAssociationsStateData {
  /// @return identyfikator typu asocjacji
  Integer getAssociationTypeId();
  /// @return identyfikator pierwszego obiektu w asocjacji
  Integer getObject1Id();
  /// @return identyfikator drugiego obiektu w asocjacji
  Integer getObject2Id();
  /// @return rodzaj operacji wykonanej na asocjacji (INSERT/DELETE)
  AssociationOperation getAssociationOperation();
}
