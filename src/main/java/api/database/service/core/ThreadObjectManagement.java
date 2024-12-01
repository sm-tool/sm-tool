package api.database.service.core;

import api.database.model.internal.object.QdsInternalObjectInEvent;
import api.database.repository.object.QdsObjectRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

//TODO rozbić
/// Klasa zarządzająca obiektami w kontekście wątków scenariusza.
/// Odpowiada za operacje dostępu i modyfikacji obiektów przypisanych do wątków,
/// z uwzględnieniem specjalnej obsługi wątku globalnego.
@Component
public class ThreadObjectManagement {

  private final QdsObjectRepository qdsObjectRepository;

  @Autowired
  public ThreadObjectManagement(QdsObjectRepository qdsObjectRepository) {
    this.qdsObjectRepository = qdsObjectRepository;
  }

  /// Usuwa wszystkie obiekty przypisane do danego wątku.
  ///
  /// @param threadId identyfikator wątku
  public void deleteObjectsFromStartThread(Integer threadId) {
    qdsObjectRepository.deleteObjectsForThread(threadId);
  }

  /// Pobiera identyfikatory wszystkich obiektów przypisanych do wątku.
  ///
  /// @param threadId identyfikator wątku
  /// @return lista identyfikatorów obiektów
  public List<Integer> getThreadObjects(Integer threadId) {
    return qdsObjectRepository.getAllThreadObjects(threadId);
  }

  /// Pobiera obiekty dostępne dla wątku, uwzględniając obiekty z wątku globalnego.
  ///
  /// @param threadId identyfikator wątku
  /// @param globalThreadId identyfikator wątku globalnego
  /// @return lista obiektów z ich atrybutami dostępnymi w kontekście eventu
  public List<QdsInternalObjectInEvent> getObjectsAvailableForThread(
    Integer threadId,
    Integer globalThreadId
  ) {
    return qdsObjectRepository.getObjectsAvailableForThread(
      threadId,
      globalThreadId
    );
  }
}
