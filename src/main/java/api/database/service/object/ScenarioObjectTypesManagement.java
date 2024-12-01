package api.database.service.object;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.object.QdsObjectTypeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Zarządza typami obiektów w kontekście scenariusza.
/// Odpowiada za walidację możliwości dodawania obiektów
/// określonego typu do scenariusza.
@Component
public class ScenarioObjectTypesManagement {

  private final QdsObjectTypeRepository qdsObjectTypeRepository;

  public ScenarioObjectTypesManagement(
    QdsObjectTypeRepository qdsObjectTypeRepository
  ) {
    this.qdsObjectTypeRepository = qdsObjectTypeRepository;
  }

  /// Sprawdza czy obiekt o danym typie i szablonie może zostać dodany do scenariusza.
  /// Rzuca wyjątek jeśli dodanie obiektu jest niedozwolone.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param typeId identyfikator typu obiektu
  /// @param templateId identyfikator szablonu obiektu
  /// @throws ApiException gdy dodanie obiektu jest niedozwolone w scenariuszu
  public void checkIfCanAddObjectToScenario(
    Integer scenarioId,
    Integer typeId,
    Integer templateId
  ) {
    if (
      !qdsObjectTypeRepository.canAddObjectToScenario(
        scenarioId,
        typeId,
        templateId
      )
    ) throw new ApiException(
      ErrorCode.CANNOT_ADD_SUCH_OBJECT_IN_SCENARIO,
      ErrorGroup.SCENARIO,
      HttpStatus.BAD_REQUEST
    );
  }
}
