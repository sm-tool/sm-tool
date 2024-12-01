package api.database.model.thread;

import java.util.List;

public interface QdsResponseThreadWithObjects {
  Integer getId();
  String getTitle();
  String getDescription();
  List<Integer> getObjectIds();
}
