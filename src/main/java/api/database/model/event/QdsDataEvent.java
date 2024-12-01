package api.database.model.event;

import api.database.model.association.QdsInfoAssociationChange;
import api.database.model.constant.QdsEventType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record QdsDataEvent(
  Integer id,
  @Schema(
    description = "ID of the thread in which the event takes place",
    example = "5"
  )
  @NotNull
  Integer threadId,
  @NotNull Integer time,
  @NotNull QdsEventType eventType,
  @Schema(
    description = "Description of the event",
    example = "Trasa wiedzie przez zatłoczone centrum miasta na dystansie ośmiu kilometrów. W połowie drogi u VIP-a zaobserwowano pierwsze oznaki zmęczenia, manifestujące się częstym ziewaniem. Wraz z upływem czasu podróży widoczny jest spadek koncentracji obiektu oraz narastające oznaki fizycznego wyczerpania. Po dotarciu do punktu docelowego VIP opuszcza limuzyne z wyraźnymi oznakami zmęczenia, zachowując jednak pełną świadomość sytuacyjną."
  )
  @NotNull
  String description,
  @Schema(description = "Title of the event", example = "Transport V.I.P.")
  @NotNull
  String title,
  @NotNull(message = "EVENT;NULL_VALUE;associationsChanges")
  @Valid
  List<QdsInfoAssociationChange> associationsChanges,
  @NotNull(message = "EVENT;NULL_VALUE;attributeChanges")
  @Valid
  List<QdsInfoAttributeChange> attributeChanges
) {}
