package api.database.service.core;

import api.database.repository.branching.BranchingRepository;
import java.util.Collection;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BranchingDeleter {

  private final BranchingRepository branchingRepository;

  @Autowired
  public BranchingDeleter(BranchingRepository branchingRepository) {
    this.branchingRepository = branchingRepository;
  }

  /// Usuwa wszystkie rozgałęzienia dla scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  public void deleteScenarioBranchings(Integer scenarioId) {
    List<Integer> branchingIds = branchingRepository.getBranchingIdsForScenario(
      scenarioId
    );
    branchingRepository.deleteBranchingByIds(
      branchingIds.toArray(new Integer[0])
    );
  }

  public void deleteBranchings(Collection<Integer> allBranchingsToDelete) {
    branchingRepository.deleteBranchingByIds(
      allBranchingsToDelete.toArray(new Integer[0])
    );
  }
}
