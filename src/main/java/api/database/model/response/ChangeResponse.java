package api.database.model.response;

import api.database.entity.object.AttributeChange;
import api.database.model.domain.association.InternalEventAssociationChange;
import api.database.model.domain.association.InternalLastAssociationChange;
import api.database.model.domain.attribute.InternalLastAttributeChange;

/// Reprezentuje zmianę wartości w systemie, przechowując stan przed i po modyfikacji.
/// Używany zarówno dla zmian atrybutów jak i asocjacji.
///
/// # Przechowuje
/// - Poprzednią wartość (null dla nowych elementów)
/// - Nową wartość
///
/// # Tworzenie
/// Dostarcza dwie metody statyczne do tworzenia odpowiedzi:
/// - fromAssociation() - dla zmian asocjacji
/// - fromAttribute() - dla zmian atrybutów
///
/// # Przykład użycia
/// ```java
/// // Dla asocjacji
/// ChangeResponse response = ChangeResponse.fromAssociation(
///     currentAssociation,
///     lastAssociation
/// );
///
/// // Dla atrybutów
/// ChangeResponse response = ChangeResponse.fromAttribute(
///     currentAttribute,
///     lastAttribute
/// );
/// ```
///
/// # Struktura rekordu
/// @param from poprzednia wartość (może być null)
/// @param to nowa wartość
public record ChangeResponse(String from, String to) {
  public static ChangeResponse fromAssociation(
    InternalEventAssociationChange current,
    InternalLastAssociationChange last
  ) {
    return new ChangeResponse(
      last != null ? String.valueOf(last.getAssociationOperation()) : null,
      current.getAssociationOperation().toString()
    );
  }

  public static ChangeResponse fromAttribute(
    AttributeChange current,
    InternalLastAttributeChange last
  ) {
    return new ChangeResponse(
      last != null ? last.getValue() : null,
      current.getValue()
    );
  }
}
