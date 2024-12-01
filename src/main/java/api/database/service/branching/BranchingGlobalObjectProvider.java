package api.database.service.branching;

import api.database.repository.object.QdsObjectRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Dostarcza podstawowe operacje na obiektach scenariusza.
/// Obecnie skupia się na operacjach związanych z obiektami globalnymi.
@Component
public class BranchingGlobalObjectProvider {

  private final QdsObjectRepository qdsObjectRepository;

  @Autowired
  public BranchingGlobalObjectProvider(
    QdsObjectRepository qdsObjectRepository
  ) {
    this.qdsObjectRepository = qdsObjectRepository;
  }

  /// Pobiera listę identyfikatorów obiektów globalnych dla scenariusza.
  /// Obiekty globalne są definiowane na wątku globalnym i są dostępne
  /// we wszystkich wątkach danego scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @return lista identyfikatorów obiektów globalnych
  public List<Integer> getGlobalObjects(Integer scenarioId) {
    return qdsObjectRepository.getGlobalObjects(scenarioId);
  }
}
