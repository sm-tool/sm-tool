package api.database.model.domain.association;

import api.database.entity.association.Association;
import api.database.model.data.AssociationChangeData;

/// Klucz identyfikujący asocjację w systemie, składający się z typu asocjacji
/// oraz identyfikatorów obu łączonych obiektów. Używany wewnętrznie do śledzenia
/// i walidacji powiązań między obiektami.
///
/// # Pola
/// - associationTypeId - identyfikator typu asocjacji
/// - object1Id - identyfikator pierwszego obiektu
/// - object2Id - identyfikator drugiego obiektu
///
/// # Metody fabryczne
/// Zawiera szereg metod statycznych 'from' konwertujących różne reprezentacje
/// asocjacji na spójny klucz wewnętrzny:
/// - z danych zmiany asocjacji ({@link AssociationChangeData})
/// - z encji asocjacji ({@link Association})
/// - z klucza zawierającego id ({@link InternalAssociationKeyWithId})
/// - ze zdarzenia zmiany asocjacji ({@link InternalEventAssociationChange})
public record InternalAssociationKey(
  Integer associationTypeId,
  Integer object1Id,
  Integer object2Id
) {
  public static InternalAssociationKey from(AssociationChangeData association) {
    return new InternalAssociationKey(
      association.associationTypeId(),
      association.object1Id(),
      association.object2Id()
    );
  }

  public static InternalAssociationKey from(Association association) {
    return new InternalAssociationKey(
      association.getAssociationTypeId(),
      association.getObject1Id(),
      association.getObject2Id()
    );
  }

  public static InternalAssociationKey from(
    InternalAssociationKeyWithId associationKeyWithId
  ) {
    return new InternalAssociationKey(
      associationKeyWithId.getAssociationTypeId(),
      associationKeyWithId.getObject1Id(),
      associationKeyWithId.getObject2Id()
    );
  }

  public static InternalAssociationKey from(
    InternalEventAssociationChange associationChangeEvent
  ) {
    return new InternalAssociationKey(
      associationChangeEvent.getAssociationTypeId(),
      associationChangeEvent.getObject1Id(),
      associationChangeEvent.getObject2Id()
    );
  }
}
