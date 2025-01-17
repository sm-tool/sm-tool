package api.database.model.domain.event;

import api.database.model.constant.EventType;

/// Rekord reprezentujący dane do modyfikacji ostatniego wydarzenia w wątku.
/// Używany podczas operacji na rozgałęzieniach (FORK/JOIN) do dostosowania
/// ostatniego wydarzenia zgodnie z wymaganiami operacji.
///
/// # Pola
/// - eventTime - nowy czas wydarzenia
/// - type - nowy typ wydarzenia (np. FORK_IN, JOIN_IN)
/// - branchingId - identyfikator powiązanego rozgałęzienia lub null
public record InternalLastEventModification(
  Integer eventTime,
  EventType type,
  Integer branchingId
) {}
