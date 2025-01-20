package api.database.service.global;

import api.database.entity.scenario.Scenario;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.save.ScenarioSaveRequest;
import api.database.repository.scenario.ScenarioRepository;
import api.database.security.PermissionService;
import api.database.service.core.BranchingDeleter;
import api.database.service.core.ScenarioManager;
import api.database.service.core.ThreadAdder;
import api.database.service.core.ThreadRemovalService;
import api.database.service.object.ObjectInstanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScenarioService {

  private final ScenarioRepository scenarioRepository;
  private final ObjectInstanceService objectInstanceService;
  private final ScenarioManager scenarioManager;
  private final ThreadAdder threadAdder;
  private final BranchingDeleter branchingDeleter;
  private final PermissionService permissionService;
  private final ThreadRemovalService threadRemovalService;

  @Autowired
  public ScenarioService(
    ScenarioRepository scenarioRepository,
    ObjectInstanceService objectInstanceService,
    ScenarioManager scenarioManager,
    ThreadAdder threadAdder,
    BranchingDeleter branchingDeleter,
    PermissionService permissionService,
    ThreadRemovalService threadRemovalService
  ) {
    this.scenarioRepository = scenarioRepository;
    this.objectInstanceService = objectInstanceService;
    this.scenarioManager = scenarioManager;
    this.threadAdder = threadAdder;
    this.branchingDeleter = branchingDeleter;
    this.permissionService = permissionService;
    this.threadRemovalService = threadRemovalService;
  }

  //--------------------------------------------------Pobieranie scenariusza---------------------------------------------------------

  public Scenario getScenarioById(Integer id) {
    permissionService.checkPermission("GET", id);
    return scenarioRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.SCENARIO,
          HttpStatus.NOT_FOUND
        )
      );
  }

  public Page<Scenario> findAll(Pageable pageable) {
    String userId = permissionService.getUser();
    return scenarioRepository.findAllForUser(userId, pageable);
  }

  public Page<Scenario> findByTitleContaining(String title, Pageable pageable) {
    String userId = permissionService.getUser();
    return scenarioRepository.findByTitleContaining(title, userId, pageable);
  }

  public Page<Scenario> findByDescriptionContaining(
    String description,
    Pageable pageable
  ) {
    String userId = permissionService.getUser();
    return scenarioRepository.findByDescriptionContaining(
      description,
      userId,
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
    scenarioManager.addDefaultTypes(scenario.getId());
    threadAdder.addGlobalThread(scenario.getId());
    permissionService.addAuthor(scenario.getId());
    return scenario;
  }

  //--------------------Usuwanie Scenariusza-------------------------------------------

  @Transactional
  public void deleteScenario(Integer scenarioId) {
    permissionService.checkIfAuthor(scenarioId);
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
    permissionService.checkPermission("PUT", scenarioId);
    Scenario scenario = scenarioRepository
      .findById(scenarioId)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.SCENARIO,
          HttpStatus.NOT_FOUND
        )
      );
    scenario.setTitle(scenarioDetails.title());
    scenario.setDescription(scenarioDetails.description());
    scenario.setContext(scenarioDetails.context());
    scenario.setPurpose(scenarioDetails.purpose());
    scenario.setStartDate(scenarioDetails.startDate());
    scenario.setEndDate(scenarioDetails.endDate());
    scenario.setEventDuration(scenarioDetails.eventDuration());
    scenario.setEventUnit(scenarioDetails.eventUnit());
    return scenarioRepository.save(scenario);
  }
}
