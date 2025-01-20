package api.database.repository.scenario;

import api.database.entity.scenario.Scenario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/// Repozytorium zarządzające scenariuszami w systemie.
/// Odpowiada za podstawowe operacje na scenariuszach i walidację
/// ich spójności w kontekście wątków.
///
/// # Główne funkcjonalności
/// - Podstawowe operacje CRUD na scenariuszach
/// - Wyszukiwanie scenariuszy po tytule i opisie
/// - Weryfikacja przynależności wątków do scenariusza
/// - Paginacja wyników wyszukiwania
///
/// # Powiązane komponenty
/// - {@link Scenario} - encja reprezentująca scenariusz
/// - {@link api.database.entity.thread.Thread} - wątki w scenariuszu
/// - {@link api.database.entity.scenario.ScenarioPhase} - fazy czasowe scenariusza
public interface ScenarioRepository extends JpaRepository<Scenario, Integer> {
  /// Wyszukuje scenariusze zawierające podany tekst w tytule.
  /// Wyszukiwanie jest niewrażliwe na wielkość liter.
  ///
  /// @param title fragment tytułu do wyszukania
  /// @param pageable parametry stronicowania
  /// @return Strona pasujących scenariuszy
  @Query(
    """
    SELECT s FROM Scenario s LEFT JOIN Permission p ON s.id = p.scenarioId
    WHERE (:userId IS NULL OR p.userId = :userId)
    AND LOWER(s.title) = CONCAT('%', LOWER(:title), '%')
    """
  )
  Page<Scenario> findByTitleContaining(
    @Param("title") String title,
    @Param("userId") String userId,
    Pageable pageable
  );

  /// Wyszukuje scenariusze zawierające podany tekst w opisie.
  /// Wyszukiwanie jest niewrażliwe na wielkość liter.
  ///
  /// @param description fragment opisu do wyszukania
  /// @param pageable parametry stronicowania
  /// @return Strona pasujących scenariuszy
  @Query(
    """
    SELECT s FROM Scenario s LEFT JOIN Permission p ON s.id = p.scenarioId
    WHERE (:userId IS NULL OR p.userId = :userId)
    AND LOWER(s.description) = CONCAT('%', LOWER(:description), '%')
    """
  )
  Page<Scenario> findByDescriptionContaining(
    @Param("description") String description,
    @Param("userId") String userId,
    Pageable pageable
  );

  /// Sprawdza spójność przynależności wątków do scenariusza.
  /// Weryfikuje czy którykolwiek z podanych wątków:
  /// - Należy do innego scenariusza
  /// - Jest wątkiem globalnym
  /// - Nie istnieje w systemie
  ///
  /// # SQL
  /// Używa EXISTS do efektywnego sprawdzenia:
  /// - Niezgodności scenarioId
  /// - Flagi is_global=TRUE
  ///
  /// # Przykład użycia
  /// ```java
  /// // Sprawdzenie czy wątki należą do scenariusza
  /// Boolean hasConflict = repository.checkIfExistThreadNotBelongingToScenario(
  ///     new Integer[]{1, 2, 3},
  ///     scenarioId
  /// );
  /// ```
  ///
  /// @param threadIds tablica ID wątków do sprawdzenia
  /// @param scenarioId ID scenariusza referencyjnego
  /// @return true jeśli znaleziono konflikt, false jeśli wszystkie wątki należą do scenariusza
  @Query(
    value = """
    SELECT EXISTS (
        SELECT 1
        FROM qds_thread
        WHERE id = ANY(:threadIds)
        AND (
            scenario_id != :scenarioId OR
            is_global = TRUE
        )
    )
    """,
    nativeQuery = true
  )
  Boolean checkIfExistThreadNotBelongingToScenario(
    @Param("threadIds") Integer[] threadIds,
    @Param("scenarioId") Integer scenarioId
  );

  @Query(
    """
    SELECT s FROM Scenario s LEFT JOIN Permission p ON s.id = p.scenarioId
    WHERE (:userId IS NULL OR p.userId = :userId)
    """
  )
  Page<Scenario> findAllForUser(
    @Param("userId") String userId,
    Pageable pageable
  );
}
