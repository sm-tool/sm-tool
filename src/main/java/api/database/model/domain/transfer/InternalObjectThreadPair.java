package api.database.model.domain.transfer;

/// Rekord reprezentujący parę identyfikatorów obiektu i wątku.
/// Używany podczas operacji przenoszenia obiektów między wątkami,
/// szczególnie w kontekście operacji FORK/JOIN.
///
/// # Pola
/// - objectId - identyfikator przenoszonego obiektu
/// - threadId - identyfikator wątku docelowego
public record InternalObjectThreadPair(Integer objectId, Integer threadId) {}
