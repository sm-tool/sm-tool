package api.database.model.domain.event;

import api.database.model.constant.EventType;

/// Rekord reprezentujący dane potrzebne do dodania specjalnego wydarzenia w systemie.
/// Wydarzenia specjalne wymagają
/// szczególnej obsługi i mają wpływ na strukturę wątków.
///
/// # Pola
/// - threadId - identyfikator wątku, w którym ma powstać wydarzenie
/// - eventType - typ specjalnego wydarzenia (START, END, FORK_IN, FORK_OUT, JOIN_IN, JOIN_OUT)
/// - time - czas wydarzenia
/// - branchingId - identyfikator rozgałęzienia (dla FORK/JOIN) lub null dla innych typów
public record InternalSpecialEvent(
  Integer threadId,
  EventType eventType,
  Integer time,
  Integer branchingId
) {}
