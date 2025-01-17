package api.database.model.response;

/// Projekcja JPA reprezentująca stan atrybutów w kontekście wydarzenia.
/// Używana do bezpośredniego mapowania wyników zapytań o aktualny stan atrybutów,
/// zawierając ich identyfikatory oraz wartości.
///
/// @apiNote To jest interfejs projekcji JPA, implementowany automatycznie przez Hibernate
/// podczas mapowania wyników zapytań. Nie należy tworzyć własnych implementacji.
public interface EventAttributesStateResponse {
  /// @return identyfikator atrybutu
  Integer getAttributeId();
  /// @return wartość atrybutu
  String getValue();
}
