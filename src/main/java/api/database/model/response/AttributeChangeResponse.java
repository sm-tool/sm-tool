package api.database.model.response;

import api.database.entity.object.AttributeChange;
import api.database.model.domain.attribute.InternalLastAttributeChange;

/// Reprezentuje zmianę wartości atrybutu obiektu w kontekście wydarzenia.
/// Używany w odpowiedziach API do prezentacji historii zmian atrybutów.
///
/// # Tworzenie
/// Dostarcza metodę statyczną create() do tworzenia odpowiedzi na podstawie:
/// - Aktualnej zmiany (AttributeChange)
/// - Poprzedniej zmiany (InternalLastAttributeChange)
///
/// # Przykład użycia
/// ```java
/// AttributeChangeResponse response = AttributeChangeResponse.create(
///     currentChange,
///     lastChange
/// );
/// ```
///
/// # Struktura rekordu
/// @param  attributeId identyfikator zmienionego atrybutu
/// @param changeType informacje o zmianie (poprzednia i nowa wartość)
///
public record AttributeChangeResponse(
  Integer attributeId,
  ChangeResponse changeType
) {
  public static AttributeChangeResponse create(
    AttributeChange current,
    InternalLastAttributeChange last
  ) {
    return new AttributeChangeResponse(
      current.getAttributeId(),
      ChangeResponse.fromAttribute(current, last)
    );
  }
}
