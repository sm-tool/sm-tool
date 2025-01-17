package api.database.service.core.internal;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.BranchingData;
import api.database.model.domain.thread.InternalThreadBatch;
import api.database.model.domain.thread.InternalTimeShiftAnalysis;
import api.database.model.exception.ApiException;
import api.database.repository.special.TimeShiftRepository;
import api.database.repository.thread.ThreadRepository;
import api.database.service.core.provider.BranchingProvider;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class TimeShiftAnalyzer {

  private final BranchingProvider branchingProvider;
  private final TimeShiftRepository timeShiftRepository;
  private final ThreadRepository threadRepository;

  public TimeShiftAnalyzer(
    BranchingProvider branchingProvider,
    TimeShiftRepository timeShiftRepository,
    ThreadRepository threadRepository
  ) {
    this.branchingProvider = branchingProvider;
    this.timeShiftRepository = timeShiftRepository;
    this.threadRepository = threadRepository;
  }

  public InternalTimeShiftAnalysis analyze(
    Integer startThreadId,
    Integer deltaTime
  ) {
    Set<Integer> threadsToShift = new HashSet<>();
    Set<Integer> branchingsToShift = new HashSet<>();
    Map<Integer, Integer> threadsToFill = new HashMap<>();
    Queue<Integer> joinsToProcess = new LinkedList<>();

    getBatchAndAnalyze(
      startThreadId,
      threadsToShift,
      branchingsToShift,
      joinsToProcess
    );

    while (!joinsToProcess.isEmpty()) {
      Integer joinId = joinsToProcess.poll();
      BranchingData join = branchingProvider
        .getBranchingsByIds(List.of(joinId))
        .getFirst();

      // Jeśli nie wszystkie wątki wejściowe są przesuwane
      if (!threadsToShift.containsAll(Arrays.asList(join.comingIn()))) {
        // Sprawdź czy nie będzie konfliktów eventów między starym a nowym czasem joina
        checkIfCanMoveJoin(
          Arrays.stream(join.comingIn())
            .filter(threadId -> !threadsToShift.contains(threadId))
            .toArray(Integer[]::new),
          join.time(),
          deltaTime,
          threadsToFill
        );
      }

      // Dodaj wątek wyjściowy do analizy
      Integer outThread = join.comingOut()[0];
      getBatchAndAnalyze(
        outThread,
        threadsToShift,
        branchingsToShift,
        joinsToProcess
      );
      branchingsToShift.add(joinId);
    }

    return new InternalTimeShiftAnalysis(
      threadsToShift,
      branchingsToShift,
      threadsToFill
    );
  }

  private void checkIfCanMoveJoin(
    Integer[] threadIds,
    Integer joinTime,
    Integer deltaTime,
    Map<Integer, Integer> threadsToFill
  ) {
    // Sprawdź czy między starym a nowym czasem joina nie ma żadnych eventów
    // bo wtedy byłyby po "końcu wątku"

    System.out.println(joinTime);
    System.out.println(deltaTime);
    if (deltaTime < 0) {
      for (Integer threadId : threadIds) {
        if (
          timeShiftRepository.existsEventsBetweenTimes(
            threadId,
            joinTime + deltaTime, // nowy czas
            joinTime // stary czas
          )
        ) {
          throw new ApiException(
            ErrorCode.CANNOT_MOVE_EVENTS,
            List.of(threadId.toString()),
            ErrorGroup.EVENT,
            HttpStatus.BAD_REQUEST
          );
        }
      }
    } else {
      threadsToFill.putAll(
        Arrays.stream(threadIds).collect(
          Collectors.toMap(threadId -> threadId, threadId -> joinTime)
        )
      );
    }
  }

  private void getBatchAndAnalyze(
    Integer currentThreadId,
    Set<Integer> threadsToShift,
    Set<Integer> branchingsToShift,
    Queue<Integer> joinsToProcess
  ) {
    InternalThreadBatch batch = threadRepository.getThreadBatch(
      currentThreadId
    );
    threadsToShift.addAll(batch.getThreads());
    branchingsToShift.addAll(batch.getForks());
    joinsToProcess.addAll(batch.getJoinsToCheck());
  }
}
