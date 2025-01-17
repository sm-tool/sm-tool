/// Pakiet zawierający wewnętrzne struktury danych wykorzystywane w operacjach na atrybutach.
/// Definiuje interfejsy projekcyjne JPA służące do zoptymalizowanego pobierania danych
/// o atrybutach i ich zmianach.
///
/// # Projekcje JPA
/// | Interfejs | Opis |
/// |-----------|------|
/// | {@link api.database.model.domain.attribute.InternalAttributeIdWithType} | Podstawowe dane atrybutu (id + typ) używane przy walidacji |
/// | {@link api.database.model.domain.attribute.InternalAttributeWithType} | Rozszerzone dane atrybutu wraz z powiązaniami do szablonu i obiektu |
/// | {@link api.database.model.domain.attribute.InternalLastAttributeChange} | Historia zmian wartości atrybutu w kontekście wydarzeń |
package api.database.model.domain.attribute;
