package api.database.repository.object;

import api.database.model.internal.object.QdsInternalObjectInEvent;
import java.util.List;

public interface QdsObjectRepositoryCustom {
  List<QdsInternalObjectInEvent> getObjectsAvailableForThread(
    Integer threadId,
    Integer globalThreadId
  );
}
