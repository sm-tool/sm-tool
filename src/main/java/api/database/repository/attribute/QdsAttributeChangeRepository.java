package api.database.repository.attribute;

import api.database.entity.object.QdsAttributeChange;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QdsAttributeChangeRepository
  extends JpaRepository<QdsAttributeChange, Integer> {
  @Query(
    value = "SELECT * FROM qds_attribute_change WHERE event_id IN (:eventIds)",
    nativeQuery = true
  )
  List<QdsAttributeChange> getEventsAttributeChanges(
    @Param("eventIds") List<Integer> eventIds
  );

  @Modifying
  @Query(
    value = """
    DELETE FROM qds_attribute_change ac
    USING qds_event e, qds_attribute a
    WHERE ac.event_id = e.id
    AND ac.attribute_id = a.id
    AND e.event_time > :time
    AND a.object_id = ANY(:objectIds)
    """,
    nativeQuery = true
  )
  void deleteAttributeChangesTimeAndObjectIds(
    @Param("time") Integer time,
    @Param("objectIds") Integer[] objectIds
  );

  @Modifying
  @Query(
    value = """
    DELETE FROM qds_attribute_change ac
    USING qds_event e, qds_attribute a
    WHERE ac.event_id = e.id
    AND ac.attribute_id = a.id
    AND e.event_time = :time
    AND a.object_id = ANY(:objectIds)
    """,
    nativeQuery = true
  )
  void deleteAttributeChangesInTimeByObjectIds(
    @Param("time") Integer time,
    @Param("objectIds") Integer[] objectIds
  );
}
