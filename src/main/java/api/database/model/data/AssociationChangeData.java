package api.database.model.data;

import api.database.model.constant.AssociationOperation;
import api.database.model.domain.association.InternalEventAssociationChange;
import jakarta.validation.constraints.NotNull;

/// Reprezentuje zmianę asocjacji między dwoma obiektami w wydarzeniu.
/// Przechowuje:
/// - Identyfikator typu asocjacji
/// - Identyfikatory łączonych obiektów
/// - Typ operacji na asocjacji (INSERT/DELETE)
///
/// Używane do:
/// - Przetwarzania zmian asocjacji w wydarzeniach
/// - Walidacji spójności zmian
/// - Mapowania stanu w odpowiedziach API
/// - Otrzymywane wraz z zapytaniem API
public record AssociationChangeData(
  @NotNull(message = "NULL_VALUE;ASSOCIATION_CHANGE;associationTypeId")
  Integer associationTypeId,
  @NotNull(message = "NULL_VALUE;ASSOCIATION_CHANGE;object1Id")
  Integer object1Id,
  @NotNull(message = "NULL_VALUE;ASSOCIATION_CHANGE;object2Id")
  Integer object2Id,
  @NotNull(message = "NULL_VALUE;ASSOCIATION_CHANGE;associationOperation")
  AssociationOperation associationOperation
) {
  /// Tworzy obiekt zmiany z wewnętrznej reprezentacji zmiany asocjacji.
  ///
  /// @param change wewnętrzna reprezentacja zmiany
  /// @return zmapowany obiekt AssociationChangeData
  public static AssociationChangeData from(
    InternalEventAssociationChange change
  ) {
    return new AssociationChangeData(
      change.getAssociationTypeId(),
      change.getObject1Id(),
      change.getObject2Id(),
      change.getAssociationOperation()
    );
  }
}
