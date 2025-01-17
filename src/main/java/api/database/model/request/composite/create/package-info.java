/// Pakiet zawierający struktury danych dla operacji tworzenia złożonych elementów w systemie.
///
/// # Struktury
/// - {@link api.database.model.request.composite.create.ForkCreateRequest} - tworzenie rozgałęzienia FORK wraz z wątkami potomnymi
/// - {@link api.database.model.request.composite.create.JoinCreateRequest} - tworzenie rozgałęzienia JOIN i wątku wynikowego
/// - {@link api.database.model.request.composite.create.ThreadCreateRequest} - tworzenie nowego wątku z wydarzeniami START/END
///
/// # Charakterystyka
/// - Zawierają wszystkie dane wymagane do utworzenia nowego elementu
/// - Zapewniają spójność danych między powiązanymi elementami
/// - Używane w operacjach wymagających koordynacji wielu encji
package api.database.model.request.composite.create;
