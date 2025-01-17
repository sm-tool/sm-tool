/// Pakiet zawierający wewnętrzne modele domenowe związane z wydarzeniami w systemie.
/// Skupia się na strukturach danych używanych podczas zarządzania wydarzeniami,
/// ich walidacji i modyfikacji.
///
/// # Główne komponenty
/// | Klasa | Zastosowanie |
/// |-------|--------------|
/// | {@link api.database.model.domain.event.InternalEvent} | Pełna reprezentacja wydarzenia z jego zmianami |
/// | {@link api.database.model.domain.event.InternalSpecialEvent} | Dane do tworzenia wydarzeń specjalnych |
/// | {@link api.database.model.domain.event.InternalLastEventModification} | Modyfikacja ostatniego wydarzenia w wątku |
/// | {@link api.database.model.domain.event.InternalValidationEvent} | Walidacja zmian w wydarzeniu |
///
/// # Charakterystyka
/// - Wszystkie klasy są immutable (rekordy)
/// - Używane w warstwie serwisowej
/// - Zawierają metody fabryczne do konwersji z/na inne reprezentacje
/// - Skupiają się na wewnętrznej logice biznesowej
///
/// # Zastosowanie
/// - Walidacja zmian w wydarzeniach
/// - Zarządzanie wydarzeniami specjalnymi (START, END, FORK, JOIN)
/// - Śledzenie modyfikacji atrybutów i asocjacji
/// - Obsługa rozgałęzień wątków
package api.database.model.domain.event;
