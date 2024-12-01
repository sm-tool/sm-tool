package api.database.model.constant;

/// Określa typ rozgałęzienia wątku w scenariuszu.
///
/// # Wartości
/// - JOIN - Łączenie wielu wątków w jeden
/// - FORK - Rozdzielenie jednego wątku na wiele
///
/// # Kontekst użycia
/// Określa charakter operacji na wątkach i wpływa na:
/// - Sposób transferu obiektów między wątkami
/// - Walidację poprawności operacji
/// - Typy eventów generowanych na wątkach (FORK_IN/OUT, JOIN_IN/OUT)
public enum QdsBranchingType {
  /// Łączenie wielu wątków w jeden wątek wynikowy
  JOIN,

  /// Rozdzielenie wątku na wiele wątków potomnych
  FORK,
}
