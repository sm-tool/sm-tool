package api.database.model.domain.thread;

import java.util.List;

/// Projekcja JPA zwracająca zestaw identyfikatorów wątków i rozgałęzień powiązanych
/// ze sobą w strukturze scenariusza. Używana podczas analizy zależności między
/// wątkami.
public interface InternalThreadBatch {
  /// @return lista identyfikatorów powiązanych wątków
  List<Integer> getThreads();
  /// @return lista identyfikatorów operacji JOIN do weryfikacji
  List<Integer> getJoinsToCheck();
  /// @return lista identyfikatorów operacji FORK
  List<Integer> getForks();
}
