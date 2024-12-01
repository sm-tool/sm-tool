package api.database.repository.thread;

import api.database.model.branching.QdsResponseBranching;
import java.util.List;

public interface QdsBranchingRepositoryCustom {
  List<QdsResponseBranching> getBranchingForScenario(Integer scenarioId);
  QdsResponseBranching getOneBranching(Integer branchingId);
}
