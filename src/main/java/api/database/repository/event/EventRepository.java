package api.database.repository.event;

import api.database.entity.event.Event;
import api.database.repository.RefreshableRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające wydarzeniami w systemie.
/// Odpowiada za:
/// - Operacje CRUD na wydarzeniach
/// - Zarządzanie wydarzeniami końcowymi wątków
/// - Przenoszenie wydarzeń między wątkami
/// - Pobieranie wydarzeń dla wątków i scenariuszy
///
/// # Powiązania
/// - {@link Event} - encja reprezentująca wydarzenie
/// - {@link api.database.entity.thread.Thread} - wątek zawierający wydarzenia
/// - {@link api.database.entity.scenario.Scenario} - scenariusz grupujący wydarzenia
@Repository
public interface EventRepository extends RefreshableRepository<Event, Integer> {
  //---------------------------------------------------Event Manager----------------------------------------------------
  /// Pobiera ostatnie wydarzenie w wątku (END, FORK_IN lub JOIN_IN).
  ///
  /// @param threadId ID wątku
  /// @return ostatnie wydarzenie lub null dla nieistniejącego wątku
  @Query(
    value = "SELECT * FROM qds_event WHERE thread_id=:threadId AND event_type IN ('END','FORK_IN','JOIN_IN')",
    nativeQuery = true
  )
  Event getLastEvent(@Param("threadId") Integer threadId);

  /// Pobiera pierwsze wydarzenie w wątku (START, FORK_OUT lub JOIN_OUT).
  ///
  /// @param threadId ID wątku
  /// @return pierwsze wydarzenie
  @Query(
    value = "SELECT * FROM qds_event WHERE thread_id=:threadId AND event_type IN ('START','FORK_OUT','JOIN_OUT')",
    nativeQuery = true
  )
  Event getFirstEvent(Integer threadId);

  /// Usuwa wszystkie wydarzenia dla wskazanych wątków.
  ///
  /// @param threadIds lista ID wątków
  @Modifying
  @Query(
    value = "DELETE FROM qds_event WHERE thread_id=ANY(:threadIds)",
    nativeQuery = true
  )
  void deleteThreadEvents(@Param("threadIds") Integer[] threadIds);

  /// Przenosi wydarzenia między wątkami zachowując porządek czasowy.
  /// Przenosi wydarzenia późniejsze niż podany czas.
  ///
  /// @param idsTo lista ID wątków docelowych
  /// @param idsFrom lista ID wątków źródłowych
  /// @param time czas graniczny
  @Modifying
  @Query(
    value = """
    UPDATE qds_event e
    SET thread_id = map.id_to
    FROM (
        SELECT unnest(:idsTo) as id_to,
               unnest(:idsFrom) as id_from
    ) map
    WHERE e.thread_id = map.id_from
    AND e.event_time > :time;
    """,
    nativeQuery = true
  )
  void moveEventsBetweenThreads(
    @Param("idsTo") Integer[] idsTo,
    @Param("idsFrom") Integer[] idsFrom,
    @Param("time") Integer time
  );

  /// Zapewnia obecność wydarzeń końcowych (END) we wskazanych wątkach.
  /// Dla każdego wątku:
  /// 1. Znajduje ostatnie wydarzenie nie będące IDLE/END/FORK_IN/JOIN_IN
  /// 2. Aktualizuje istniejące END lub tworzy nowe w następnej jednostce czasu
  ///
  /// @param threadIds lista ID wątków
  @Modifying
  @Query(
    value = """
    WITH LastNormalEvent AS (
      SELECT thread_id, MAX(event_time) as normal_time
      FROM qds_event
      WHERE thread_id = ANY(:threadIds)
      AND event_type NOT IN ('IDLE', 'END', 'FORK_IN', 'JOIN_IN')
      GROUP BY thread_id
    ),
    LastEndEvent AS (
      SELECT e.id, e.thread_id, e.event_time
      FROM qds_event e
      JOIN LastNormalEvent n ON e.thread_id = n.thread_id
      WHERE e.event_type IN ('END', 'FORK_IN', 'JOIN_IN')
    ),
    UpdateEnd AS (
      UPDATE qds_event e
      SET event_time = n.normal_time + 1,
          event_type = 'END'
      FROM LastNormalEvent n, LastEndEvent l
      WHERE e.id = l.id
      AND e.thread_id = n.thread_id
      RETURNING e.thread_id
    )
    INSERT INTO qds_event (id, thread_id, event_time, event_type)
    SELECT nextval('qds_event_id_seq'), n.thread_id, n.normal_time + 1, 'END'
    FROM LastNormalEvent n
    WHERE NOT EXISTS (
      SELECT 1 FROM UpdateEnd u WHERE u.thread_id = n.thread_id
    )
    """,
    nativeQuery = true
  )
  void ensureEndEvents(@Param("threadIds") Integer[] threadIds);

