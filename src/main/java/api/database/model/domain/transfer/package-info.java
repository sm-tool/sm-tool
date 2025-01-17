/// Pakiet zawierający wewnętrzne modele domenowe związane z transferem obiektów
/// między wątkami oraz analizą operacji na obiektach w kontekście rozgałęzień.
///
/// # Projekcje JPA
/// | Interfejs | Opis |
/// |-----------|------|
/// | {@link api.database.model.domain.transfer.InternalObjectIdWIthThread} | Para obiekt-wątek |
///
/// # Struktury danych
/// | Rekord | Opis |
/// |--------|------|
/// | {@link api.database.model.domain.transfer.InternalBranchingTransfer} | Transfer obiektów w rozgałęzieniu |
/// | {@link api.database.model.domain.transfer.InternalThreadObjects} | Podział obiektów na globalne i lokalne |
/// | {@link api.database.model.domain.transfer.InternalObjectThreadPair} | Para identyfikatorów obiekt-wątek |
/// | {@link api.database.model.domain.transfer.InternalTransferPairs} | Pary do dodania/usunięcia przy transferze |
///
/// # Analiza operacji
/// | Rekord | Opis |
/// |--------|------|
/// | {@link api.database.model.domain.transfer.InternalAddAnalysisResult} | Analiza dodawania obiektu |
/// | {@link api.database.model.domain.transfer.InternalRemoveAnalysisResult} | Analiza usuwania obiektu |
///
/// # Zastosowanie
/// - Analiza i wykonywanie transferów obiektów między wątkami
/// - Walidacja operacji w kontekście rozgałęzień (FORK/JOIN)
/// - Śledzenie przynależności obiektów do wątków
/// - Zarządzanie konfliktami przy przenoszeniu obiektów
package api.database.model.domain.transfer;
