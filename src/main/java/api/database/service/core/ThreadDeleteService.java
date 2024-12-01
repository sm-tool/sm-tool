package api.database.service.core;

import api.database.entity.event.QdsEvent;
import api.database.model.QdsResponseUpdateList;
import api.database.model.branching.QdsResponseBranching;
import api.database.model.constant.QdsEventType;
import api.database.model.internal.thread.QdsInternalIncorrectJoin;
import api.database.model.internal.thread.QdsInternalThreadRemovalBatch;
import api.database.repository.event.QdsEventRepository;
import api.database.repository.thread.QdsBranchingRepository;
import api.database.repository.thread.QdsThreadRepository;
import api.database.repository.thread.ThreadDeleteRepository;
import jakarta.transaction.Transactional;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//TODO zrobić cokolwiek żeby było widać że jest na niższym pozomie niż zwykłe serwisy ale na wyższym niż operacje
@Service
public class ThreadDeleteService {

  private final QdsThreadRepository qdsThreadRepository;
  private final ThreadEventOperations threadEventOperations;
  private final ThreadObjectManagement threadObjectManagement;
  private final ThreadDeleteRepository threadDeleteRepository;
  private final QdsBranchingRepository qdsBranchingRepository;
  private final EventBaseOperations eventBaseOperations;
  private final ObjectDeleteOperations objectDeleteOperations;
  private final BranchingOperations branchingOperations;
  private final QdsEventRepository qdsEventRepository;

  /// Zarządza usuwaniem wątków wraz z ich powiązaniami.
  /// Obsługuje różne przypadki usuwania w zależności od typu wątku:
  /// - Wątki pojedyncze (START -> END)
  /// - Wątki po operacji join (JOIN_OUT -> END)
  /// - Wątki rozgałęzione (po operacji fork)
  /// - Wątki całego scenariusza
  @Autowired
  public ThreadDeleteService(
    QdsThreadRepository qdsThreadRepository,
    ThreadEventOperations threadEventOperations,
    ThreadObjectManagement threadObjectManagement,
    ThreadDeleteRepository threadDeleteRepository,
    QdsBranchingRepository qdsBranchingRepository,
    EventBaseOperations eventBaseOperations,
    ObjectDeleteOperations objectDeleteOperations,
    BranchingOperations branchingOperations,
    QdsEventRepository qdsEventRepository
  ) {
    this.qdsThreadRepository = qdsThreadRepository;
    this.threadEventOperations = threadEventOperations;
    this.threadObjectManagement = threadObjectManagement;
    this.threadDeleteRepository = threadDeleteRepository;
    this.qdsBranchingRepository = qdsBranchingRepository;
    this.eventBaseOperations = eventBaseOperations;
    this.objectDeleteOperations = objectDeleteOperations;
    this.branchingOperations = branchingOperations;
    this.qdsEventRepository = qdsEventRepository;
  }

  void deleteObjectOperationsAfterTime(Integer threadId, Integer eventTime) {
    List<Integer> objectIds = threadObjectManagement.getThreadObjects(threadId);
    objectDeleteOperations.deleteObjectInformationAfterTime(
      eventTime,
      objectIds
    );
    System.out.println("Deleted " + objectIds.size() + " objects");
  }

  @Transactional
  public QdsResponseUpdateList removeThread(
    Integer scenarioId,
    Integer threadId
  ) {
    List<String> updateList;
    // Sprawdzamy pierwszy event wątku
    QdsEvent firstEvent = eventBaseOperations.getFirstEvent(threadId);
    //Dla wątku ze START
    if (firstEvent.getEventType() == QdsEventType.START) {
      //Usuwanie obiektów
      threadObjectManagement.deleteObjectsFromStartThread(threadId);
      //Atrybuty obiektu usuwane za pomocą ON_DELETE na kluczu obcym na object
      //Asocjacje usuwane za pomocą ON_DELETE na kluczu obcym na object
      //Zmiany atrybutów usuwane za pomocą ON_DELETE na kluczu obcym na atrybutach
      //Zmiany asocjacji usuwane za pomocą ON_DELETE na kluczu obcym na asocjacjach
      //ThreadToObject usuwane za pomocą ON_DELETE na kluczu obcym na object
      //UserToObject usuwane za pomocą ON_DELETE na kluczu obcym na object
      //Usuwamy wątki
      removeThreadsRecursively(threadId);
      handleRemainingJoins(scenarioId);
      updateList = List.of("thread", "branching", "event", "object");
    } else if (firstEvent.getEventType() == QdsEventType.FORK_OUT) {
      deleteObjectOperationsAfterTime(threadId, firstEvent.getEventTime());
      // Oznaczamy FORK jako niepoprawny
      Integer forkId = firstEvent.getBranchingId();
      branchingOperations.markAsIncorrect(forkId);
      // i usuwamy wątki
      removeThreadsRecursively(threadId);
      handleRemainingJoins(scenarioId);
      updateList = List.of("thread", "branching", "event");
    } else /*if (firstEvent.getEventType() == QdsEventType.JOIN_OUT)*/{
      //Usuwanie obiektów
      deleteObjectOperationsAfterTime(threadId, firstEvent.getEventTime());

      threadEventOperations.replaceJoinEvents(firstEvent.getBranchingId());
      qdsEventRepository.deleteById(firstEvent.getId());
      branchingOperations.deleteBranchings(
        List.of(firstEvent.getBranchingId())
      );

      // Usuwamy wątki
      removeThreadsRecursively(threadId);
      // Dla tych JOINów które zostają (nie są w allBranchingsToDelete)
      // trzeba zmienić eventy końcowe na END
      handleRemainingJoins(scenarioId);
      updateList = List.of("thread", "branching", "event");
    }
    return new QdsResponseUpdateList(updateList);
  }

