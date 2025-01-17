package api.database.model.domain.transfer;

import api.database.model.domain.object.InternalObjectInstance;
import java.util.List;

/// Rekord reprezentujący podział obiektów w wątku na globalne i lokalne.
/// Służy do zarządzania dostępnością obiektów w kontekście wątku, rozróżniając
/// obiekty globalne (dostępne we wszystkich wątkach) od lokalnych.
///
/// # Pola
/// - global - lista identyfikatorów obiektów globalnych (z wątku 0)
/// - local - lista identyfikatorów obiektów lokalnych (z innych wątków)
///
/// # Metody fabryczne
/// - create - tworzy instancję z listy obiektów, segregując je na globalne
///   i lokalne na podstawie ich wątku źródłowego (originThreadId)
///
/// # Zastosowanie
/// - Walidacja dostępu do obiektów w wątku
/// - Zarządzanie transferami obiektów
/// - Kontrola widoczności obiektów między wątkami
public record InternalThreadObjects(List<Integer> global, List<Integer> local) {
  public static InternalThreadObjects create(
    List<InternalObjectInstance> objects
  ) {
    return new InternalThreadObjects(
      objects
        .stream()
        .filter(o -> o.getOriginThreadId().equals(0))
        .map(InternalObjectInstance::getId)
        .toList(),
      objects
        .stream()
        .filter(o -> !o.getOriginThreadId().equals(0))
        .map(InternalObjectInstance::getId)
        .toList()
    );
  }
}
