package api.database.service.core;

import api.database.entity.event.Event;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.EventType;
import api.database.model.domain.thread.InternalTimeShiftAnalysis;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.ThreadShiftRequest;
import api.database.repository.special.TimeShiftRepository;
import api.database.service.core.internal.TimeShiftAnalyzer;
import api.database.service.core.provider.GlobalThreadProvider;
import api.database.service.event.EventProvider;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ThreadShifter {

  private final TimeShiftAnalyzer analyzer;
  private final EventProvider eventProvider;
  private final TimeShiftRepository timeShiftRepository;
  private final ScenarioManager scenarioManager;
  private final IdleEventManager idleEventManager;
  private final GlobalThreadProvider globalThreadProvider;

  public ThreadShifter(
    TimeShiftAnalyzer analyzer,
    EventProvider eventProvider,
    TimeShiftRepository timeShiftRepository,
    ScenarioManager scenarioManager,
    IdleEventManager idleEventManager,
    GlobalThreadProvider globalThreadProvider
  ) {
    this.analyzer = analyzer;
    this.eventProvider = eventProvider;
    this.timeShiftRepository = timeShiftRepository;
    this.scenarioManager = scenarioManager;
    this.idleEventManager = idleEventManager;
    this.globalThreadProvider = globalThreadProvider;
  }

  @Transactional
  public void shift(
    ThreadShiftRequest request,
    Integer threadId,
    Integer scenarioId
  ) {
    scenarioManager.checkIfThreadsAreInScenario(List.of(threadId), scenarioId);
    // Gdyż wtedy event skończyłby na ujemnej pozycji
    if (request.time() - request.shift() < -1) throw new ApiException(
      ErrorCode.CANNOT_MOVE_EVENTS,
      ErrorGroup.EVENT,
      HttpStatus.BAD_REQUEST
    );

    Integer globalThreadId = globalThreadProvider.getGlobalThreadId(scenarioId);
    Integer effectiveThreadId = threadId == 0 ? globalThreadId : threadId;
    // 1. Sprawdź możliwość przesunięcia w wątku startowym
    List<Event> threadEvents = eventProvider.getEventsForThreadWithoutChanges(
      threadId,
      scenarioId
    );
    Integer firstEventTime = threadEvents.getFirst().getEventTime();
    // Sprawdź czy nie ma eventów między czasami dla przesunięcia w tył
    if (request.shift() < 0) {
      boolean hasEventsInRange = threadEvents
        .stream()
        .anyMatch(
          e ->
            e.getEventTime() > request.time() + request.shift() &&
            e.getEventTime() <= request.time() &&
            e.getEventType() != EventType.IDLE
        );
      if (hasEventsInRange) {
        throw new ApiException(
          ErrorCode.CANNOT_MOVE_EVENTS,
          List.of(threadId.toString()),
          ErrorGroup.EVENT,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // 2. Wykonaj analizę dla pozostałych wątków
    InternalTimeShiftAnalysis analysis = analyzer.analyze(
      effectiveThreadId,
      request.shift()
    );
    System.out.println(analysis);
    // 3. Wykonaj przesunięcia
    // Najpierw przesuń eventy w wątku startowym po zadanym czasie
    if (request.shift() < 0) {
      idleEventManager.cleanIdleEvents(
        effectiveThreadId,
        request.time() + request.shift() + 1,
        request.time() + 1
      );
    }
    timeShiftRepository.shiftEventsAfterTime(
      effectiveThreadId,
      request.time(),
      request.shift()
    );
    if (firstEventTime <= request.time() && request.shift() > 0) {
      idleEventManager.fillWithIdleEvents(
        effectiveThreadId,
        request.time() + 1,
        request.time() + 1 + request.shift()
      );
    }
    System.out.println(request.toString() + request.shift());

    Integer[] threadsToShift = analysis
      .threadsToShift()
      .stream()
      .filter(t -> !Objects.equals(t, effectiveThreadId))
      .toArray(Integer[]::new);
    // Potem przesuń pozostałe wątki
    timeShiftRepository.shiftEventsInThreads(threadsToShift, request.shift());

    // Zaktualizuj czasy branching
    timeShiftRepository.shiftBranchingTimes(
      analysis.branchingsToShift().toArray(Integer[]::new),
      request.shift()
    );

    // Na końcu wyrównaj czasy eventów branching
    timeShiftRepository.alignBranchingEventsInScenario(scenarioId);
    idleEventManager.cleanupIdleEvents(scenarioId);
    for (var thread : analysis.threadsToFill().entrySet()) {
      idleEventManager.fillWithIdleEvents(
        thread.getKey(),
        thread.getValue(),
        thread.getValue() + request.shift()
      );
    }
  }
}
