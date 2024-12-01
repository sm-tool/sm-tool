package api.database.repository.object;

import api.database.entity.object.QdsObject;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsObjectRepository
  extends JpaRepository<QdsObject, Integer>, QdsObjectRepositoryCustom {
  @Modifying
  @Query(
    value = "INSERT INTO qds_thread_to_object VALUES (nextval('qds_thread_to_object_id_seq'), :objectId, :threadId)",
    nativeQuery = true
  )
  void addObjectToThread(
    @Param("objectId") Integer objectId,
    @Param("threadId") Integer threadId
  );

  @Query(
    value = "SELECT object_id FROM qds_thread_to_object WHERE thread_id=:threadId ORDER BY object_id",
    nativeQuery = true
  )
  List<Integer> getAllThreadObjects(@Param("threadId") Integer threadId);

  @Modifying
  @Query(
    value = "DELETE FROM qds_object o " +
    "USING qds_thread_to_object tto " +
    "WHERE o.id = tto.object_id " +
    "AND tto.thread_id = :threadId",
    nativeQuery = true
  )
  void deleteObjectsForThread(@Param("threadId") Integer threadId);

  //Obiekt globalny będzie przypisany tylko do 1 wątku
  @Query(
    value = "SELECT o.* " +
    "FROM qds_object o " +
    "         JOIN qds_thread_to_object tto ON o.id = tto.object_id" +
    "         JOIN qds_thread t ON tto.thread_id = t.id " +
    "WHERE t.is_global=TRUE AND t.scenario_id = :scenarioId",
    nativeQuery = true
  )
  List<Integer> getGlobalObjects(@Param("scenarioId") Integer scenarioId);

  //--------------------------------Usuwanie scenariusza--------------------------------------------------
  @Modifying
  @Query("DELETE FROM QdsObject o WHERE o.scenario.id = :scenarioId")
  void deleteObjectsByScenarioId(@Param("scenarioId") Integer scenarioId);

  @Query("SELECT o FROM QdsObject o WHERE o.scenario.id = :scenarioId")
  List<QdsObject> findObjectsByScenarioId(
    @Param("scenarioId") Integer scenarioId
  );

  @Modifying
  @Query(
    value = """
        DELETE FROM qds_thread_to_object tto
            USING qds_thread t JOIN qds_event e ON t.id = e.thread_id
        WHERE tto.thread_id = t.id
            AND event_type IN ('FORK_OUT','JOIN_OUT')
            AND event_time >= :time
            AND tto.object_id IN (:objectIds)
    """,
    nativeQuery = true
  )
  void deleteObjectConnectionsToThreadsAfterTime(
    @Param("time") Integer time,
    @Param("objectIds") List<Integer> objectIds
  );
}
