package api.database.service.event.processor;

import api.database.model.data.AssociationChangeData;
import api.database.model.domain.association.InternalAssociationKey;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Koordynator wykonywania zmian asocjacji w ramach wydarzenia.
/// Zarządza procesem poprzez:
/// - Pobranie i utworzenie wymaganych asocjacji
/// - Koordynację dodawania i usuwania zmian
/// - Zapewnienie odpowiedniej kolejności operacji
@Component
public class AssociationChangeExecutor {

  private final AssociationInator associationInator;
  private final AssociationChangeInator associationChangeInator;

  @Autowired
  public AssociationChangeExecutor(
    AssociationInator associationInator,
    AssociationChangeInator associationChangeInator
  ) {
    this.associationInator = associationInator;
    this.associationChangeInator = associationChangeInator;
  }

  /// Wykonuje zmiany asocjacji dla wydarzenia.
  /// Proces zmian:
  /// 1. Pobiera istniejące asocjacje dla wszystkich zmian
  /// 2. Dla dodawanych zmian:
  ///    - Tworzy nowe asocjacje jeśli potrzebne
  ///    - Zapisuje zmiany z uwzględnieniem poprzedniego stanu
  /// 3. Dla usuwanych zmian:
  ///    - Usuwa zmiany, wraz z kolejnymi jeśli to potrzebne i czyści nieużywane asocjacje
  ///
  /// @param eventId id eventu zawierającego zmiany
  /// @param toAdd zbiór zmian do dodania
  /// @param toDelete zbiór zmian do usunięcia
  public void executeChanges(
    Integer eventId,
    Set<AssociationChangeData> toAdd,
    Set<AssociationChangeData> toDelete
  ) {
    // Pobierz/stwórz asocjacje
    Map<InternalAssociationKey, Integer> existing =
      associationInator.getExisting(
        Stream.concat(toAdd.stream(), toDelete.stream()).collect(
          Collectors.toSet()
        )
      );
    if (!toAdd.isEmpty()) {
      Map<InternalAssociationKey, Integer> newOnes =
        associationInator.createNew(toAdd, existing);
      // Dodaj zmiany
      associationChangeInator.handleAdds(eventId, toAdd, existing, newOnes);
    }

    if (!toDelete.isEmpty()) {
      associationChangeInator.handleDeletes(eventId, toDelete, existing);
    }
  }
}
