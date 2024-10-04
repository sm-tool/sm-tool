package api.database.classes.threads.response;

import api.database.classes.enums.QdsBranchingType;
import java.util.List;

public record QdsBranching(
  Integer id,
  QdsBranchingType type, //Merge lub fork
  Integer[] comingIn,
  Integer[] comingOut,
  QdsEvent event,
  Integer time,
  List<List<Integer>> objectTransfer
) {}
