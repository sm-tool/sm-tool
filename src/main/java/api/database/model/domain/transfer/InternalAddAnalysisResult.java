package api.database.model.domain.transfer;

import java.util.Set;

/// Rekord reprezentujący wynik analizy dodawania obiektu do wątku w kontekście
/// rozgałęzień (FORK/JOIN). Identyfikuje potencjalne problemy i wymagane akcje.
///
/// # Pola
/// - forksToMark - zbiór identyfikatorów operacji FORK wymagających oznaczenia jako niepoprawne
/// - threadsWithConflicts - zbiór identyfikatorów wątków gdzie wykryto konflikty
/// - validThreads - zbiór identyfikatorów wątków, do których obiekt może zostać bezpiecznie dodany
///
/// # Zastosowanie
/// - Identyfikacja FORKów wymagających ponownego transferu obiektów
/// - Wykrywanie konfliktów przy łączeniu wątków (JOIN)
/// - Określanie bezpiecznych ścieżek transferu obiektu
public record InternalAddAnalysisResult(
  Set<Integer> forksToMark, // które forki oznaczyć
  Set<Integer> threadsWithConflicts, // gdzie były konflikty
  Set<Integer> validThreads // do których wątków dodać obiekt
) {}
