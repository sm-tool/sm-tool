package api.database.model.domain.association;

/// Record przechowujący identyfikatory typów obiektów dozwolonych w asocjacji.
/// Służy do walidacji czy dwa obiekty mogą zostać ze sobą powiązane na podstawie
/// ich typów.
///
/// # Pola
/// - firstObjectTypeId - identyfikator typu pierwszego obiektu
/// - secondObjectTypeId - identyfikator typu drugiego obiektu
///
/// # Metody fabryczne
/// - from - tworzy instancję na podstawie projekcji JPA {@link InternalAssociationIdWithObjectTypes}

public record InternalAssociationObjectTypes(
  Integer firstObjectTypeId,
  Integer secondObjectTypeId
) {
  public static InternalAssociationObjectTypes from(
    InternalAssociationIdWithObjectTypes association
  ) {
    return new InternalAssociationObjectTypes(
      association.getFirstObjectTypeId(),
      association.getSecondObjectTypeId()
    );
  }
}
