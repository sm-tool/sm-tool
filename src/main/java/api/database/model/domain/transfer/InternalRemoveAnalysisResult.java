package api.database.model.domain.transfer;

import java.util.Set;

/// Rekord reprezentujący wynik analizy usuwania obiektu z wątku.
/// Identyfikuje wszystkie wątki, z których obiekt powinien zostać usunięty
/// w wyniku tej operacji.
///
/// # Pola
/// - threadsToClean - zbiór identyfikatorów wątków, z których należy usunąć obiekt
///
/// # Zastosowanie
/// - Kaskadowe usuwanie obiektu ze wszystkich powiązanych wątków
/// - Czyszczenie stanu obiektu w scenariuszu
/// - Zapewnienie spójności danych przy usuwaniu obiektów
public record InternalRemoveAnalysisResult(
  Set<Integer> threadsToClean // z których wątków usunąć
) {}
