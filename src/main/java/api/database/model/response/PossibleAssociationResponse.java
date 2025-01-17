package api.database.model.response;

/// Projekcja JPA zwracająca podstawowe informacje o możliwych asocjacjach między obiektami.
/// Używana przy walidacji i podpowiedziach podczas tworzenia nowych powiązań.
public interface PossibleAssociationResponse {
  Integer getAssociationTypeId();
  Integer getObjectId();
}
