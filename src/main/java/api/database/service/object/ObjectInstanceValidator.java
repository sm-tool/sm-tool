package api.database.service.object;

import api.database.entity.event.Event;
import api.database.entity.object.ObjectTemplate;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.EventType;
import api.database.model.exception.ApiException;
import api.database.model.request.create.ObjectInstanceCreateRequest;
import api.database.service.core.EventManager;
import api.database.service.core.ObjectTypeManager;
import api.database.service.core.ScenarioManager;
import api.database.service.core.provider.GlobalThreadProvider;
import api.database.service.core.provider.ObjectTemplateProvider;
import java.util.List;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ObjectInstanceValidator {

  private final GlobalThreadProvider globalThreadProvider;
  private final ObjectTemplateProvider objectTemplateProvider;
  private final EventManager eventManager;
  private final ObjectTypeManager objectTypeManager;
  private final ScenarioManager scenarioManager;

  public ObjectInstanceValidator(
    GlobalThreadProvider globalThreadProvider,
    ObjectTemplateProvider objectTemplateProvider,
    EventManager eventManager,
    ObjectTypeManager objectTypeManager,
    ScenarioManager scenarioManager
  ) {
    this.globalThreadProvider = globalThreadProvider;
    this.objectTemplateProvider = objectTemplateProvider;
    this.eventManager = eventManager;
    this.objectTypeManager = objectTypeManager;
    this.scenarioManager = scenarioManager;
  }

  private Pair<Integer, Integer> verifyThreads(
    Integer threadId,
    Integer scenarioId
  ) {
    //Pobranie globalnego wątku
    Integer globalThreadId = globalThreadProvider.getGlobalThreadId(scenarioId);
    // Weryfikacja istnienia scenariusza
    if (globalThreadId == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      List.of(scenarioId.toString()),
      ErrorGroup.SCENARIO,
      HttpStatus.BAD_REQUEST
    );
    //Weryfikacja poprawności scenario-thread
    scenarioManager.checkIfThreadsAreInScenario(List.of(threadId), scenarioId);
    // Wątek ze Startem
    Event firstEvent = eventManager.getFirstEvent(
      (threadId == 0) ? globalThreadId : threadId
    );
    if (firstEvent.getEventType() != EventType.START) throw new ApiException(
      ErrorCode.TRIED_TO_CREATE_OBJECT_ON_THREAD_WITHOUT_START_EVENT,
      ErrorGroup.OBJECT,
      HttpStatus.BAD_REQUEST
    );
    return Pair.of(
      (threadId == 0) ? globalThreadId : threadId,
      firstEvent.getId()
    );
  }

  private void verifyObjectTemplateAndType(
    Integer templateId,
    Integer objectTypeId,
    Integer scenarioId,
    Boolean isGlobalObject
  ) {
    ObjectTemplate template = objectTemplateProvider.getTemplateById(
      templateId
    );

    scenarioManager.checkIfCanAddObjectToScenario(scenarioId, templateId);
    // Sprawdzanie typu obiektu
    if (
      !template.getObjectTypeId().equals(objectTypeId)
    ) throw new ApiException(
      ErrorCode.INCOMPATIBLE_TYPES,
      ErrorGroup.OBJECT,
      HttpStatus.CONFLICT
    );

    objectTypeManager.checkForGlobalObjectType(objectTypeId, isGlobalObject);
  }

  /// Weryfikuje możliwość utworzenia obiektu w danym kontekście.
  /// Sprawdza:
  /// - Poprawność typu względem globalności
  /// - Dostępność typu i szablonu w scenariuszu
  /// - Obecność eventu START w wątku
  ///
  /// @param scenarioId id scenariusza
  /// @return id wątku (globalny lub oryginalny)
  public Pair<Integer, Integer> verifyObject(
    Integer scenarioId,
    ObjectInstanceCreateRequest info
  ) {
    Pair<Integer, Integer> threadWithFirstEvent = verifyThreads(
      info.originThreadId(),
      scenarioId
    );
    // Szablony obiektu i typy
    verifyObjectTemplateAndType(
      info.templateId(),
      info.objectTypeId(),
      scenarioId,
      info.originThreadId() == 0
    );
    return threadWithFirstEvent;
  }
}
