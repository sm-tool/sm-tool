package api.database.model.response;

import java.util.List;

/// Projekcja JPA reprezentująca stan wątku wraz z przypisanymi obiektami i ramami czasowymi.
/// Używana do bezpośredniego mapowania wyników zapytań o stan wątku.
///
/// @apiNote To jest interfejs projekcji JPA, implementowany automatycznie przez Hibernate
/// podczas mapowania wyników zapytań. Nie należy tworzyć własnych implementacji.
public interface ThreadResponse {
  /// @return identyfikator wątku
  Integer getId();
  /// @return tytuł wątku
  String getTitle();
  /// @return opis wątku
  String getDescription();
  /// @return lista identyfikatorów obiektów przypisanych do wątku
  List<Integer> getObjectIds();
  /// @return czas pierwszego wydarzenia w wątku
  Integer getStartTime();
  /// @return czas ostatniego wydarzenia w wątku
  Integer getEndTime();
  /// @return identyfikator rozgałęzienia wchodzącego (FORK_IN/JOIN_IN) lub null
  Integer getIncomingBranchingId();
  /// @return identyfikator rozgałęzienia wychodzącego (FORK_OUT/JOIN_OUT) lub null
  Integer getOutgoingBranchingId();
}
