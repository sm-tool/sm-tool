package api.database.repository.object;

import api.database.entity.object.ObjectTemplate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/// Repozytorium zarządzające szablonami obiektów w systemie.
/// Dostarcza operacje wyszukiwania i filtrowania szablonów z uwzględnieniem
/// paginacji wyników oraz różnych kryteriów dostępu.
///
/// # Główne funkcjonalności
/// - Podstawowe operacje CRUD na szablonach
/// - Wyszukiwanie po tytule i opisie (case-insensitive)
/// - Filtrowanie po typie obiektu i scenariuszu
/// - Paginacja wszystkich operacji wyszukiwania
///
/// # Powiązane komponenty
/// - {@link ObjectTemplate} - encja reprezentująca szablon obiektu
/// - {@link api.database.entity.scenario.ScenarioToObjectTemplate} - powiązanie szablonu ze scenariuszem
/// - {@link api.database.entity.object.ObjectType} - typ obiektu
public interface ObjectTemplateRepository
  extends JpaRepository<ObjectTemplate, Integer> {
  /// Wyszukuje szablony, których tytuł zawiera podany fragment tekstu.
  /// Wyszukiwanie jest niewrażliwe na wielkość liter.
  ///
  /// # JPQL
  /// Używa LOWER do porównania tekstów i CONCAT do utworzenia wzorca.
  ///
  /// @param title fragment tytułu do wyszukania
  /// @param pageable parametry stronicowania
  /// @return strona znalezionych szablonów
  @Query(
    "SELECT t FROM ObjectTemplate t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))"
  )
  Page<ObjectTemplate> findByTitleContaining(
    @Param("title") String title,
    Pageable pageable
  );

  @Query(
    """
    SELECT t
    FROM ObjectTemplate t
        JOIN ScenarioToObjectTemplate stot ON stot.templateId = t.id
    WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))
        AND stot.scenarioId = :scenarioId
    """
  )
  Page<ObjectTemplate> findByTitleContainingAndScenarioId(
    @Param("title") String title,
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  /// Pobiera szablony dostępne w danym scenariuszu.
  ///
  /// # JPQL
  /// Używa złączenia z tabelą ScenarioToObjectTemplate do znalezienia
  /// powiązań szablonów ze scenariuszem.
  ///
  /// @param scenarioId ID scenariusza
  /// @param pageable parametry stronicowania
  /// @return strona szablonów przypisanych do scenariusza
  @Query(
    "SELECT t FROM ObjectTemplate t " +
    "JOIN ScenarioToObjectTemplate s2t ON t.id = s2t.templateId " +
    "WHERE s2t.scenarioId = :scenarioId"
  )
  Page<ObjectTemplate> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  /// Wyszukuje szablony w scenariuszu z opcjonalnym filtrowaniem po typie obiektu.
  ///
  /// # JPQL
  /// - Bazuje na encji ScenarioToObjectTemplate dla lepszej wydajności
  /// - Obsługuje opcjonalny filtr typu obiektu (NULL oznacza wszystkie typy)
  ///
  /// @param scenarioId ID scenariusza
  /// @param objectTypeId ID typu obiektu (opcjonalny)
  /// @param pageable parametry stronicowania
  /// @return strona szablonów spełniających kryteria
  @Query(
    """
    SELECT t
    FROM ObjectTemplate t
         JOIN ScenarioToObjectTemplate stot ON stot.templateId = t.id
    WHERE stot.scenarioId = :scenarioId
    AND t.objectTypeId = :objectTypeId
    """
  )
  Page<ObjectTemplate> findTemplatesByScenarioIdAndObjectTypeId(
    @Param("scenarioId") Integer scenarioId,
    @Param("objectTypeId") Integer objectTypeId,
    Pageable pageable
  );

  @Query(
    value = """
    SELECT template_id FROM qds_scenario_to_object_template stot WHERE stot.scenario_id = :scenarioId
    """,
    nativeQuery = true
  )
  List<Integer> findIdsByScenarioId(@Param("scenarioId") Integer scenarioId);
}
