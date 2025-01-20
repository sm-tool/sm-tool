/// Pakiet zawiera repozytoria do obsługi wydarzeń (Event) w systemie.
/// Implementuje warstwę dostępu do danych dla zdarzeń występujących w wątkach scenariusza,
/// wykorzystując Spring Data JPA i natywne zapytania SQL.
///
/// # Główne komponenty
/// - {@link api.database.repository.event.EventRepository} - zarządzanie wydarzeniami w systemie
///
/// # Kluczowe funkcjonalności
/// - Podstawowe operacje CRUD na wydarzeniach
/// - Zarządzanie specjalnymi typami wydarzeń (START, END, FORK, JOIN, IDLE)
/// - Obsługa wydarzeń w kontekście wątków globalnych i lokalnych
/// - Przenoszenie wydarzeń między wątkami
/// - Zarządzanie zmianami atrybutów i asocjacji w czasie
/// - Zapewnianie spójności sekwencji wydarzeń
///
/// # Powiązane encje
/// - {@link api.database.entity.event.Event} - reprezentacja wydarzenia
/// - {@link api.database.entity.thread.Thread} - wątek zawierający wydarzenia
/// - {@link api.database.entity.thread.Branching} - rozgałęzienia FORK/JOIN
/// - {@link api.database.entity.scenario.Scenario} - scenariusz grupujący wydarzenia
///
/// # Ważne aspekty implementacyjne
/// - Wykorzystanie natywnych zapytań SQL dla złożonych operacji
/// - Specjalna obsługa wątku globalnego (ID=0 w API)
/// - Automatyczne zarządzanie wydarzeniami END
/// - Konwersja pustych wydarzeń na typ IDLE
/// - Kaskadowe usuwanie powiązanych zmian
package api.database.repository.event;
