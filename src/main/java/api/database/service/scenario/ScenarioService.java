package api.database.service.scenario;

import static java.lang.Integer.parseInt;

import api.database.entity.scenario.QdsScenario;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.scenario.QdsScenarioRepository;
import api.database.service.configuration.ConfigurationService;
import api.database.service.core.BranchingOperations;
import api.database.service.core.ThreadBaseOperations;
import api.database.service.core.ThreadDeleteService;
import api.database.service.object.ObjectService;
import api.database.service.object.ObjectTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScenarioService {

  private final QdsScenarioRepository qdsScenarioRepository;
  private final ConfigurationService configurationService;
  private final ObjectTypeService objectTypeService;
  private final ObjectService objectService;
  private final ThreadDeleteService threadDeleteService;
  private final ThreadBaseOperations threadBaseOperations;
  private final BranchingOperations branchingOperations;

  @Autowired
  public ScenarioService(
    QdsScenarioRepository qdsScenarioRepository,
    ConfigurationService configurationService,
    ObjectTypeService objectTypeService,
    ObjectService objectService,
    ThreadDeleteService threadDeleteService,
    ThreadBaseOperations threadBaseOperations,
    BranchingOperations branchingOperations
  ) {
    this.qdsScenarioRepository = qdsScenarioRepository;
    this.configurationService = configurationService;
    this.objectTypeService = objectTypeService;
    this.objectService = objectService;
    this.threadDeleteService = threadDeleteService;
    this.threadBaseOperations = threadBaseOperations;
    this.branchingOperations = branchingOperations;
  }

  //--------------------------------------------------Pobieranie scenariusza---------------------------------------------------------
  public Page<QdsScenario> getScenarioList(Pageable pageable) {
    return qdsScenarioRepository.findAllBy(pageable);
  }

  public QdsScenario getScenarioById(Integer id) {
    return qdsScenarioRepository.findQdsScenarioById(id);
  }

  //--------------------------------------------------Dodawanie scenariusza---------------------------------------------------------
  //TODO sprawdzić
  /**
   * Funkcja dodaje nowy scenariusz a wraz z nim
   * zawarte w nim typy oraz szablony obiektów
   * @apiNote Wykonywana w ramach własnej transakcji
   */
  @Transactional
  public QdsScenario addScenario(QdsScenario scenario) {
    if (scenario.getEventDuration() == null) scenario.setEventDuration(
      parseInt(
        configurationService.getSetting("default_event_duration").value()
      )
    );

    scenario = qdsScenarioRepository.save(scenario);
    objectTypeService.addDefaultTypes(scenario.getId());
    threadBaseOperations.addGlobalThread(scenario.getId());
    return scenario;
  }

  //--------------------Usuwanie Scenariusza-------------------------------------------

  @Transactional
  public void deleteScenario(Integer scenarioId) {
    branchingOperations.deleteScenarioBranchings(scenarioId);
    threadDeleteService.deleteScenarioThreads(scenarioId);
    objectService.deleteObjectsByScenarioId(scenarioId);
    qdsScenarioRepository.deleteById(scenarioId);
    //ScenarioToObjectTemplate usuwane za pomocą ON_DELETE na kluczu obcym na scenario
    //ScenarioToObjectType usuwane za pomocą ON_DELETE na kluczu obcym na scenario
    //Permission usuwane za pomocą ON_DELETE na kluczu obcym na scenario
    //ScenarioPhase usuwane za pomocą ON_DELETE na kluczu obcym na scenario
  }

  @Transactional
  public QdsScenario updateScenario(
    Integer scenarioId,
    QdsScenario scenarioDetails
  ) {
    QdsScenario scenario = qdsScenarioRepository.findQdsScenarioById(
      scenarioId
    );
    if (scenario != null) {
      scenario.setTitle(scenarioDetails.getTitle());
      scenario.setDescription(scenarioDetails.getDescription());
      scenario.setContext(scenarioDetails.getContext());
      scenario.setPurpose(scenarioDetails.getPurpose());
      scenario.setStartDate(scenarioDetails.getStartDate());
      scenario.setEndDate(scenarioDetails.getEndDate());
      scenario.setEventDuration(scenarioDetails.getEventDuration());
      return qdsScenarioRepository.save(scenario);
    } else {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SCENARIO,
        HttpStatus.NOT_FOUND
      );
    }
  }
  //
  //  public void deleteScenario(Integer id) {
  //    qdsScenarioRepository.deleteById(id);
  //  }
}