  private void handleRemainingJoins(Integer scenarioId) {
    List<QdsInternalIncorrectJoin> incorrectJoins =
      threadDeleteRepository.getIncorrectJoins(scenarioId);
    System.out.println(incorrectJoins);
    System.out.println("Tutaj pewnie?");
    qdsBranchingRepository.fixIncorrectJoins(
      incorrectJoins
        .stream()
        .map(QdsInternalIncorrectJoin::inputThreadId)
        .toArray(Integer[]::new),
      incorrectJoins
        .stream()
        .map(QdsInternalIncorrectJoin::outputThreadId)
        .toArray(Integer[]::new),
      incorrectJoins
        .stream()
        .map(QdsInternalIncorrectJoin::joinId)
        .toArray(Integer[]::new)
    );
    branchingOperations.deleteEventsForBranchings(
      incorrectJoins
        .stream()
        .map(QdsInternalIncorrectJoin::joinId)
        .toArray(Integer[]::new)
    );
    qdsBranchingRepository.deleteBranchingByIds(
      incorrectJoins
        .stream()
        .map(QdsInternalIncorrectJoin::joinId)
        .toArray(Integer[]::new)
    );
  }

  //------------------------------------Usuwanie scenariusza
  /// Usuwa wszystkie wątki dla scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  public void deleteScenarioThreads(Integer scenarioId) {
    List<Integer> threadIds = qdsThreadRepository.getScenarioThreadIds(
      scenarioId
    );
    threadEventOperations.deleteThreadsEvents(threadIds);
    //Zmiany atrybutów usuwane za pomocą ON_DELETE na kluczu obcym na event
    //Zmiany asocjacji usuwane za pomocą ON_DELETE na kluczu obcym na event
    qdsThreadRepository.deleteThreadsByScenarioId(scenarioId);
    //ThreadToObject usuwane za pomocą ON_DELETE na kluczu obcym na thread
  }

  public void removeThreadsRecursively(Integer threadId) {
    // Pierwszy batch z FORKami
    QdsInternalThreadRemovalBatch batch =
      threadDeleteRepository.findThreadsToRemove(threadId);
    Set<Integer> allThreadsToDelete = new HashSet<>(batch.threadsToDelete());
    Set<Integer> allBranchingsToDelete = new HashSet<>(batch.forksToDelete());
    // Przetwarzamy JOINy
    Queue<Integer> joinsToProcess = new LinkedList<>(batch.joinsToCheck());
    while (!joinsToProcess.isEmpty()) {
      Integer joinId = joinsToProcess.poll();
      QdsResponseBranching joinInfo = qdsBranchingRepository.getOneBranching(
        joinId
      );
      // Sprawdzamy czy wszystkie wejścia do JOINa są w wątkach do usunięcia
      List<Integer> joinInputThreads = Arrays.asList(joinInfo.comingIn());
      if (allThreadsToDelete.containsAll(joinInputThreads)) {
        // Jeśli tak - znajdujemy wątek wychodzący z JOINa i powtarzamy proces
        Integer outThread = joinInfo.comingOut()[0]; //Dla join zawsze jest jeden
        QdsInternalThreadRemovalBatch nextBatch =
          threadDeleteRepository.findThreadsToRemove(outThread);

        allThreadsToDelete.addAll(nextBatch.threadsToDelete());
        allBranchingsToDelete.addAll(nextBatch.forksToDelete());
        joinsToProcess.addAll(nextBatch.joinsToCheck());

        // JOIN też trzeba usunąć
        allBranchingsToDelete.add(joinId);
      }
    }
    deleteThreadsAndBranchings(allThreadsToDelete, allBranchingsToDelete);
  }

  private void deleteThreadsAndBranchings(
    Set<Integer> allThreadsToDelete,
    Set<Integer> allBranchingsToDelete
  ) {
    //Usuwanie eventów dla wątków
    threadEventOperations.deleteThreadsEvents(
      allThreadsToDelete.stream().toList()
    );
    //Zmiany atrybutów usuwane za pomocą ON_DELETE na kluczu obcym na event
    //Zmiany asocjacji usuwane za pomocą ON_DELETE na kluczu obcym na event
    branchingOperations.deleteBranchings(allBranchingsToDelete);
    //Usunięcie wszystkich branchingów
    //Usunięcie samych wątków
    qdsThreadRepository.deleteThreadsById(
      allThreadsToDelete.toArray(new Integer[0])
    );
  }
}
