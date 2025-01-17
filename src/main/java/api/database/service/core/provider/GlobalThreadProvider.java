package api.database.service.core.provider;

import api.database.repository.thread.ThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Klasa zapewniająca podstawowe operacje na wątkach scenariusza.
/// Dostarcza niskiego poziomu funkcjonalności dostępu do danych wątków,
/// które są wykorzystywane przez wyższe warstwy logiki biznesowej.
@Component
public class GlobalThreadProvider {

  private final ThreadRepository threadRepository;

  @Autowired
  public GlobalThreadProvider(ThreadRepository threadRepository) {
    this.threadRepository = threadRepository;
  }

  /// Pobiera identyfikator wątku globalnego dla danego scenariusza.
  /// Wątek globalny jest specjalnym typem wątku, który ma najwyższy priorytet
  /// i może nadpisywać zmiany w innych wątkach scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @return identyfikator wątku globalnego
  /// @apiNote Metoda musi być wykonywana w ramach transakcji nadrzędnej
  public Integer getGlobalThreadId(Integer scenarioId) {
    return threadRepository.getGlobalThreadId(scenarioId);
  }
}
