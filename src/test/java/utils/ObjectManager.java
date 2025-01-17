package utils;

import api.database.entity.object.ObjectType;
import api.database.entity.scenario.Scenario;
import api.database.entity.scenario.ScenarioPhase;
import api.database.model.request.composite.create.ThreadCreateRequest;
import api.database.model.request.save.ObjectTypeSaveRequest;
import api.database.model.request.save.ScenarioPhaseSaveRequest;
import api.database.model.request.save.ScenarioSaveRequest;
import api.database.model.response.ThreadResponse;
import api.database.service.global.ObjectTypeService;
import api.database.service.global.ScenarioService;
import api.database.service.scenario.ScenarioPhaseService;
import api.database.service.thread.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ObjectManager {

  @Autowired
  private ScenarioService scenarioService;

  @Autowired
  private ObjectTypeService objectTypeService;

  @Autowired
  private ThreadService threadService;

  @Autowired
  private ScenarioPhaseService scenarioPhaseService;

  public Scenario addScenarioByManager(ScenarioSaveRequest newScenario) {
    return scenarioService.addScenario(newScenario);
  }

  public ObjectType addObjectTypeByManager(
    ObjectTypeSaveRequest newObjectType,
    Integer scenarioId
  ) {
    return objectTypeService.addObjectType(newObjectType, scenarioId);
  }

  public ThreadResponse addThreadByManager(
    ThreadCreateRequest newThread,
    Integer scenarioId
  ) {
    return threadService.addThread(scenarioId, newThread);
  }

  public ScenarioPhase addScenarioPhaseByManager(
    ScenarioPhaseSaveRequest newPhase,
    Integer scenarioId
  ) {
    return scenarioPhaseService.addScenarioPhase(newPhase, scenarioId);
  }
}
