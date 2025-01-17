package api.database.model.constant;

/// Definiuje typy wydarzeń występujących w wątkach scenariusza.
///
/// # Sposoby tworzenia wątków
/// ## 1. Wątek globalny
/// - Tworzony automatycznie wraz z scenariuszem
/// - Typy wydarzeń: `START` i `END`
/// - Najwyższy priorytet, może nadpisywać zmiany w innych wątkach
///
/// ## 2. Wątek normalny
/// - Dodawany bezpośrednio w czasie scenariusza
/// - Typ wydarzenia: `START`
/// - Standardowy wątek bez specjalnych operacji
///
/// ## 3. Wątek z łączenia (JOIN)
/// - Tworzony przez połączenie istniejących wątków
/// - Typ wydarzenia: `JOIN_OUT`
/// - Powstaje w wyniku operacji scalania wątków
///
/// ## 4. Wątek z podziału (FORK)
/// - Tworzony z istniejącego wątku
/// - Typ wydarzenia: `FORK_OUT`
/// - Powstaje w wyniku rozgałęzienia wątku
///
/// # Zasady wydarzeń końcowych
/// - `END` - standardowe zamknięcie wątku
/// - `JOIN_IN` - zamknięcie wątku podczas operacji JOIN
/// - `FORK_IN` - ostatnie wydarzenie wątku przed podziałem
///
/// @see api.database.entity.event.Event wydarzenie
public enum EventType {
  /// Wydarzenie w wątku globalnym, nadpisuje zmiany z innych wątków
  GLOBAL,

  /// Standardowe wydarzenie w wątku
  NORMAL,

  /// Początek wątku macierzystego
  START,

  /// Koniec wątku
  END,

  /// Wydarzenie puste
  IDLE,

  /// Początek wątku utworzonego przez JOIN
  JOIN_OUT,

  /// Koniec wątku włączanego do innego
  JOIN_IN,

  /// Początek wątku utworzonego przez FORK
  FORK_OUT,

  /// Wydarzenie końcowe wątku przed podziałem
  FORK_IN,
}
