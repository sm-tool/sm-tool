package api.database.repository.event;

import api.database.entity.event.Event;
import api.database.repository.RefreshableRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające wydarzeniami w systemie.
/// Zapewnia kompleksową obsługę wydarzeń w kontekście wątków i scenariuszy,
/// w tym wydarzenia specjalne jak FORK/JOIN oraz wydarzenia końcowe.
///
/// # Główne funkcjonalności
/// - Operacje CRUD na wydarzeniach
/// - Zarządzanie wydarzeniami końcowymi (END)
/// - Przenoszenie wydarzeń między wątkami
/// - Zmiana typów wydarzeń
/// - Pobieranie wydarzeń w różnych kontekstach
///
/// # Specjalne przypadki
/// - Wątek globalny jest zawsze reprezentowany jako ID=0 w wynikach
/// - Wydarzenia END mogą być automatycznie dodawane/aktualizowane
/// - Puste wydarzenia NORMAL/GLOBAL są zamieniane na IDLE
///
/// # Powiązane komponenty
/// - {@link Event} - encja reprezentująca wydarzenie
/// - {@link api.database.entity.thread.Thread} - wątek zawierający wydarzenia
/// - {@link api.database.entity.scenario.Scenario} - scenariusz grupujący wydarzenia
/// - {@link api.database.entity.thread.Branching} - rozgałęzienia FORK/JOIN
@Repository
public interface EventRepository extends RefreshableRepository<Event, Integer> {
  //---------------------------------------------------Event Manager----------------------------------------------------
  /// Pobiera ostatnie wydarzenie w wątku.
  /// Uwzględnia tylko wydarzenia kończące: END, FORK_IN lub JOIN_IN.
  ///
  /// @param threadId ID wątku
  /// @return ostatnie wydarzenie
  @Query(
    value = "SELECT * FROM qds_event WHERE thread_id=:threadId AND event_type IN ('END','FORK_IN','JOIN_IN')",
    nativeQuery = true
  )
  Event getLastEvent(@Param("threadId") Integer threadId);

  /// Pobiera pierwsze wydarzenie w wątku.
  /// Uwzględnia tylko wydarzenia rozpoczynające: START, FORK_OUT lub JOIN_OUT.
  ///
  /// @param threadId ID wątku
  /// @return pierwsze wydarzenie
  @Query(
    value = "SELECT * FROM qds_event WHERE thread_id=:threadId AND event_type IN ('START','FORK_OUT','JOIN_OUT')",
    nativeQuery = true
  )
  Event getFirstEvent(Integer threadId);

  /// Usuwa wszystkie wydarzenia dla wskazanych wątków.
  /// Operacja kaskadowo usuwa powiązane zmiany atrybutów i asocjacji.
  ///
  /// @param threadIds lista ID wątków do wyczyszczenia
  @Modifying
  @Query(
    value = "DELETE FROM qds_event WHERE thread_id=ANY(:threadIds)",
    nativeQuery = true
  )
  void deleteThreadEvents(@Param("threadIds") Integer[] threadIds);

  /// Przenosi wydarzenia między wątkami zachowując porządek czasowy.
  /// Operacja obejmuje tylko wydarzenia po wskazanym czasie.
  ///
  /// # SQL
  /// Wykorzystuje mapowanie tabeli unnest do przetworzenia list wątków.
  /// Wydarzenia są przenoszone z zachowaniem wszystkich powiązań.
  ///
  /// @param idsTo ID wątków docelowych
  /// @param idsFrom ID wątków źródłowych
  /// @param time czas graniczny - przenoszone są późniejsze wydarzenia
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
  ///
  /// # Proces
  /// 1. Znajduje ostatnie zwykłe wydarzenie w każdym wątku
  /// 2. Aktualizuje istniejące lub tworzy nowe END w następnej jednostce czasu
  /// 3. Resetuje powiązania z rozgałęzieniami dla aktualizowanych END
  ///
  /// # SQL
  /// Wykorzystuje CTE do:
  /// - Znalezienia ostatnich zwykłych wydarzeń
  /// - Aktualizacji istniejących END
  /// - Wstawienia nowych END gdzie potrzeba
  ///
  /// @param threadIds lista ID wątków do sprawdzenia/aktualizacji
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
          event_type = 'END',
          branching_id = NULL
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

  /// Zmienia typ wydarzeń bez zmian na IDLE.
  /// Dotyczy wydarzeń typu NORMAL/GLOBAL, które nie mają powiązanych
  /// zmian atrybutów ani asocjacji.
  ///
  /// # SQL
  /// Wykorzystuje CTE do:
  /// - Zdefiniowania dozwolonych typów wydarzeń (NORMAL/GLOBAL)
  /// - Znalezienia wydarzeń bez zmian poprzez LEFT JOIN
  /// - Aktualizacji tylko pustych wydarzeń
  ///
  /// @param scenarioId ID scenariusza
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
  /// Pobiera wydarzenia dla wątku z uwzględnieniem specjalnego przypadku wątku globalnego.
  /// Dla wątku globalnego (ID=0) podmienia faktyczne ID na 0 w wynikach.
  ///
  /// # SQL
  /// - Dla wątku normalnego: zwraca wydarzenia bezpośrednio
  /// - Dla wątku globalnego: znajduje faktyczny wątek przez flag is_global
  /// - Sortuje wyniki po czasie dla zachowania kolejności
  ///
  /// @param threadId ID wątku (0 dla globalnego)
  /// @param scenarioId ID scenariusza (potrzebne dla wątku globalnego)
  /// @return Lista wydarzeń posortowana chronologicznie
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
  /// Konwertuje ID wątku globalnego na 0 w wynikach.
  ///
  /// # SQL
  /// - Łączy wydarzenia z tabelą wątków by sprawdzić globalność
  /// - Używa CASE do podmiany ID wątku globalnego na 0
  /// - Sortuje po ID wątku i czasie dla spójnej kolejności
  ///
  /// @param scenarioId ID scenariusza
  /// @return Lista wszystkich wydarzeń scenariusza posortowana po wątku i czasie
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
  /// Pobiera identyfikatory wydarzeń w scenariuszu dla wskazanego czasu.
  ///
  /// # SQL
  /// Łączy wydarzenia z wątkami aby zweryfikować przynależność do scenariusza.
  ///
  /// @param scenarioId ID scenariusza
  /// @param time Czas wydarzeń do pobrania
  /// @return Lista ID wydarzeń w danym czasie
  @Query(
    value = "SELECT e.id FROM qds_event e JOIN qds_thread t ON e.thread_id = t.id " +
    "WHERE event_time=:time AND scenario_id=:scenarioId",
    nativeQuery = true
  )
  List<Integer> getScenarioEventIdsInTime(Integer scenarioId, Integer time);
}
