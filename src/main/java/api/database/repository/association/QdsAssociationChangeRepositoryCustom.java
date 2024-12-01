package api.database.repository.association;

import api.database.model.association.QdsInfoAssociationLastChange;
import api.database.model.internal.association.QdsInternalAssociationChangeEvent;
import java.util.List;

public interface QdsAssociationChangeRepositoryCustom {
  List<QdsInfoAssociationLastChange> getLastAssociationChanges(
    List<Integer> objectIds,
    Integer eventTime
  );

  List<QdsInternalAssociationChangeEvent> getAssociationChanges(
    List<Integer> eventIds
  );
}
