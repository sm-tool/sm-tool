package api.database.repository.branching;

import api.database.entity.thread.Branching;
import api.database.model.domain.thread.InternalBranchingRow;
import api.database.repository.RefreshableRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające rozgałęzieniami (FORK/JOIN) w scenariuszu.
/// Dostarcza operacje bazodanowe dla encji `Branching` oraz operacje
/// agregujące dane o eventach i obiektach w kontekście rozgałęzień.
///
/// # Główne funkcjonalności
/// - Podstawowe operacje CRUD na rozgałęzieniach
/// - Pobieranie stanu obiektów w punktach rozgałęzień
/// - Śledzenie przepływu między wątkami przez FORK/JOIN
/// - Wsparcie dla zapytań natywnych SQL z CTE
///
/// # Przykład użycia
/// ```java
/// @Autowired
/// private BranchingRepository repository;
///
/// // Pobranie rozgałęzień ze stanem obiektów
/// List<InternalBranchingRow> branchings = repository.getBranchingsByIds(ids);
/// ```
///
/// # Powiązane komponenty
/// - {@link Branching} - encja reprezentująca punkt rozgałęzienia
/// - {@link api.database.entity.event.Event} - wydarzenia FORK/JOIN w wątkach
/// - {@link InternalBranchingRow} - projekcja agregująca dane rozgałęzienia
/// - {@link api.database.entity.thread.Thread} - wątki źródłowe i docelowe
@Repository
public interface BranchingRepository
  extends RefreshableRepository<Branching, Integer> {
  /// Usuwa rozgałęzienia o podanych identyfikatorach.
  ///
  /// # SQL
  /// Wykorzystuje natywne zapytanie do bezpośredniego usunięcia wierszy.
  ///
  /// @param branchingIds Lista ID rozgałęzień do usunięcia
  @Modifying
  @Query(
    value = "DELETE FROM qds_branching WHERE id = ANY(:branchingIds)",
    nativeQuery = true
  )
  void deleteBranchingByIds(@Param("branchingIds") Integer[] branchingIds);

  //--------------------------------------------Scenario Branchings-----------------------------------------------------
  /// Pobiera identyfikatory wszystkich rozgałęzień w scenariuszu.
  ///
  /// @param scenarioId ID scenariusza
  /// @return Lista ID rozgałęzień
  @Query(
    value = "SELECT id FROM qds_branching WHERE scenario_id=:scenarioId",
    nativeQuery = true
  )
  List<Integer> getBranchingIdsForScenario(
    @Param("scenarioId") Integer scenarioId
  );

  //-------------------------------------------Branching provider-------------------------------------------------------
  /// Pobiera szczegółowe informacje o rozgałęzieniach wraz ze stanem obiektów.
  ///
  /// # SQL
  /// Zapytanie wykorzystuje Common Table Expressions (CTE) do:
  /// - Zebrania typów eventów rozgałęzień (FORK_IN/OUT, JOIN_IN/OUT)
  /// - Agregacji obiektów dostępnych w wątkach w momencie rozgałęzienia
  /// - Połączenia danych podstawowych z eventami i obiektami
  ///
  /// # Wynik zawiera
  /// - Podstawowe dane rozgałęzienia (typ, czas, poprawność)
  /// - Identyfikatory powiązanych wątków
  /// - Typy eventów w wątkach
  /// - Listy obiektów w wątkach
  ///
  /// @param branchingIds Lista ID rozgałęzień
  /// @return Projekcje zawierające pełne dane o rozgałęzieniach
  @Query(
    value = """
    WITH
        event_types AS (SELECT unnest(ARRAY['FORK_IN', 'JOIN_IN', 'FORK_OUT', 'JOIN_OUT']) AS type),
        branching_events AS (
            SELECT
                e.branching_id,
                e.thread_id,
                e.event_type,
                COALESCE(array_agg(qto.object_id ORDER BY qto.object_id)
                    FILTER (WHERE qto.object_id IS NOT NULL),'{}') as thread_objects
            FROM qds_event e
                LEFT JOIN qds_thread_to_object qto ON qto.thread_id = e.thread_id
                JOIN event_types et ON et.type = e.event_type
            WHERE e.branching_id = ANY(:branchingIds)
            GROUP BY e.branching_id, e.thread_id, e.event_type
        )
    SELECT
        b.id,
        b.branching_type,
        b.is_correct,
        b.title,
        b.description,
        b.branching_time,
        be.thread_id,
        be.event_type,
        be.thread_objects
    FROM qds_branching b
        LEFT JOIN branching_events be ON be.branching_id = b.id
    WHERE b.id = ANY(:branchingIds)
    """,
    nativeQuery = true
  )
  List<InternalBranchingRow> getBranchingsByIds(
    @Param("branchingIds") Integer[] branchingIds
  );

  /// Znajduje pierwsze rozgałęzienie typu FORK na ścieżce wątku.
  /// Używa rekurencyjnego CTE do śledzenia przepływu przez łańcuch JOIN-ów.
  ///
  /// # SQL
  /// Zapytanie:
  /// 1. Zaczyna od eventów FORK_IN/JOIN_IN w podanym wątku
  /// 2. Rekurencyjnie śledzi przepływ przez JOIN-y:
  ///    - Znajduje JOIN_OUT dla każdego JOIN_IN
  ///    - W wątku z JOIN_OUT szuka kolejnego FORK_IN/JOIN_IN
  /// 3. Z wyników wybiera pierwszy FORK_IN
  ///
  /// @param threadId ID wątku początkowego
  /// @return ID pierwszego FORKa lub null jeśli nie znaleziono
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
        SELECT branching_id
        FROM flow_trace
        WHERE event_type = 'FORK_IN'
        LIMIT 1
    """,
    nativeQuery = true
  )
  Integer getFirstForkId(Integer threadId);
}
