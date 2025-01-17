package api.database.model.domain.thread;

import java.util.List;
import java.util.Set;

/// Rekord zawierający wynik analizy usuwania wątku, identyfikujący wszystkie
/// elementy wymagające usunięcia lub modyfikacji w wyniku tej operacji.
///
/// # Pola
/// - threadsToDelete - zbiór identyfikatorów wątków do usunięcia (wątek główny i powiązane)
/// - branchingsToDelete - zbiór identyfikatorów rozgałęzień (FORK/JOIN) do usunięcia
/// - oneToOneJoins - lista identyfikatorów operacji JOIN łączących dokładnie dwa wątki,
///                   wymagających specjalnej obsługi przy usuwaniu
///
/// # Zastosowanie
/// Używany podczas kaskadowego usuwania wątków, aby zapewnić spójność danych
/// i prawidłową obsługę wszystkich powiązanych elementów.
public record InternalThreadRemovalAnalysis(
  Set<Integer> threadsToDelete,
  Set<Integer> branchingsToDelete,
  List<Integer> oneToOneJoins
) {}
