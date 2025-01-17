package api.database.repository.object;

import api.database.entity.object.ObjectInstance;
import api.database.model.domain.object.InternalObjectInstance;
import api.database.model.domain.object.InternalObjectInstanceAttributes;
import api.database.model.domain.object.InternalObjectInstanceType;
import api.database.model.domain.transfer.InternalObjectIdWIthThread;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjectInstanceRepository
  extends JpaRepository<ObjectInstance, Integer> {
  //--------------------------------------ThreadObjectCleaner-----------------------------------------------------------
  @Modifying
  @Query(
    value = "DELETE FROM qds_object o " +
    "USING qds_thread_to_object tto " +
    "WHERE o.id = tto.object_id " +
    "AND tto.thread_id = :threadId",
    nativeQuery = true
  )
  void deleteObjectsForThread(@Param("threadId") Integer threadId);

  //--------------------------------Usuwanie scenariusza--------------------------------------------------
  @Modifying
  @Query("DELETE FROM ObjectInstance o WHERE o.scenario.id = :scenarioId")
  void deleteObjectsByScenarioId(@Param("scenarioId") Integer scenarioId);

  @Modifying
  @Query(
    value = """
        DELETE FROM qds_thread_to_object tto
            USING qds_thread t JOIN qds_event e ON t.id = e.thread_id
        WHERE tto.thread_id = t.id
            AND event_type IN ('FORK_OUT','JOIN_OUT')
            AND event_time >= :time
            AND tto.object_id = ANY(:objectIds)
    """,
    nativeQuery = true
  )
  void deleteObjectConnectionsToThreadsAfterTime(
    @Param("time") Integer time,
    @Param("objectIds") Integer[] objectIds
  );

  //---------------------------------------Object Provider-------------------------------------------

  // Obiekty wraz z ich przydziałami (0 dla wątku globalnego, dla pozostałych nie jest istotny
  // (teoretycznie wybierany największy))
  @Query(
    value = """
    SELECT
        o.id,
        o.name,
        o.template_id,
        o.object_type_id,
        o.origin_thread_id
    FROM qds_object o
      JOIN qds_thread_to_object tto ON o.id = tto.object_id
    WHERE o.scenario_id = :scenarioId
      AND (
        o.origin_thread_id = 0
        OR (
          :threadId IS NULL
          OR tto.thread_id = :threadId
        )
      )
    GROUP BY o.id, o.name, o.template_id, o.object_type_id, o.origin_thread_id;
    """,
    nativeQuery = true
  )
  List<InternalObjectInstance> getAvailableObjects(
    @Param("scenarioId") Integer scenarioId,
    @Param("threadId") Integer threadId
  );

  // Obiekty wraz z ich przydziałami (0 dla wątku globalnego, dla pozostałych nie jest istotny
  // (teoretycznie wybierany największy))
  @Query(
    value = """
    SELECT
        o.id,
        o.name,
        o.template_id,
        o.object_type_id,
        o.origin_thread_id,
        0 AS thread_id
    FROM qds_object o
    WHERE o.scenario_id = :scenarioId
    AND o.id = :objectId;
    """,
    nativeQuery = true
  )
  InternalObjectInstance getOneObject(
    @Param("scenarioId") Integer scenarioId,
    @Param("objectId") Integer objectId
  );

  @Query(
    value = """
    SELECT
        o.id,
        o.name,
        o.template_id,
        o.object_type_id,
        o.origin_thread_id,
        0 AS thread_id
    FROM qds_object o
    WHERE o.template_id = :templateId
    """,
    nativeQuery = true
  )
  List<InternalObjectInstance> getObjectsUsingTemplate(
    @Param("templateId") Integer templateId
  );

  @Query(
    value = """
        SELECT o.id, o.object_type_id
        FROM qds_object o
        WHERE o.id = ANY(:objectIds)
    """,
    nativeQuery = true
  )
  List<InternalObjectInstanceType> getObjectTypes(
    @Param("objectIds") Integer[] objectIds
  );

  @Query(
    value = """
    SELECT object_id, thread_id FROM qds_thread_to_object tto WHERE thread_id=ANY(:threadIds)
    """,
    nativeQuery = true
  )
  List<InternalObjectIdWIthThread> getObjectIdsAssignedToThreads(
    @Param("threadIds") Integer[] threadIds
  );

  @Query(
    value = """
    SELECT o.id,
           o.origin_thread_id,
    ARRAY(SELECT id FROM qds_attribute WHERE object_id=o.id) AS attributes
    FROM qds_object o JOIN qds_thread_to_object tto ON o.id = tto.object_id
    WHERE tto.thread_id = :threadId OR tto.thread_id=:globalThreadId
    """,
    nativeQuery = true
  )
  List<
    InternalObjectInstanceAttributes
  > getObjectIdsWithAttributeIdsAvailableForThread(
    Integer threadId,
    Integer globalThreadId
  );
}
