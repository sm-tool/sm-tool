package api.database.model.domain.association;

/// Projekcja JPA zwracająca identyfikator asocjacji wraz z typami powiązanych obiektów.
/// Używana wewnętrznie podczas walidacji powiązań między obiektami.
public interface InternalAssociationIdWithObjectTypes {
  /// @return identyfikator asocjacji
  Integer getId();
  /// @return identyfikator typu pierwszego obiektu
  Integer getFirstObjectTypeId();
  /// @return identyfikator typu drugiego obiektu
  Integer getSecondObjectTypeId();
}
