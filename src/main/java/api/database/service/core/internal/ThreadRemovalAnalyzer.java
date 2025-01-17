package api.database.service.core.internal;

import api.database.model.data.BranchingData;
import api.database.model.domain.thread.InternalThreadBatch;
import api.database.model.domain.thread.InternalThreadRemovalAnalysis;
import api.database.repository.thread.ThreadRepository;
import api.database.service.core.provider.BranchingProvider;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class ThreadRemovalAnalyzer {

  private final BranchingProvider branchingProvider;
  private final ThreadRepository threadRepository;

  public ThreadRemovalAnalyzer(
    BranchingProvider branchingProvider,
    ThreadRepository threadRepository
  ) {
    this.branchingProvider = branchingProvider;
    this.threadRepository = threadRepository;
  }

  private void getBatchAndAnalyze(
    Integer currentThreadId,
    Set<Integer> threadsToDelete,
    Set<Integer> branchingsToDelete,
    Queue<Integer> joinsToProcess
  ) {
    InternalThreadBatch batch = threadRepository.getThreadBatch(
      currentThreadId
    );
    threadsToDelete.addAll(batch.getThreads());
    branchingsToDelete.addAll(batch.getForks());
    joinsToProcess.addAll(batch.getJoinsToCheck());
  }

  public InternalThreadRemovalAnalysis analyze(Integer firstThreadToRemove) {
    Set<Integer> threadsToDelete = new HashSet<>();
    Set<Integer> branchingsToDelete = new HashSet<>();
    Queue<Integer> joinsToProcess = new LinkedList<>();
    List<Integer> oneToOneJoins = new ArrayList<>();
    // Pobranie początkowego zestawu z SQL
    getBatchAndAnalyze(
      firstThreadToRemove,
      threadsToDelete,
      branchingsToDelete,
      joinsToProcess
    );

    while (!joinsToProcess.isEmpty()) {
      Integer joinId = joinsToProcess.poll();
      BranchingData join = branchingProvider
        .getBranchingsByIds(List.of(joinId))
        .getFirst();

      long remainingThreads = Arrays.stream(join.comingIn())
        .filter(threadId -> !threadsToDelete.contains(threadId))
        .count();

      if (remainingThreads == 1) {
        oneToOneJoins.add(joinId);
      } else if (remainingThreads == 0) {
        Integer outThread = join.comingOut()[0];
        getBatchAndAnalyze(
          outThread,
          threadsToDelete,
          branchingsToDelete,
          joinsToProcess
        );
        branchingsToDelete.add(joinId);
      }
    }

    return new InternalThreadRemovalAnalysis(
      threadsToDelete,
      branchingsToDelete,
      oneToOneJoins
    );
  }
}
