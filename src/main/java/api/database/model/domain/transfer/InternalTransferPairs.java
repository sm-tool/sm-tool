package api.database.model.domain.transfer;

import java.util.Set;

/// Rekord reprezentujący zestaw par obiekt-wątek do dodania i usunięcia podczas
/// transferu obiektów między wątkami. Używany głównie przy operacjach FORK/JOIN.
///
/// # Pola
/// - toAdd - zbiór par obiekt-wątek do utworzenia
/// - toRemove - zbiór par obiekt-wątek do usunięcia
///
/// # Zastosowanie
/// Używany w procesie transferu obiektów między wątkami aby:
/// - Śledzić zmiany w przypisaniach obiektów
/// - Zapewnić atomowość operacji przenoszenia
/// - Zachować spójność stanu obiektów w wątkach
public record InternalTransferPairs(
  Set<InternalObjectThreadPair> toAdd, // pary do dodania
  Set<InternalObjectThreadPair> toRemove // pary do usunięcia
) {}
