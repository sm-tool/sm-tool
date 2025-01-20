package api.database.service.core;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.scenario.ScenarioRepository;
import api.database.repository.scenario.ScenarioToObjectTemplateRepository;
import api.database.repository.scenario.ScenarioToObjectTypeRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ScenarioManager {

  private final ScenarioToObjectTypeRepository scenarioToObjectTypeRepository;
  private final ScenarioRepository scenarioRepository;
  private final ScenarioToObjectTemplateRepository scenarioToObjectTemplateRepository;

  @Autowired
  public ScenarioManager(
    ScenarioToObjectTypeRepository scenarioToObjectTypeRepository,
    ScenarioRepository scenarioRepository,
    ScenarioToObjectTemplateRepository scenarioToObjectTemplateRepository
  ) {
    this.scenarioToObjectTypeRepository = scenarioToObjectTypeRepository;
    this.scenarioRepository = scenarioRepository;
    this.scenarioToObjectTemplateRepository =
      scenarioToObjectTemplateRepository;
  }

  ///
  /// Funkcja dodająca podstawowe typy (z konfiguracji) do nowo utworzonego scenariusza
  /// @param scenarioId
  ///
  public void addDefaultTypes(Integer scenarioId) {
    scenarioToObjectTypeRepository.addBaseTypes(scenarioId);
  }

  /// Sprawdza czy obiekt o danym typie i szablonie może zostać dodany do scenariusza.
  /// Rzuca wyjątek jeśli dodanie obiektu jest niedozwolone.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param templateId identyfikator szablonu obiektu
  /// @throws ApiException gdy dodanie obiektu jest niedozwolone w scenariuszu
  public void checkIfCanAddObjectToScenario(
    Integer scenarioId,
    Integer templateId
  ) {
    if (
      !scenarioToObjectTemplateRepository.canAddObjectToScenario(
        scenarioId,
        templateId
      )
    ) throw new ApiException(
      ErrorCode.CANNOT_ADD_SUCH_OBJECT_IN_SCENARIO,
      ErrorGroup.SCENARIO,
      HttpStatus.BAD_REQUEST
    );
  }

  ///  Sprawdza, czy podane wątki należą do określonego scenariusza.
  ///
  ///  @param threadIds Lista identyfikatorów wątków do sprawdzenia
  ///  @param scenarioId Identyfikator scenariusza
  ///  @throws ApiException jeśli którykolwiek z wątków nie należy do scenariusza lub jest wątkiem globalnym
  ///
  public void checkIfThreadsAreInScenario(
    List<Integer> threadIds,
    Integer scenarioId
  ) {
    if (
      scenarioRepository.checkIfExistThreadNotBelongingToScenario(
        threadIds.toArray(new Integer[0]),
        scenarioId
      )
    ) throw new ApiException(
      ErrorCode.CONFLICT_BETWEEN_SCENARIOS_IN_HEADER_AND_ENTITY,
      ErrorGroup.SCENARIO,
      HttpStatus.CONFLICT
    );
  }
}
