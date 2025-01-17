package api.database.model.request.composite.update;

import api.database.entity.event.Event;
import api.database.model.data.AssociationChangeData;
import api.database.model.data.AttributeChangeData;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/// Reprezentuje żądanie aktualizacji istniejącego wydarzenia w scenariuszu.
/// Zawiera nowe wartości podstawowych właściwości wydarzenia oraz listy zmian atrybutów
/// i asocjacji do zastosowania.
///
/// # Ważne zasady
/// - Nie można modyfikować wydarzeń typu FORK_IN/OUT, JOIN_IN/OUT, END
/// - Zmiany są walidowane pod kątem dostępności obiektów w kontekście wątku
/// - Konflikty czasowe są rozwiązywane automatycznie dla wydarzeń GLOBAL
/// - Dla wydarzeń NORMAL konflikty czasowe powodują błąd
///
/// # Pola
/// - `title` - tytuł wydarzenia
/// - `description` - opis wydarzenia
/// - `associationChanges` - lista zmian asocjacji w danym wydarzeniu
/// - `attributeChanges` - lista zmian atrybutów w danym wydarzeniu
///
/// # Powiązania
/// - {@link Event} - encja wydarzenia w bazie danych
/// - {@link AttributeChangeData} - reprezentacja zmiany atrybutu
/// - {@link AssociationChangeData} - reprezentacja zmiany asocjacji
public record EventUpdateRequest(
  @Schema(
    description = "Description of the event",
    example = "Trasa wiedzie przez zatłoczone centrum miasta na dystansie ośmiu kilometrów. W połowie drogi u VIP-a zaobserwowano pierwsze oznaki zmęczenia, manifestujące się częstym ziewaniem. Wraz z upływem czasu podróży widoczny jest spadek koncentracji obiektu oraz narastające oznaki fizycznego wyczerpania. Po dotarciu do punktu docelowego VIP opuszcza limuzyne z wyraźnymi oznakami zmęczenia, zachowując jednak pełną świadomość sytuacyjną."
  )
  String description,
  /// Tytuł wydarzenia
  /// @example "Transport V.I.P."
  @Schema(description = "Title of the event", example = "Transport V.I.P.")
  String title,
  /// Lista zmian asocjacji do zastosowania
  @NotNull(message = "NULL_VALUE;EVENT;associationChanges")
  @Valid
  List<AssociationChangeData> associationChanges,

  @NotNull(message = "NULL_VALUE;EVENT;attributeChanges")
  @Valid
  /// Lista zmian atrybutów do zastosowania
  List<AttributeChangeData> attributeChanges
) {}
