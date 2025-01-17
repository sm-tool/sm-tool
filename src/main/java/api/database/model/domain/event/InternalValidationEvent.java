package api.database.model.domain.event;

import api.database.model.constant.EventType;
import api.database.model.data.AssociationChangeData;
import api.database.model.data.AttributeChangeData;
import api.database.model.request.composite.update.EventUpdateRequest;
import java.util.List;

/// Rekord reprezentujący dane wydarzenia wymagane do walidacji.
/// Zawiera kluczowe informacje potrzebne do zweryfikowania poprawności
/// planowanych zmian atrybutów i asocjacji w kontekście czasu i typu wydarzenia.
///
/// # Pola
/// - eventType - typ wydarzenia determinujący dozwolone operacje
/// - time - czas wydarzenia potrzebny do weryfikacji konfliktów
/// - attributeChanges - lista zmian atrybutów do zwalidowania
/// - associationChanges - lista zmian asocjacji do zwalidowania
///
/// # Metody fabryczne
/// - from - tworzy instancję łącząc dane z żądania aktualizacji ({@link EventUpdateRequest})
///   z istniejącym wydarzeniem ({@link InternalEvent}), zachowując oryginalny typ i czas
public record InternalValidationEvent(
  EventType eventType,
  Integer time,
  List<AttributeChangeData> attributeChanges,
  List<AssociationChangeData> associationChanges
) {
  public static InternalValidationEvent from(
    EventUpdateRequest updatedEvent,
    InternalEvent existingEvent
  ) {
    return new InternalValidationEvent(
      existingEvent.eventType(),
      existingEvent.time(),
      updatedEvent.attributeChanges(),
      updatedEvent.associationChanges()
    );
  }
}
