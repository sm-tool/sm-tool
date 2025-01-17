/// Pakiet zawierający wewnętrzne reprezentacje obiektów w systemie w formie projekcji JPA.
/// Dostarcza zoptymalizowane widoki danych obiektów używane w różnych kontekstach
/// operacyjnych.
///
/// # Projekcje
/// | Interfejs | Zastosowanie |
/// |-----------|--------------|
/// | {@link api.database.model.domain.object.InternalObjectInstanceType} | Podstawowa identyfikacja obiektu i jego typu |
/// | {@link api.database.model.domain.object.InternalObjectInstance} | Pełne dane instancji obiektu |
/// | {@link api.database.model.domain.object.InternalObjectInstanceAttributes} | Obiekt z listą jego atrybutów |
///
/// # Charakterystyka
/// - Wszystkie interfejsy to projekcje JPA
/// - Zoptymalizowane pod kątem konkretnych przypadków użycia
/// - Zwracają tylko niezbędne dane
/// - Używane głównie w warstwie serwisowej
///
/// # Zastosowanie
/// - Walidacja typów obiektów
/// - Operacje na atrybutach
/// - Weryfikacja dostępności obiektów w wątkach
/// - Optymalizacja zapytań do bazy danych
package api.database.model.domain.object;