  @Modifying
  @Query(
    value = """
    WITH eventTypes AS (
        SELECT unnest(ARRAY['NORMAL','GLOBAL']) AS type
    )
    UPDATE qds_event e
    SET event_type = 'IDLE'
    WHERE e.id IN (
        SELECT e.id
        FROM qds_event e
                 JOIN qds_thread t ON e.thread_id = t.id
                 LEFT JOIN qds_association_change assch ON e.id = assch.event_id
                 LEFT JOIN qds_attribute_change attch ON e.id = attch.event_id
                 JOIN eventTypes et ON e.event_type = et.type
        WHERE t.scenario_id = :scenarioId
          AND assch.id IS NULL AND attch.id IS NULL
    );
        """,
    nativeQuery = true
  )
  void changeEventsWithoutChangesToIdle(
    @Param("scenarioId") Integer scenarioId
  );

  //---------------------------------------------------Event Provider---------------------------------------------------
  /// Pobiera wydarzenia dla wątku.
  /// Dla wątku globalnego zwraca ID=0 jako id wątku.
  ///
  /// @param threadId ID wątku
  /// @param scenarioId ID scenariusza
  /// @return lista wydarzeń posortowana czasowo
  @Query(
    value = """
    SELECT  e.id,
            :threadId as thread_id,
            e.description,
            e.title,
            e.event_time,
            e.event_type,
            e.branching_id
    FROM qds_event e WHERE thread_id=:threadId
    OR :threadId = 0 AND thread_id =
    (SELECT id FROM qds_thread t WHERE t.is_global=TRUE AND t.scenario_id=:scenarioId)
    ORDER BY e.event_time
    """,
    nativeQuery = true
  )
  List<Event> getThreadEvents(
    @Param("threadId") Integer threadId,
    @Param("scenarioId") Integer scenarioId
  );

  /// Pobiera wszystkie wydarzenia ze scenariusza.
  /// Dla wątku globalnego zwraca ID=0 jako id wątku.
  ///
  /// @param scenarioId ID scenariusza
  /// @return lista wydarzeń posortowana po ID wątku i czasie
  @Query(
    value = """
    SELECT e.id,
           CASE
               WHEN (t.is_global = TRUE) THEN 0
               ELSE e.thread_id END as thread_id,
           e.description,
           e.title,
           e.event_time,
           e.event_type,
           e.branching_id
    FROM qds_event e
             JOIN qds_thread t ON e.thread_id = t.id
    WHERE scenario_id = :scenarioId
    ORDER BY e.thread_id, e.event_time
    """,
    nativeQuery = true
  )
  List<Event> getScenarioEvents(@Param("scenarioId") Integer scenarioId);

  //--------------------------------------------------------------------------------------------------------------------
  /// Pobiera ID wydarzeń w scenariuszu dla wskazanej akcji.
  ///
  /// @param scenarioId ID scenariusza
  /// @param time akcja
  /// @return lista ID wydarzeń
  @Query(
    value = "SELECT e.id FROM qds_event e JOIN qds_thread t ON e.thread_id = t.id " +
    "WHERE event_time=:time AND scenario_id=:scenarioId",
    nativeQuery = true
  )
  List<Integer> getScenarioEventIdsInTime(Integer scenarioId, Integer time);
}
