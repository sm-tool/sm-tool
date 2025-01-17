package api.database.service.event.processor;

import api.database.entity.association.AssociationChange;
import api.database.model.constant.AssociationOperation;
import api.database.model.data.AssociationChangeData;
import api.database.model.domain.association.InternalAssociationKey;
import api.database.model.domain.association.InternalLastAssociationOperation;
import api.database.repository.association.AssociationChangeRepository;
import api.database.service.core.ObjectStateCleaner;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Procesor zmian asocjacji w ramach wydarzeń.
/// Odpowiada za:
/// - Dodawanie nowych zmian asocjacji z uwzględnieniem poprzedniego stanu
/// - Usuwanie zmian asocjacji wraz z czyszczeniem nieużywanych asocjacji
/// - Eliminację redundantnych zmian (ta sama operacja co poprzednio)
@Component
public class AssociationChangeInator {

  private final AssociationChangeRepository repository;
  private final ObjectStateCleaner cleaner;

  @Autowired
  public AssociationChangeInator(
    AssociationChangeRepository repository,
    ObjectStateCleaner cleaner
  ) {
    this.repository = repository;
    this.cleaner = cleaner;
  }

  /// Obsługuje usuwanie zmian asocjacji.
  /// Proces obejmuje:
  /// 1. Zebranie identyfikatorów asocjacji do usunięcia
  /// 2. Usunięcie zmian z podanego eventu i późniejszych (jeśli istnieją - powtarzająca się operacja)
  /// 3. Wyczyszczenie nieużywanych asocjacji
  ///
  /// @param eventId id eventu zawierającego zmiany
  /// @param toDelete zbiór zmian do usunięcia
  /// @param existing mapa istniejących asocjacji (klucz -> id)
  void handleDeletes(
    Integer eventId,
    Set<AssociationChangeData> toDelete,
    Map<InternalAssociationKey, Integer> existing
  ) {
    Integer[] associationIds = toDelete
      .stream()
      .map(change -> existing.get(InternalAssociationKey.from(change)))
      .toArray(Integer[]::new);

    repository.deleteChangesAndNext(eventId, associationIds);
    cleaner.deleteNotUsedAssociations();
  }

  /// Obsługuje dodawanie nowych zmian asocjacji.
  /// Proces obejmuje:
  /// 1. Połączenie map istniejących i nowych asocjacji
  /// 2. Pobranie ostatnich operacji dla wszystkich asocjacji
  /// 3. Filtrację zmian aby uniknąć duplikowania tej samej operacji
  /// 4. Zapis pozostałych (nienadmiarowych) zmian
  ///
  /// @param eventId id eventu dla nowych zmian
  /// @param toAdd zbiór zmian do dodania
  /// @param existingAssociations mapa istniejących asocjacji (klucz -> id)
  /// @param newAssociations mapa nowo utworzonych asocjacji (klucz -> id)
  void handleAdds(
    Integer eventId,
    Set<AssociationChangeData> toAdd,
    Map<InternalAssociationKey, Integer> existingAssociations,
    Map<InternalAssociationKey, Integer> newAssociations
  ) {
    Map<InternalAssociationKey, Integer> allAssociationIds = new HashMap<>(
      existingAssociations
    );
    allAssociationIds.putAll(newAssociations);

    // Pobierz ostatnie operacje dla wszystkich asocjacji
    Map<Integer, AssociationOperation> lastOperations = repository
      .getLastOperations(
        allAssociationIds.values().toArray(new Integer[0]),
        eventId
      )
      .stream()
      .collect(
        Collectors.toMap(
          InternalLastAssociationOperation::getAssociationId,
          InternalLastAssociationOperation::getAssociationOperation
        )
      );

    // Filtruj tylko te zmiany gdzie operacja jest inna niż poprzednia
    List<AssociationChange> changes = toAdd
      .stream()
      .filter(change -> {
        Integer associationId = allAssociationIds.get(
          InternalAssociationKey.from(change)
        );
        AssociationOperation lastOp = lastOperations.get(associationId);
        return lastOp == null || lastOp != change.associationOperation();
      })
      .map(change ->
        AssociationChange.from(
          change,
          allAssociationIds.get(InternalAssociationKey.from(change)),
          eventId
        )
      )
      .collect(Collectors.toList());

    if (!changes.isEmpty()) {
      repository.saveAllAndFlush(changes);
      repository.deleteNextChanges(
        eventId,
        changes
          .stream()
          .map(AssociationChange::getAssociationId)
          .toArray(Integer[]::new)
      );
    }
  }
}
