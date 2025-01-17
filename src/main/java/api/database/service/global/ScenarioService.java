package api.database.service.global;

import api.database.entity.scenario.Scenario;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.save.ScenarioSaveRequest;
import api.database.repository.scenario.ScenarioRepository;
import api.database.security.PermissionService;
import api.database.service.core.BranchingDeleter;
import api.database.service.core.ThreadAdder;
import api.database.service.core.ThreadRemovalService;
import api.database.service.object.ObjectInstanceService;
import api.database.service.operations.ScenarioValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScenarioService {

  private final ScenarioRepository scenarioRepository;
  private final ObjectInstanceService objectInstanceService;
  private final ScenarioValidator scenarioValidator;
  private final ThreadAdder threadAdder;
  private final BranchingDeleter branchingDeleter;
  private final PermissionService permissionService;
  private final ThreadRemovalService threadRemovalService;

  @Autowired
  public ScenarioService(
    ScenarioRepository scenarioRepository,
    ObjectInstanceService objectInstanceService,
    ScenarioValidator scenarioValidator,
    ThreadAdder threadAdder,
    BranchingDeleter branchingDeleter,
    PermissionService permissionService,
    ThreadRemovalService threadRemovalService
  ) {
    this.scenarioRepository = scenarioRepository;
    this.objectInstanceService = objectInstanceService;
    this.scenarioValidator = scenarioValidator;
    this.threadAdder = threadAdder;
    this.branchingDeleter = branchingDeleter;
    this.permissionService = permissionService;
    this.threadRemovalService = threadRemovalService;
  }

  //--------------------------------------------------Pobieranie scenariusza---------------------------------------------------------

  public Scenario getScenarioById(Integer id) {
    Scenario scenario = scenarioRepository.findQdsScenarioById(id);
    if (scenario == null) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SCENARIO,
        HttpStatus.NOT_FOUND
      );
    }
    return scenario;
  }

  public Page<Scenario> findAll(Pageable pageable) {
    return scenarioRepository.findAll(pageable);
  }

  public Page<Scenario> findByTitleContaining(String title, Pageable pageable) {
    return scenarioRepository.findByTitleContaining(title, pageable);
  }

  public Page<Scenario> findByDescriptionContaining(
    String description,
    Pageable pageable
  ) {
    return scenarioRepository.findByDescriptionContaining(
      description,
      pageable
    );
  }

  //--------------------------------------------------Dodawanie scenariusza---------------------------------------------------------
  //TODO sprawdzić
  /**
   * Funkcja dodaje nowy scenariusz a wraz z nim
   * zawarte w nim typy oraz szablony obiektów
   * @apiNote Wykonywana w ramach własnej transakcji
   */
  @Transactional
  public Scenario addScenario(ScenarioSaveRequest scenarioInfo) {
    if (
      scenarioInfo.startDate().isAfter(scenarioInfo.endDate())
    ) throw new ApiException(
      ErrorCode.END_BEFORE_START,
      ErrorGroup.SCENARIO,
      HttpStatus.BAD_REQUEST
    );

    Scenario scenario = Scenario.create(scenarioInfo);

    scenario = scenarioRepository.save(scenario);
    scenarioValidator.addDefaultTypes(scenario.getId());
    threadAdder.addGlobalThread(scenario.getId());
    permissionService.addAuthor(scenario.getId());
    return scenario;
  }

  //--------------------Usuwanie Scenariusza-------------------------------------------

  @Transactional
  public void deleteScenario(Integer scenarioId) {
    branchingDeleter.deleteScenarioBranchings(scenarioId);
    threadRemovalService.deleteScenarioThreads(scenarioId);
    objectInstanceService.deleteObjectsByScenarioId(scenarioId);
    scenarioRepository.deleteById(scenarioId);
    //ScenarioToObjectTemplate usuwane za pomocą ON_DELETE na kluczu obcym na scenario
    //ScenarioToObjectType usuwane za pomocą ON_DELETE na kluczu obcym na scenario
    //Permission usuwane za pomocą ON_DELETE na kluczu obcym na scenario
    //ScenarioPhase usuwane za pomocą ON_DELETE na kluczu obcym na scenario
  }

  @Transactional
  public Scenario updateScenario(
    Integer scenarioId,
    ScenarioSaveRequest scenarioDetails
  ) {
    Scenario scenario = scenarioRepository.findQdsScenarioById(scenarioId);
    if (scenario != null) {
      scenario.setTitle(scenarioDetails.title());
      scenario.setDescription(scenarioDetails.description());
      scenario.setContext(scenarioDetails.context());
      scenario.setPurpose(scenarioDetails.purpose());
      scenario.setStartDate(scenarioDetails.startDate());
      scenario.setEndDate(scenarioDetails.endDate());
      scenario.setEventDuration(scenarioDetails.eventDuration());
      scenario.setEventUnit(scenarioDetails.eventUnit());
      return scenarioRepository.save(scenario);
    } else {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SCENARIO,
        HttpStatus.NOT_FOUND
      );
    }
  }
}
