package api.database.model.domain.transfer;

/// Projekcja JPA zwracająca parę: identyfikator obiektu i identyfikator wątku,
/// do którego obiekt jest przypisany. Używana podczas operacji transferu obiektów.
public interface InternalObjectIdWIthThread {
  /// @return identyfikator obiektu
  Integer getObjectId();

  /// @return identyfikator wątku
  Integer getThreadId();
}
