package api.database.model.internal.thread;

import api.database.model.constant.QdsBranchingType;
import api.database.model.thread.QdsInfoThreadAdd;

public record QdsInternalThreadAddBranched(
  QdsInfoThreadAdd threadInfo,
  Integer branchingId,
  QdsBranchingType branchingType
) {}
