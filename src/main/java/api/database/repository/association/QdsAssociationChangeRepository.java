package api.database.repository.association;

import api.database.entity.association.QdsAssociationChange;
import api.database.model.constant.QdsAssociationOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QdsAssociationChangeRepository
  extends
    JpaRepository<QdsAssociationChange, Integer>,
    QdsAssociationChangeRepositoryCustom {
  @Query(
    value = "SELECT c.association_operation FROM qds_association_change c " +
    "JOIN qds_event e ON c.event_id = e.id " +
    "WHERE c.association_id = :associationId AND e.event_time < " +
    "(SELECT event_time FROM qds_event WHERE id = :eventId) " +
    "ORDER BY e.event_time DESC LIMIT 1",
    nativeQuery = true
  )
  QdsAssociationOperation getLastChangeOperationBeforeEvent(
    @Param("associationId") Integer associationId,
    @Param("eventId") Integer eventId
  );

  @Query(
    value = "SELECT c.id FROM qds_association_change c " +
    "JOIN qds_event e ON c.event_id = e.id " +
    "WHERE c.association_id = :associationId AND e.event_time > " +
    "(SELECT event_time FROM qds_event WHERE id = :eventId) " +
    "ORDER BY e.event_time LIMIT 1",
    nativeQuery = true
  )
  Integer getFirstChangeOperationAfterEvent(
    @Param("associationId") Integer associationId,
    @Param("eventId") Integer eventId
  );

  @Modifying
  @Query(
    value = "DELETE FROM qds_association_change WHERE event_id=:eventId AND association_id=:associationId",
    nativeQuery = true
  )
  void deleteAssociationChange(
    @Param("associationId") Integer associationId,
    @Param("eventId") Integer eventId
  );

  @Modifying
  @Query(
    value = """
        DELETE FROM qds_association_change ac
        USING qds_event e, qds_association a
        WHERE ac.event_id = e.id
        AND ac.association_id = a.id
        AND e.event_time > :time
        AND a.object1_id = ANY(:objectIds)
        OR a.object2_id = ANY(:objectIds)
    """,
    nativeQuery = true
  )
  void deleteAssociationChangesByTimeAndObjectIds(
    @Param("time") Integer time,
    @Param("objectIds") Integer[] objectIds
  );

  @Modifying
  @Query(
    value = """
            DELETE FROM qds_association_change ac
            USING qds_event e, qds_association a
            WHERE ac.event_id = e.id
            AND ac.association_id = a.id
            AND e.event_time = :time
            AND a.object1_id = ANY(:object1Ids)
            OR a.object2_id = ANY(:object2Ids)
    """,
    nativeQuery = true
  )
  void deleteAssociationChangesInTimeByObjectIds(
    @Param("time") Integer time,
    @Param("object1Ids") Integer[] object1Ids,
    @Param("object2Ids") Integer[] object2Ids
  );
}
