package api.database.model.domain.attribute;

import api.database.model.constant.AttributeType;

/// Interfejs reprezentujący wewnętrzną strukturę łączącą identyfikator atrybutu z jego typem.
/// Używany głównie w operacjach walidacji wartości atrybutów, gdzie wymagany jest dostęp
/// zarówno do id jak i typu atrybutu.
///
/// # Metody
/// - `getId()` - identyfikator atrybutu
/// - `getType()` - typ atrybutu określający format i zasady walidacji wartości
///
/// # Powiązania
/// - {@link AttributeType} - typy atrybutów obsługiwane przez system
public interface InternalAttributeIdWithType {
  Integer getId();
  AttributeType getType();
}
