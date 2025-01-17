package api.database.model.domain.transfer;

import api.database.model.constant.BranchingType;
import java.util.List;
import java.util.Map;

/// Rekord reprezentujący strukturę transferu obiektów w ramach rozgałęzienia (FORK/JOIN).
/// Agreguje informacje o rozgałęzieniu oraz mapuje obiekty do wątków wejściowych i wyjściowych.
///
/// # Pola
/// - id - identyfikator rozgałęzienia
/// - type - typ rozgałęzienia (FORK/JOIN)
/// - time - czas rozgałęzienia
/// - isCorrect - flaga poprawności transferu (istotna dla FORK)
/// - inThreadObjects - mapa wątek -> lista obiektów dla wątków wejściowych (IN)
/// - outThreadObjects - mapa wątek -> lista obiektów dla wątków wyjściowych (OUT)
///
/// # Zastosowanie
/// - Analiza przepływu obiektów przez rozgałęzienia
/// - Walidacja poprawności transferów w FORK
/// - Śledzenie przynależności obiektów do wątków przed i po rozgałęzieniu
public record InternalBranchingTransfer(
  Integer id,
  BranchingType type,
  Integer time,
  boolean isCorrect,
  // dla każdego wątku jego obiekty
  Map<Integer, List<Integer>> inThreadObjects, // thread_id -> objects dla IN
  Map<Integer, List<Integer>> outThreadObjects // thread_id -> objects dla OUT
) {}
