package api.database.model.domain.thread;

import api.database.model.constant.BranchingType;
import api.database.model.request.composite.create.ThreadCreateRequest;

/// Rekord reprezentujący dane potrzebne do utworzenia nowego wątku powstałego
/// w wyniku rozgałęzienia (FORK/JOIN). Zawiera podstawowe informacje o wątku
/// oraz dane identyfikujące rozgałęzienie.
///
/// # Pola
/// - threadInfo - podstawowe dane nowego wątku (tytuł, opis, czas startu)
/// - branchingId - identyfikator powiązanego rozgałęzienia
/// - branchingType - typ rozgałęzienia (FORK/JOIN) determinujący rodzaj tworzonego wątku
///
/// # Zastosowanie
/// Używany podczas tworzenia wątków potomnych w operacjach FORK oraz
/// wątku wynikowego w operacji JOIN.
public record InternalBranchedThreadCreate(
  ThreadCreateRequest threadInfo,
  Integer branchingId,
  BranchingType branchingType
) {}
