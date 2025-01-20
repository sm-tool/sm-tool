package api.database.service.core;

import api.database.entity.event.Event;
import api.database.model.data.BranchingData;
import api.database.model.domain.thread.InternalThreadRemovalAnalysis;
import api.database.repository.thread.ThreadRepository;
import api.database.service.core.internal.ThreadObjectCleaner;
import api.database.service.core.internal.ThreadRemovalAnalyzer;
import api.database.service.core.provider.BranchingProvider;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ThreadRemovalService {

  private final ThreadRemovalAnalyzer analyzer;
  private final ThreadObjectCleaner objectCleaner;
  private final EventManager eventManager;
  private final ObjectInstanceTransfer objectInstanceTransfer;
  private final BranchingProvider branchingProvider;
  private final BranchingDeleter branchingDeleter;
  private final ThreadRepository threadRepository;
  private final IdleEventManager idleEventManager;
  private final ScenarioManager scenarioManager;

  @Autowired
  public ThreadRemovalService(
    ThreadRemovalAnalyzer analyzer,
    ThreadObjectCleaner objectCleaner,
    EventManager eventManager,
    ObjectInstanceTransfer objectInstanceTransfer,
    BranchingProvider branchingProvider,
    BranchingDeleter branchingDeleter,
    ThreadRepository threadRepository,
    IdleEventManager idleEventManager,
    ScenarioManager scenarioManager
  ) {
    this.analyzer = analyzer;
    this.objectCleaner = objectCleaner;
    this.eventManager = eventManager;
    this.objectInstanceTransfer = objectInstanceTransfer;
    this.branchingProvider = branchingProvider;
    this.branchingDeleter = branchingDeleter;
    this.threadRepository = threadRepository;
    this.idleEventManager = idleEventManager;
    this.scenarioManager = scenarioManager;
  }

  @Transactional
  public void removeThread(Integer scenarioId, Integer threadId) {
    scenarioManager.checkIfThreadsAreInScenario(List.of(threadId), scenarioId);
    Event firstEvent = eventManager.getFirstEvent(threadId);

    switch (firstEvent.getEventType()) {
      case START -> handleStartThread(threadId, scenarioId);
      case FORK_OUT -> handleForkOutThread(threadId, firstEvent, scenarioId);
      case JOIN_OUT -> handleJoinOutThread(threadId, firstEvent, scenarioId);
    }
  }

  private void handleStartThread(Integer threadId, Integer scenarioId) {
    objectCleaner.cleanObjectsFromStartThread(threadId);
    removeThreadWithDependencies(threadId, scenarioId);
  }

  private void handleForkOutThread(
    Integer threadId,
    Event firstEvent,
    Integer scenarioId
  ) {
    objectCleaner.cleanObjectOperationsAfterTime(
      threadId,
      firstEvent.getEventTime(),
      scenarioId
    );

    BranchingData branchingData = branchingProvider.getOneBranching(
      firstEvent.getBranchingId()
    );
    if (branchingData.comingOut().length == 1) {
      branchingDeleter.deleteBranchings(List.of(firstEvent.getBranchingId()));
      eventManager.ensureEndEvents(branchingData.comingIn());
      idleEventManager.cleanupIdleEvents(scenarioId);
    } else if (
      !branchingData
        .objectTransfer()
        .stream()
        .filter(t -> t.id().equals(firstEvent.getThreadId()))
        .findFirst() //Id pobrane z eventu - musi istnieć
        .get()
        .objectIds()
        .isEmpty()
    ) {
      //Tylko gdy były przekazane obiekty do danego wątku
      objectInstanceTransfer.markForkAsIncorrect(firstEvent.getBranchingId());
    }
    removeThreadWithDependencies(threadId, scenarioId);
  }

  private void handleJoinOutThread(
    Integer threadId,
    Event firstEvent,
    Integer scenarioId
  ) {
    objectCleaner.cleanObjectOperationsAfterTime(
      threadId,
      firstEvent.getEventTime(),
      scenarioId
    );

    BranchingData branchingData = branchingProvider.getOneBranching(
      firstEvent.getBranchingId()
    );
    branchingDeleter.deleteBranchings(List.of(firstEvent.getBranchingId()));
    eventManager.ensureEndEvents(branchingData.comingIn());
    idleEventManager.cleanupIdleEvents(scenarioId);

    removeThreadWithDependencies(threadId, scenarioId);
  }

  private void removeThreadWithDependencies(
    Integer threadId,
    Integer scenarioId
  ) {
    var analysis = analyzer.analyze(threadId);
    executeRemoval(analysis, scenarioId);
    handleOneToOneJoins(analysis.oneToOneJoins());
  }

  public void deleteScenarioThreads(Integer scenarioId) {
    List<Integer> threadIds = threadRepository.getScenarioThreadIds(scenarioId);
    eventManager.deleteThreadsEvents(threadIds);
    threadRepository.deleteThreadsById(threadIds.toArray(new Integer[0]));
  }

  public void removeThreadsAfterMove(Integer[] threadIds) {
    threadRepository.deleteThreadsById(threadIds);
  }

  private void executeRemoval(
    InternalThreadRemovalAnalysis analysis,
    Integer scenarioId
  ) {
    eventManager.deleteThreadsEvents(
      analysis.threadsToDelete().stream().toList()
    );
    branchingDeleter.deleteBranchings(analysis.branchingsToDelete());
    threadRepository.deleteThreadsById(
      analysis.threadsToDelete().toArray(new Integer[0])
    );
  }

  private void handleOneToOneJoins(List<Integer> joins) {
    if (joins.isEmpty()) return;
    List<BranchingData> branchingData = branchingProvider.getBranchingsByIds(
      joins
    );
    branchingDeleter.deleteBranchings(joins);
    // Wypełnienie pustej przestrzeni po eventach FORKa
    for (BranchingData join : branchingData) {
      idleEventManager.fillWithIdleEvents(
        join.comingIn()[0],
        join.time(),
        join.time() + 1
      );
    }

    eventManager.moveEventsBetweenThreads(
      branchingData.stream().map(b -> b.comingOut()[0]).toArray(Integer[]::new),
      branchingData.stream().map(b -> b.comingIn()[0]).toArray(Integer[]::new),
      0
    );

    removeThreadsAfterMove(
      branchingData.stream().map(b -> b.comingOut()[0]).toArray(Integer[]::new)
    );
  }
}
