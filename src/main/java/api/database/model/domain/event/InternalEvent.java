package api.database.model.domain.event;

import api.database.entity.event.Event;
import api.database.entity.object.AttributeChange;
import api.database.model.constant.EventType;
import api.database.model.data.AssociationChangeData;
import api.database.model.data.AttributeChangeData;
import api.database.model.domain.association.InternalEventAssociationChange;
import java.util.List;

/// Wewnętrzna reprezentacja wydarzenia wraz z powiązanymi zmianami atrybutów i asocjacji.
/// Agreguje dane wydarzenia oraz wszystkie wprowadzone w nim modyfikacje obiektów.
///
/// # Pola
/// - id - identyfikator wydarzenia
/// - threadId - identyfikator wątku zawierającego wydarzenie
/// - time - czas wydarzenia
/// - eventType - typ wydarzenia (np. NORMAL, GLOBAL, START, END)
/// - description - opis wydarzenia
/// - title - tytuł wydarzenia
/// - associationChanges - lista zmian asocjacji
/// - attributeChanges - lista zmian atrybutów
///
/// # Metody fabryczne
/// - from - tworzy instancję na podstawie encji Event oraz list zmian asocjacji i atrybutów,
///   przekształcając je na odpowiednie struktury danych
public record InternalEvent(
  Integer id,
  Integer threadId,
  Integer time,
  EventType eventType,
  String description,
  String title,
  List<AssociationChangeData> associationChanges,
  List<AttributeChangeData> attributeChanges
) {
  public static InternalEvent from(
    Event event,
    List<InternalEventAssociationChange> associationChanges,
    List<AttributeChange> attributeChanges
  ) {
    return new InternalEvent(
      event.getId(),
      event.getThreadId(),
      event.getEventTime(),
      event.getEventType(),
      event.getDescription(),
      event.getTitle(),
      associationChanges.stream().map(AssociationChangeData::from).toList(),
      attributeChanges.stream().map(AttributeChangeData::from).toList()
    );
  }
}
