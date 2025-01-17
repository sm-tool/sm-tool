package api.database.model.response;

import api.database.model.domain.object.InternalObjectInstance;
import java.util.List;
import java.util.Map;

/// Reprezentuje obiekty przypisane do wątku, z podziałem na globalne i lokalne.
/// Używany w odpowiedziach API do prezentacji obiektów dostępnych w kontekście wątku.
///
/// # Przechowuje
/// - Lista obiektów globalnych (wspólnych dla wszystkich wątków)
/// - Lista obiektów lokalnych (specyficznych dla wątku)
///
/// # Tworzenie
/// Dostarcza metodę statyczną create() tworzącą odpowiedź na podstawie:
/// - Listy obiektów (InternalObjectInstance)
/// - Mapy atrybutów dla obiektów
///
/// # Przykład użycia
/// ```java
/// ThreadObjectsResponse response = ThreadObjectsResponse.create(
///     objects,
///     attributesMap
/// );
/// ```
///
/// # Struktura rekordu
/// @param global lista obiektów globalnych
/// @param local lista obiektów lokalnych
public record ThreadObjectsResponse(
  List<ObjectInstanceResponse> global,
  List<ObjectInstanceResponse> local
) {
  public static ThreadObjectsResponse create(
    List<InternalObjectInstance> objects,
    Map<Integer, List<AttributeResponse>> attributes
  ) {
    return new ThreadObjectsResponse(
      objects
        .stream()
        .filter(o -> o.getOriginThreadId().equals(0))
        .map(o -> ObjectInstanceResponse.from(o, attributes.get(o.getId())))
        .toList(),
      objects
        .stream()
        .filter(o -> !o.getOriginThreadId().equals(0))
        .map(o -> ObjectInstanceResponse.from(o, attributes.get(o.getId())))
        .toList()
    );
  }
}
