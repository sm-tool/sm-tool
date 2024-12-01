package api.database.service.core;

import api.database.entity.thread.QdsThread;
import api.database.repository.thread.QdsThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Klasa zapewniająca podstawowe operacje na wątkach scenariusza.
/// Dostarcza niskiego poziomu funkcjonalności dostępu do danych wątków,
/// które są wykorzystywane przez wyższe warstwy logiki biznesowej.
@Component
public class ThreadBaseOperations {

  private final QdsThreadRepository qdsThreadRepository;

  @Autowired
  public ThreadBaseOperations(QdsThreadRepository qdsThreadRepository) {
    this.qdsThreadRepository = qdsThreadRepository;
  }

  /// Pobiera identyfikator wątku globalnego dla danego scenariusza.
  /// Wątek globalny jest specjalnym typem wątku, który ma najwyższy priorytet
  /// i może nadpisywać zmiany w innych wątkach scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @return identyfikator wątku globalnego
  /// @apiNote Metoda musi być wykonywana w ramach transakcji nadrzędnej
  public Integer getGlobalThreadId(Integer scenarioId) {
    return qdsThreadRepository.getGlobalThreadId(scenarioId);
  }

  /// Tworzy wątek globalny dla nowego scenariusza.
  /// Wątek globalny jest specjalnym typem wątku, który ma najwyższy priorytet
  /// i może nadpisywać zmiany w innych wątkach scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @apiNote Metoda musi być wykonywana w ramach transakcji nadrzędnej
  public void addGlobalThread(Integer scenarioId) {
    qdsThreadRepository.save(
      new QdsThread(
        null,
        scenarioId,
        "Global thread",
        "Global thread",
        true,
        null
      )
    );
  }
}
