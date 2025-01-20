/// Pakiet zawierający wyspecjalizowane repozytoria do obsługi złożonych operacji bazodanowych.
///
/// # Główne komponenty
/// - {@link api.database.repository.special.TimeShiftRepository} - zarządzanie przesunięciami czasowymi wydarzeń
/// - {@link api.database.repository.special.ObjectInstanceTransferRepository} - transfer obiektów między wątkami
/// - {@link api.database.repository.special.IdleEventRepository} - operacje na wydarzeniach typu IDLE
///
/// # Charakterystyka repozytorium
/// Repozytoria w tym pakiecie:
/// - Skupiają się na konkretnych, złożonych operacjach biznesowych
/// - Wykorzystują natywne zapytania SQL z CTE dla lepszej wydajności
/// - Działają w kontekście wielu powiązanych encji
/// - Implementują logikę niemieszczącą się w standardowych repozytoriach CRUD
///
/// # Kluczowe operacje
/// - Przesuwanie wydarzeń w czasie z zachowaniem spójności
/// - Transfer obiektów między wątkami z walidacją
/// - Zarządzanie wydarzeniami IDLE i ich czyszczenie
/// - Obsługa niepoprawnych stanów i ich naprawa
///
/// # Powiązane pakiety
/// - {@link api.database.repository} - podstawowe repozytoria CRUD
/// - {@link api.database.entity} - encje wykorzystywane w zapytaniach
/// - {@link api.database.model} - modele danych i projekcje
package api.database.repository.special;
