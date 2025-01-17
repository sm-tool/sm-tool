package api.database.model.response;

import api.database.model.domain.association.InternalEventAssociationChange;
import api.database.model.domain.association.InternalLastAssociationChange;

/// Reprezentuje zmianę asocjacji między obiektami w kontekście wydarzenia.
/// Używany w odpowiedziach API do prezentacji historii zmian asocjacji.
///
/// # Przechowuje
/// - Identyfikatory powiązanych encji (typ asocjacji, obiekty)
/// - Informacje o zmianie (poprzednia i nowa wartość)
///
/// # Tworzenie
/// Dostarcza metodę statyczną `create()` do tworzenia odpowiedzi na podstawie:
/// - Aktualnej zmiany (InternalEventAssociationChange)
/// - Poprzedniej zmiany (InternalLastAssociationChange)
///
/// # Przykład użycia
/// ```java
/// AssociationChangeResponse response = AssociationChangeResponse.create(
///     currentChange,
///     lastChange
/// );
/// ```
///
/// # Struktura rekordu
/// @param associationTypeId identyfikator typu asocjacji
/// @param object1Id identyfikator pierwszego obiektu
/// @param object2Id identyfikator drugiego obiektu
/// @param changeType informacje o zmianie (poprzedni i nowy stan)
///

public record AssociationChangeResponse(
  Integer associationTypeId,
  Integer object1Id,
  Integer object2Id,
  ChangeResponse changeType
) {
  public static AssociationChangeResponse create(
    InternalEventAssociationChange current,
    InternalLastAssociationChange last
  ) {
    return new AssociationChangeResponse(
      current.getAssociationTypeId(),
      current.getObject1Id(),
      current.getObject2Id(),
      ChangeResponse.fromAssociation(current, last)
    );
  }
}
