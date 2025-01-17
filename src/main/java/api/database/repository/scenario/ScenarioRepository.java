package api.database.repository.scenario;

import api.database.entity.scenario.Scenario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public interface ScenarioRepository extends JpaRepository<Scenario, Integer> {
  Scenario findQdsScenarioById(Integer id);

  Page<Scenario> findByTitleContaining(String title, Pageable pageable);

  Page<Scenario> findByDescriptionContaining(
    String description,
    Pageable pageable
  );

  /// Sprawdza czy którykolwiek z podanych wątków należy do innego scenariusza lub jest wątkiem globalnym.
  /// Wykorzystywana do walidacji spójności scenariusza przy operacjach wymagających konkretnych wątków.
  ///
  /// # Ważne przypadki
  /// - Wątek należy do innego scenariusza niż podany
  /// - Wątek jest wątkiem globalnym
  /// - Wątek nie istnieje w bazie
  ///
  /// @param threadIds lista identyfikatorów wątków do sprawdzenia
  /// @param scenarioId id scenariusza względem którego sprawdzamy przynależność
  /// @return true jeśli znaleziono konflikt (wątek spoza scenariusza/globalny), false w przeciwnym razie
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
}
