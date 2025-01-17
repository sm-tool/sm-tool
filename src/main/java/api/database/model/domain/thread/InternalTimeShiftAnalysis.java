package api.database.model.domain.thread;

import java.util.Map;
import java.util.Set;

/// Rekord reprezentujący wynik analizy przesunięcia czasowego wątku, zawierający
/// wszystkie elementy wymagające modyfikacji przy zmianie czasu wydarzeń.
///
/// # Pola
/// - threadsToShift - zbiór identyfikatorów wątków, których wydarzenia wymagają przesunięcia czasowego
/// - branchingsToShift - zbiór identyfikatorów rozgałęzień wymagających aktualizacji czasu
/// - threadsToFill - mapa wątek -> czas, określająca które wątki wymagają wypełnienia
///                   wydarzeniami IDLE i od jakiego czasu
///
/// # Zastosowanie
/// Używany podczas operacji przesuwania wydarzeń w czasie, aby zapewnić:
/// - Spójność czasową między powiązanymi wątkami
/// - Poprawną aktualizację czasów rozgałęzień
/// - Właściwe wypełnienie powstałych luk wydarzeniami IDLE
public record InternalTimeShiftAnalysis(
  Set<Integer> threadsToShift, // wątki do przesunięcia
  Set<Integer> branchingsToShift, // branching_id do zaktualizowania czasu
  Map<Integer, Integer> threadsToFill // wątki do wypełnienia za pomocą idle events + czasy rozgałęzień
) {}
