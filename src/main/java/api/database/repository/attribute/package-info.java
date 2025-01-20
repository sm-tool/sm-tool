/// Pakiet zawiera repozytoria do zarządzania atrybutami obiektów w systemie, implementując
/// warstwę dostępu do danych z wykorzystaniem Spring Data JPA i natywnych zapytań SQL.
///
/// ## Główne komponenty
/// - {@link AttributeRepository} - podstawowe operacje na atrybutach obiektów
/// - {@link AttributeTemplateRepository} - zarządzanie szablonami atrybutów
/// - {@link AttributeChangeRepository} - śledzenie historii zmian wartości atrybutów
///
/// ## Kluczowe funkcjonalności
/// - Zarządzanie pełnym cyklem życia atrybutów
/// - Obsługa szablonów definiujących strukturę atrybutów
/// - Śledzenie historii zmian w kontekście wydarzeń
/// - Optymalizacja zapytań poprzez natywny SQL
/// - Walidacja spójności danych atrybutów
///
/// ## Powiązane encje
/// - {@link api.database.entity.object.Attribute} - reprezentacja atrybutu obiektu
/// - {@link api.database.entity.object.AttributeTemplate} - definicja szablonu atrybutu
/// - {@link api.database.entity.object.AttributeChange} - zmiana wartości atrybutu
///
/// ## Ważne aspekty implementacyjne
/// - Wykorzystanie natywnych zapytań SQL dla złożonych operacji
/// - Obsługa kaskadowego usuwania powiązanych rekordów
/// - Zarządzanie stanem atrybutów w kontekście wątków
/// - Optymalizacja wydajności poprzez indeksy i złączenia
///
package api.database.repository.attribute;
