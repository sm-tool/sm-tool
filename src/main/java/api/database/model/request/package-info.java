/// Pakiet ten zawiera rekordy reprezentujące żądania przychodzące do API.
///
/// # Struktura pakietu
/// ## Podpakiety
/// - {@link api.database.model.request.create} - rekordy do tworzenia encji
/// - {@link api.database.model.request.update} - rekordy do aktualizacji encji
/// - {@link api.database.model.request.save} - rekordy do zapisu encji
/// - {@link api.database.model.request.composite} - złożone rekordy żądań
///
/// # Zasady projektowania
/// - Używanie rekordów Java do reprezentacji danych
/// - Walidacja danych przez adnotacje Bean Validation
/// - Minimalna liczba wymaganych pól
/// - Jasne, opisowe nazwy
///
/// # Główne cele
/// - Walidacja danych wejściowych
/// - Mapowanie żądań klienta na operacje w systemie
/// - Zapewnienie spójności danych przed przetworzeniem
package api.database.model.request;
