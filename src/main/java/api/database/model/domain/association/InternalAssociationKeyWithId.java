package api.database.model.domain.association;

/// Projekcja JPA łącząca klucz identyfikujący asocjację (typ + powiązane obiekty)
/// z identyfikatorem encji asocjacji. Używana podczas operacji na istniejących
/// asocjacjach w systemie.
public interface InternalAssociationKeyWithId {
  /// @return identyfikator typu asocjacji
  Integer getAssociationTypeId();
  /// @return identyfikator pierwszego obiektu
  Integer getObject1Id();
  /// @return identyfikator drugiego obiektu
  Integer getObject2Id();
  /// @return identyfikator encji asocjacji
  Integer getAssociationId();
}
