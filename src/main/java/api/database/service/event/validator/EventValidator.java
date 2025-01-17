package api.database.service.event.validator;

import api.database.model.domain.event.InternalValidationEvent;
import api.database.model.domain.object.InternalObjectInstanceAttributes;
import api.database.model.exception.ApiException;
import api.database.service.core.provider.ObjectInstanceProvider;
import java.util.List;
import org.springframework.stereotype.Component;

/// Główny walidator wydarzeń koordynujący proces weryfikacji zmian.
/// Odpowiada za:
/// - Weryfikację dostępności obiektów w kontekście wątku
/// - Sprawdzanie możliwości wykonania zmian atrybutów i asocjacji
/// - Walidację konfliktów czasowych z innymi wydarzeniami
@Component
public class EventValidator {

  private final ObjectInstanceProvider objectInstanceProvider;
  private final EventTimeConflictValidator eventTimeConflictValidator;
  private final EventChangeAvailabilityValidator eventChangeAvailabilityValidator;

  public EventValidator(
    ObjectInstanceProvider objectInstanceProvider,
    EventTimeConflictValidator eventTimeConflictValidator,
    EventChangeAvailabilityValidator eventChangeAvailabilityValidator
  ) {
    this.objectInstanceProvider = objectInstanceProvider;
    this.eventTimeConflictValidator = eventTimeConflictValidator;
    this.eventChangeAvailabilityValidator = eventChangeAvailabilityValidator;
  }

  /// Wykonuje pełną walidację wydarzenia.
  /// Proces weryfikacji:
  /// 1. Pobiera obiekty dostępne w kontekście wątku
  /// 2. Sprawdza czy zmiany dotyczą dostępnych obiektów
  /// 3. Weryfikuje konflikty czasowe z innymi wydarzeniami
  ///
  /// @param event walidowane wydarzenie ze zmianami
  /// @param threadId id wątku zawierającego wydarzenie
  /// @param globalThreadId id wątku globalnego
  /// @param scenarioId id scenariusza
  /// @param eventId id wydarzenia (null dla nowego)
  /// @throws ApiException gdy walidacja nie powiedzie się
  public void validateEvent(
    InternalValidationEvent event,
    Integer threadId,
    Integer globalThreadId,
    Integer scenarioId,
    Integer eventId
  ) {
    // Pobranie obiektów
    List<InternalObjectInstanceAttributes> objects =
      objectInstanceProvider.getObjectIdsWithAttributeIdsAvailableForThread(
        threadId,
        globalThreadId
      );

    // Walidacje - możliwość użycia danych obiektów
    eventChangeAvailabilityValidator.validateChangesAvailability(
      objects,
      event.associationChanges(),
      event.attributeChanges(),
      threadId.equals(globalThreadId)
    );

    // Weryfikacja konfliktów czasowych dla obiektów globalnych
    eventTimeConflictValidator.validateTimeConflicts(
      objects,
      event,
      scenarioId,
      eventId
    );
  }
}
