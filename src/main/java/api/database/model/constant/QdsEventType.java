package api.database.model.constant;

/// QdsEventType
///
/// Definiuje typy wydarzeń występujących w wątkach scenariusza.
///
/// # Podstawowe typy
/// - GLOBAL - Wydarzenie w wątku globalnym (nadpisuje zmiany w normalnych wydarzeniach)
/// - NORMAL - Standardowe wydarzenie w wątku
///
/// # Typy kontrolne
/// - START - Początek wątku
/// - END - Koniec wątku
/// - IDLE - Wydarzenie puste
///
/// # Typy związane z rozgałęzieniami
/// ## Łączenie (JOIN)
/// - JOIN_OUT - Początek nowego wątku powstałego z połączenia
/// - JOIN_IN - Koniec wątku wchodzącego do połączenia
///
/// ## Podział (FORK)
/// - FORK_OUT - Początek nowego wątku powstałego z podziału
/// - FORK_IN - Wydarzenie w wątku przed podziałem
///
/// # Kontekst użycia
/// Typ wydarzenia determinuje:
/// - Możliwość modyfikacji atrybutów i asocjacji
/// - Priorytet zmian (GLOBAL nadpisuje NORMAL)
/// - Możliwości połączeń między wątkami
public enum QdsEventType {
  /// Wydarzenie w wątku globalnym, nadpisuje zmiany z innych wątków
  GLOBAL,

  /// Standardowe wydarzenie w wątku
  NORMAL,

  /// Początek wątku
  START,

  /// Koniec wątku
  END,

  /// Wydarzenie puste
  IDLE,

  /// Początek wątku powstałego z połączenia
  JOIN_OUT,

  /// Koniec wątku wchodzącego do połączenia
  JOIN_IN,

  /// Początek wątku powstałego z podziału
  FORK_OUT,

  /// Wydarzenie w wątku przed podziałem
  FORK_IN,
}
