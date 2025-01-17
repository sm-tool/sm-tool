/// Pakiet zawierający wewnętrzne modele domenowe związane z wątkami oraz ich rozgałęzieniami.
///
/// # Projekcje JPA
/// | Interfejs | Opis |
/// |-----------|------|
/// | {@link api.database.model.domain.thread.InternalBranchingRow} | Dane rozgałęzienia (FORK/JOIN) |
/// | {@link api.database.model.domain.thread.InternalThreadBatch} | Powiązane wątki i ich rozgałęzienia |
///
/// # Modele procesów
/// | Rekord | Opis |
/// |--------|------|
/// | {@link api.database.model.domain.thread.InternalThreadRemovalAnalysis} | Analiza usuwania wątku |
/// | {@link api.database.model.domain.thread.InternalTimeShiftAnalysis} | Analiza przesunięcia czasowego |
///
/// # Modele pomocnicze
/// | Rekord | Opis |
/// |--------|------|
/// | {@link api.database.model.domain.thread.InternalBranchedThreadCreate} | Dane nowego rozgałęzionego wątku |
/// | {@link api.database.model.domain.thread.InternalThreadBasicInfo} | Podstawowe informacje o wątku |
///
/// # Główne operacje
/// - Zarządzanie rozgałęzieniami (FORK/JOIN)
/// - Przesunięcia czasowe wydarzeń
/// - Usuwanie wątków i ich powiązań
package api.database.model.domain.thread;
