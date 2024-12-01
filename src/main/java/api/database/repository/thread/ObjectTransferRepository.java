package api.database.repository.thread;

import api.database.entity.object.QdsObject;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające transferem obiektów między wątkami
/// w kontekście rozgałęzień (fork/join).
/// Ze względu na ilość unikalnych operacji oraz fakt występowania tych operacji tylko dla operacji rozgałęzień i
/// brak zwracanie czegokolwiek zostały one wydzielone do oddzielnego repozytorium
///
/// Opisy poszczególnych funkcji można znaleźć w serwisach, które je implementują.
/// @implNote W praktyce repozytorium to zostało wydzielone z repozytorium zarządzającego obiektami i także tutaj będzie
/// extendować {@code JpaRepository<QdsObject, Integer>}
@Repository
public interface ObjectTransferRepository
  extends JpaRepository<QdsObject, Integer> {
  @Modifying
  @Query(
    value = "INSERT INTO qds_thread_to_object (id, object_id, thread_id) " +
    "SELECT nextval('qds_thread_to_object_seq'), object_id, :to " +
    "FROM qds_thread_to_object WHERE thread_id = :from",
    nativeQuery = true
  )
  void transferObjectsOnJoin(
    @Param("from") Integer from,
    @Param("to") Integer to
  );

  @Modifying
  @Query(
    value = "INSERT INTO qds_thread_to_object (id, object_id, thread_id) " +
    "SELECT nextval('qds_thread_to_object_id_seq'), object_id, :threadId " +
    "FROM qds_thread_to_object WHERE object_id IN (:objectIds)",
    nativeQuery = true
  )
  void transferObjectsToThread(
    @Param("threadId") Integer threadId,
    @Param("objectIds") List<Integer> objectIds
  );

  @Modifying
  @Query(
    value = """
    WITH RECURSIVE flow_trace AS (
        SELECT
            e.id,
            e.event_type,
            e.branching_id,
            e.thread_id
        FROM qds_event e
        WHERE e.thread_id = :threadId
          AND e.event_type IN ('FORK_IN', 'JOIN_IN')

        UNION ALL

        -- dla każdego JOIN_IN znajdź następny event końcowy
            SELECT
            e2.id,
            e2.event_type,
            e2.branching_id,
            e2.thread_id
        FROM flow_trace ft
            -- znajdź JOIN_OUT o tym samym branching_id
            JOIN qds_event e1 ON e1.branching_id = ft.branching_id
            AND e1.event_type = 'JOIN_OUT'
            -- w wątku tego JOIN_OUT znajdź event końcowy
            JOIN qds_event e2 ON e2.thread_id = e1.thread_id
            AND e2.event_type IN ('FORK_IN', 'JOIN_IN')
        WHERE ft.event_type = 'JOIN_IN'
    )
    -- Wykonujemy update
    UPDATE qds_branching
    SET is_correct = false
    WHERE id IN (
        SELECT branching_id
        FROM flow_trace
        WHERE event_type = 'FORK_IN'
        LIMIT 1
        );
    """,
    nativeQuery = true
  )
  void findIncorrectForksAndMarkThem(@Param("threadId") Integer threadId);

  @Modifying
  @Query(
    value = """
    INSERT INTO qds_thread_to_object (id, thread_id, object_id)
    SELECT nextval('qds_thread_to_object_id_seq'),
           thread_id, -- z zapytania rekurencyjnego
           o.id       -- z przekazanej listy obiektów
    FROM (
        -- zapytanie znajdujące wątki przez JOINy
        WITH RECURSIVE flow_trace AS (
            SELECT  e.id,
                    e.event_type,
                    e.branching_id,
                    e.thread_id
            FROM qds_event e
            WHERE e.thread_id = :threadId
                AND e.event_type = 'JOIN_IN'

            UNION ALL

            SELECT  e2.id,
                    e2.event_type,
                    e2.branching_id,
                    e2.thread_id
            FROM flow_trace ft
                JOIN qds_event e1 ON e1.branching_id = ft.branching_id
                    AND e1.event_type = 'JOIN_OUT'
                JOIN qds_event e2 ON e2.thread_id = e1.thread_id
                    AND e2.event_type = 'JOIN_IN'
            WHERE ft.event_type = 'JOIN_IN')
            SELECT thread_id
            FROM flow_trace) found_threads
                -- Iloczyn kartezjański z listą obiektów
                CROSS JOIN unnest(:objectIds) as o(id);
    """,
    nativeQuery = true
  )
  void transferAdditionalObjectsOnJoins(
    @Param("threadId") Integer threadId,
    @Param("objectIds") Integer[] objectIds
  );
}
