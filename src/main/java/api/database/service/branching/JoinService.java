package api.database.service.branching;

import api.database.entity.thread.Branching;
import api.database.model.constant.BranchingType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.EventType;
import api.database.model.data.BranchingData;
import api.database.model.domain.thread.InternalThreadBasicInfo;
import api.database.model.domain.transfer.InternalTransferPairs;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.create.JoinCreateRequest;
import api.database.model.request.composite.update.JoinUpdateRequest;
import api.database.repository.branching.BranchingRepository;
import api.database.service.core.*;
import api.database.service.core.provider.BranchingProvider;
import api.database.service.core.provider.ObjectInstanceProvider;
import api.database.service.core.validator.BranchingValidator;
import jakarta.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class JoinService {

  private final BranchingRepository branchingRepository;
  private final BranchingValidator branchingValidator;
  private final EventManager eventManager;
  private final ObjectInstanceProvider objectInstanceProvider;
  private final ObjectInstanceTransfer objectInstanceTransfer;
  private final OffspringAdder offspringAdder;
  private final BranchingProvider branchingProvider;
  private final ThreadRemovalService threadRemovalService;
  private final IdleEventManager idleEventManager;
  private final BranchingDeleter branchingDeleter;

  @Autowired
  public JoinService(
    BranchingRepository branchingRepository,
    BranchingValidator branchingValidator,
    EventManager eventManager,
    ObjectInstanceProvider objectInstanceProvider,
    ObjectInstanceTransfer objectInstanceTransfer,
    OffspringAdder offspringAdder,
    BranchingProvider branchingProvider,
    ThreadRemovalService threadRemovalService,
    IdleEventManager idleEventManager,
    BranchingDeleter branchingDeleter
  ) {
    this.branchingRepository = branchingRepository;
    this.branchingValidator = branchingValidator;
    this.eventManager = eventManager;
    this.objectInstanceProvider = objectInstanceProvider;
    this.objectInstanceTransfer = objectInstanceTransfer;
    this.offspringAdder = offspringAdder;
    this.branchingProvider = branchingProvider;
    this.threadRemovalService = threadRemovalService;
    this.idleEventManager = idleEventManager;
    this.branchingDeleter = branchingDeleter;
  }

  //--------------------------------------------------Dodawanie rozgałęzień---------------------------------------------------------

  //TODO - sprawdzić
  /// Dodaje nową operację łączenia wątków.
  /// Proces łączenia:
  /// 1. Weryfikuje czy nie łączymy wątku globalnego
  /// 2. Tworzy wpis operacji join w bazie
  /// 3. Tworzy nowy wątek wynikowy (z eventami JOIN_OUT i END)
  /// 4. Dla każdego łączonego wątku:
  ///    - Zmienia jego ostatni event na JOIN_IN
  ///    - Transferuje jego obiekty do wątku wynikowego
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param info dane operacji join
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public void addJoin(Integer scenarioId, JoinCreateRequest info) {
    branchingValidator.checkThreads(info.threadIdsToJoin(), scenarioId);

    Integer joinId = createJoinBranching(scenarioId, info);
    Integer firstThreadId = info.threadIdsToJoin().getFirst();

    eventManager.changeLastEventInIncomingThreadForBranching(
      firstThreadId,
      info.joinTime(),
      joinId,
      BranchingType.JOIN
    );

    Map<Integer, List<Integer>> objectsAssignedToThreads =
      objectInstanceProvider.getObjectsIdsAssignedToThreads(
        info.threadIdsToJoin()
      );

    Integer outputThreadId = createOutputThread(
      joinId,
      info,
      firstThreadId,
      objectsAssignedToThreads.getOrDefault(firstThreadId, List.of()),
      scenarioId
    );

    setupRemainingThreads(
      info.threadIdsToJoin(),
      info.joinTime(),
      joinId,
      true
    );

    transferObjects(
      objectsAssignedToThreads,
      outputThreadId,
      firstThreadId,
      scenarioId
    );
  }

  private Integer createJoinBranching(
    Integer scenarioId,
    JoinCreateRequest info
  ) {
    return branchingRepository
      .save(Branching.createJoin(info, scenarioId))
      .getId();
  }

  private Integer createOutputThread(
    Integer joinId,
    JoinCreateRequest info,
    Integer sourceThreadId,
    List<Integer> objectsToTransfer,
    Integer scenarioId
  ) {
    return offspringAdder.addFirstOffspring(
      InternalThreadBasicInfo.from(info),
      info.joinTime(),
      sourceThreadId,
      joinId,
      objectsToTransfer,
      BranchingType.JOIN,
      scenarioId
    );
  }

  private void setupRemainingThreads(
    List<Integer> threadIdsToJoin,
    Integer joinTime,
    Integer joinId,
    boolean skipFirst
  ) {
    threadIdsToJoin
      .stream()
      .skip(skipFirst ? 1 : 0) // pomijamy pierwszy wątek dla dodawania nowego JOIN
      .forEach(threadId -> {
        eventManager.changeLastEventForJoin(threadId, joinTime, joinId);
      });
  }

  private void transferObjects(
    Map<Integer, List<Integer>> objectsAssignedToThreads,
    Integer outputThreadId,
    Integer firstThreadId,
    Integer scenarioId
  ) {
    List<Integer> existingObjects = objectsAssignedToThreads.getOrDefault(
      firstThreadId,
      List.of()
    );

    // Zbieramy wszystkie obiekty ze wszystkich wątków
    List<Integer> allObjects = objectsAssignedToThreads
      .values()
      .stream()
      .flatMap(List::stream)
      .distinct()
      .toList();

    InternalTransferPairs pairs = objectInstanceTransfer.getPairs(
      List.of(existingObjects), // obiekty już przeniesione z pierwszego wątku
      List.of(allObjects), // docelowy stan - obiekty ze wszystkich wątków
      List.of(outputThreadId) // wątek wyjściowy
    );

    objectInstanceTransfer.handleObjectTransfers(pairs, scenarioId);
  }

  //-----------------------------------------------Zmiana JOIN----------------------------------------------------------
  private BranchingData getAndCheckJoin(Integer joinId) {
    List<BranchingData> branchings = branchingProvider.getBranchingsByIds(
      List.of(joinId)
    );
    if (branchings.isEmpty()) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      List.of(joinId.toString()),
      ErrorGroup.BRANCHING,
      HttpStatus.NOT_FOUND
    );
    BranchingData branching = branchings.getFirst();

    if (branching.type() != BranchingType.JOIN) throw new ApiException(
      ErrorCode.WRONG_BRANCHING_TYPE,
      ErrorGroup.BRANCHING,
      HttpStatus.CONFLICT
    );
    return branching;
  }

  @Transactional
  public void changeJoin(
    Integer joinId,
    JoinUpdateRequest info,
    Integer scenarioId
  ) {
    BranchingData join = getAndCheckJoin(joinId);
    branchingValidator.checkThreads(info.threadIdsToJoin(), scenarioId);
    // Aktualizujemy JOIN
    branchingRepository.save(Branching.from(info, join, scenarioId));
    // Przywracamy END na odłączanych wątkach
    Integer[] disconnectedThreads = Arrays.stream(join.comingIn())
      .filter(threadId -> !info.threadIdsToJoin().contains(threadId))
      .toArray(Integer[]::new);
    eventManager.ensureEndEvents(disconnectedThreads);
    idleEventManager.cleanupIdleEvents(scenarioId);

    List<Integer> newThreads = info
      .threadIdsToJoin()
      .stream()
      .filter(threadId -> !Arrays.asList(join.comingIn()).contains(threadId))
      .toList();

    setupRemainingThreads(newThreads, join.time(), joinId, false);

    Map<Integer, List<Integer>> objectsPerThread =
      objectInstanceProvider.getObjectsIdsAssignedToThreads(
        Stream.concat(
          Arrays.stream(join.comingIn()),
          info.threadIdsToJoin().stream()
        )
          .collect(Collectors.toSet())
          .stream()
          .toList()
      );

    // existingTransfers
    List<Integer> objectsFromComingIn = Arrays.stream(join.comingIn())
      .flatMap(threadId ->
        objectsPerThread
          .getOrDefault(threadId, Collections.emptyList())
          .stream()
      )
      .toList();

    // newTransfers
    List<Integer> objectsToTransfer = info
      .threadIdsToJoin()
      .stream()
      .flatMap(threadId ->
        objectsPerThread
          .getOrDefault(threadId, Collections.emptyList())
          .stream()
      )
      .toList();

    InternalTransferPairs pairs = objectInstanceTransfer.getPairs(
      List.of(objectsFromComingIn),
      List.of(objectsToTransfer),
      List.of(join.comingOut()[0])
    );

    objectInstanceTransfer.handleObjectTransfers(pairs, scenarioId);
  }

  public void deleteJoin(Integer scenarioId, Integer joinId) {
    BranchingData join = getAndCheckJoin(joinId);
    if (join.comingIn().length != 1) {
      threadRemovalService.removeThread(scenarioId, join.comingOut()[0]); //Naprawi też eventy
    } else {
      branchingDeleter.deleteBranchings(List.of(joinId));
      idleEventManager.fillWithIdleEvents(
        join.comingIn()[0],
        join.time(),
        join.time() + 1
      );
      eventManager.moveEventsBetweenThreads(
        join.comingIn(),
        join.comingOut(),
        0
      );
      threadRemovalService.removeThreadsAfterMove(join.comingOut());
    }
  }
}
