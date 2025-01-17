package api.database.model.response;

import api.database.model.constant.AttributeType;
import api.database.model.domain.attribute.InternalAttributeWithType;

/// Reprezentuje atrybuty obiektu w kontekście odpowiedzi API.
/// Zawiera podstawowe informacje o atrybucie niezbędne dla klienta.
///
/// # Przechowuje
/// - Identyfikator atrybutu
/// - Identyfikator szablonu atrybutu
/// - Typ atrybutu (INT, STRING, DATE, BOOL)
///
/// # Tworzenie
/// Dostarcza metodę statyczną from() mapującą wewnętrzną reprezentację
/// atrybutu ({@link InternalAttributeWithType}) na odpowiedź API.
///
/// # Przykład użycia
/// ```java
/// AttributeResponse response = AttributeResponse.from(internalAttribute);
/// ```
///
/// # Struktura rekordu
/// @param id identyfikator atrybutu
/// @param attributeTemplateId identyfikator szablonu atrybutu
/// @param type typ danych atrybutu
public record AttributeResponse(
  Integer id,
  Integer attributeTemplateId,
  AttributeType type
) {
  public static AttributeResponse from(InternalAttributeWithType attribute) {
    return new AttributeResponse(
      attribute.getId(),
      attribute.getAttributeTemplateId(),
      attribute.getType()
    );
  }
}
