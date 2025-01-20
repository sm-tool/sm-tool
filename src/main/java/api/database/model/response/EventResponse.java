package api.database.model.response;

import api.database.entity.event.Event;
import api.database.model.constant.EventType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/// Reprezentuje pełny stan wydarzenia wraz ze wszystkimi powiązanymi zmianami.
/// Używany jako główna odpowiedź API dla operacji na wydarzeniach.
///
/// # Przechowuje
/// - Podstawowe informacje o wydarzeniu (id, czas, typ, tytuł, opis)
/// - Kontekst wątku (id wątku)
/// - Zmiany asocjacji i atrybutów wprowadzone w wydarzeniu
///
/// # Tworzenie
/// Dostarcza metodę statyczną from() tworzącą odpowiedź na podstawie:
/// - Encji wydarzenia
/// - List zmian asocjacji i atrybutów
///
/// # Przykład użycia
/// ```java
/// EventResponse response = EventResponse.from(
///     event,
///     associationChanges,
///     attributeChanges
/// );
/// ```
///
/// # Struktura rekordu
/// @param id identyfikator wydarzenia
/// @param threadId identyfikator wątku zawierającego wydarzenie
/// @param time czas wydarzenia
/// @param eventType typ wydarzenia (GLOBAL/NORMAL/START/END itp.)
/// @param description opis wydarzenia
/// @param title tytuł wydarzenia
/// @param associationChanges lista zmian asocjacji
/// @param attributeChanges lista zmian atrybutów
public record EventResponse(
  Integer id,
  @Schema(
    description = "ID of the thread in which the event takes place",
    example = "5"
  )
  Integer threadId,
  Integer time,
  EventType eventType,
  @Schema(
    description = "Description of the event",
    example = "Trasa wiedzie przez zatłoczone centrum miasta na dystansie ośmiu kilometrów. W połowie drogi u VIP-a zaobserwowano pierwsze oznaki zmęczenia, manifestujące się częstym ziewaniem. Wraz z upływem czasu podróży widoczny jest spadek koncentracji obiektu oraz narastające oznaki fizycznego wyczerpania. Po dotarciu do punktu docelowego VIP opuszcza limuzyne z wyraźnymi oznakami zmęczenia, zachowując jednak pełną świadomość sytuacyjną."
  )
  String description,
  @Schema(description = "Title of the event", example = "Transport V.I.P.")
  String title,
  List<AssociationChangeResponse> associationChanges,
  List<AttributeChangeResponse> attributeChanges
) {
  public static EventResponse from(
    Event event,
    List<AssociationChangeResponse> associationChanges,
    List<AttributeChangeResponse> attributeChanges
  ) {
    return new EventResponse(
      event.getId(),
      event.getThreadId(),
      event.getEventTime(),
      event.getEventType(),
      event.getDescription(),
      event.getTitle(),
      associationChanges,
      attributeChanges
    );
  }
}
