package api.database.model.domain.thread;

import api.database.model.constant.BranchingType;
import api.database.model.constant.EventType;

/// Projekcja JPA reprezentująca wiersz danych o rozgałęzieniu wątku (FORK/JOIN).
/// Zawiera komplet informacji o samym rozgałęzieniu oraz powiązanych z nim
/// obiektach i wydarzeniach.
public interface InternalBranchingRow {
  /// @return identyfikator rozgałęzienia
  Integer getId();
  /// @return typ rozgałęzienia (FORK/JOIN)
  BranchingType getBranchingType();
  /// @return czy rozgałęzienie jest poprawne (dla FORK)
  Boolean getIsCorrect();
  /// @return tytuł rozgałęzienia
  String getTitle();
  /// @return opis rozgałęzienia
  String getDescription();
  /// @return czas rozgałęzienia
  Integer getBranchingTime();
  /// @return identyfikator powiązanego wątku
  Integer getThreadId();
  /// @return typ wydarzenia (FORK_IN, FORK_OUT, JOIN_IN, JOIN_OUT)
  EventType getEventType();
  /// @return tablica identyfikatorów obiektów w wątku
  Integer[] getThreadObjects();
}
