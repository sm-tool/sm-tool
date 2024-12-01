package api.database.model.branching;

import api.database.model.constant.QdsBranchingType;
import java.util.List;

public record QdsResponseBranching(
  Integer id,
  QdsBranchingType type, //Merge lub fork
  Boolean isCorrect,
  String title,
  String description,
  Integer time,
  Integer[] comingIn,
  Integer[] comingOut,
  List<QdsInfoOffspringObjectTransfer> objectTransfer
) {}
