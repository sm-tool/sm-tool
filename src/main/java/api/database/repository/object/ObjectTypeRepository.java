package api.database.repository.object;

import api.database.entity.object.ObjectType;
import api.database.repository.RefreshableRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające typami obiektów w systemie.
/// Zapewnia operacje na hierarchicznej strukturze typów oraz
/// dostęp do typów w kontekście scenariuszy.
///
/// # Główne funkcjonalności
/// - Podstawowe operacje CRUD na typach obiektów
/// - Operacje na hierarchii typów (przodkowie/potomkowie)
/// - Wyszukiwanie i filtrowanie typów
/// - Walidacja ograniczeń typów (np. globalność)
/// - Paginacja wyników wyszukiwania
///
/// # Hierarchia typów
/// - Typy tworzą strukturę drzewiastą (parent_id)
/// - Zapytania rekurencyjne do nawigacji po hierarchii
///
/// # Powiązane komponenty
/// - {@link ObjectType} - encja reprezentująca typ obiektu
/// - {@link api.database.entity.scenario.ScenarioToObjectType} - powiązanie typu ze scenariuszem
/// - {@link api.database.entity.object.ObjectInstance} - instancje obiektów danego typu
@Repository
public interface ObjectTypeRepository
  extends RefreshableRepository<ObjectType, Integer> {
  /// Sprawdza czy typ obiektu jest oznaczony jako wyłącznie globalny.
  /// Obiekty takiego typu mogą istnieć tylko w wątku globalnym.
  ///
  /// @param typeId ID typu obiektu
  /// @return true jeśli typ jest tylko globalny
  @Query(
    value = "SELECT is_only_global FROM qds_object_type t WHERE t.id=:typeId",
    nativeQuery = true
  )
  Boolean checkOnlyGlobal(@Param("typeId") Integer typeId);

  //Hierarchia
  //TypeHierarchyOperations
  /// Sprawdza relację hierarchiczną między dwoma typami.
  /// Wykorzystuje rekurencyjne CTE do przejścia w górę hierarchii.
  ///
  /// # SQL
  /// 1. Rozpoczyna od potencjalnego potomka
  /// 2. Rekurencyjnie przechodzi po parent_id
  /// 3. Sprawdza czy znaleziono potencjalnego przodka
  ///
  /// @param descendant ID potencjalnego potomka
  /// @param ancestor ID potencjalnego przodka
  /// @return true jeśli descendant jest potomkiem ancestor
  @Query(
    value = """
        WITH RECURSIVE hierarchy AS (
            SELECT id, parent_id
            FROM qds_object_type
            WHERE id = :descendant

            UNION ALL

            SELECT ot.id, ot.parent_id
            FROM qds_object_type ot
                     INNER JOIN hierarchy h ON h.parent_id = ot.id
        )
        SELECT EXISTS(
            SELECT 1
            FROM hierarchy
            WHERE id = :ancestor
        );
    """,
    nativeQuery = true
  )
  Boolean isInHierarchy(
    @Param("descendant") Integer descendant,
    @Param("ancestor") Integer ancestor
  );

  //-----------------------------------------------------Object Type Provider----------------------------------------------------------
  /// Pobiera wszystkich przodków dla wskazanego typu.
  /// Wykorzystuje rekurencyjne CTE do zebrania wszystkich typów nadrzędnych.
  ///
  /// # SQL
  /// 1. Rozpoczyna od wskazanego typu
  /// 2. Rekurencyjnie przechodzi po parent_id w górę
  /// 3. Zwraca wszystkie znalezione ID oprócz początkowego typu
  ///
  /// @param objectTypeId ID typu do analizy
  /// @return Lista ID wszystkich przodków
  @Query(
    value = """
    WITH RECURSIVE hierarchy AS (
        SELECT id, parent_id
        FROM qds_object_type
        WHERE id = :objectTypeId

        UNION ALL

        SELECT ot.id, ot.parent_id
    FROM qds_object_type ot
             INNER JOIN hierarchy h ON ot.id = h.parent_id
    )
    SELECT id
    FROM hierarchy
    WHERE id <> :objectTypeId;
    """,
    nativeQuery = true
  )
  List<Integer> getAllAncestors(@Param("objectTypeId") Integer objectTypeId);

  /// Pobiera typy obiektów dostępne w scenariuszu.
  ///
  /// @param scenarioId ID scenariusza
  /// @param pageable parametry stronicowania
  /// @return Strona typów przypisanych do scenariusza
  @Query(
    """
    SELECT ot
    FROM ObjectType ot
        JOIN ScenarioToObjectType stot ON ot.id = stot.objectTypeId
    WHERE stot.scenarioId = :scenarioId
    """
  )
  Page<ObjectType> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  /// Wyszukuje typy po fragmencie tytułu (niewrażliwe na wielkość liter).
  ///
  /// @param title fragment tytułu do wyszukania
  /// @param pageable parametry stronicowania
  /// @return Strona pasujących typów
  @Query(
    "SELECT ot FROM ObjectType ot WHERE LOWER(ot.title) LIKE LOWER(CONCAT('%', :title, '%'))"
  )
  Page<ObjectType> findByTitleContaining(
    @Param("title") String title,
    Pageable pageable
  );

  /// Wyszukuje typy po fragmencie tytułu (niewrażliwe na wielkość liter).
  ///
  /// @param title fragment tytułu do wyszukania
  /// @param pageable parametry stronicowania
  /// @return Strona pasujących typów
  @Query(
    """
    SELECT ot
    FROM ObjectType ot
        JOIN ScenarioToObjectType stot
    WHERE LOWER(ot.title) LIKE LOWER(CONCAT('%', :title, '%'))
        AND stot.scenarioId =:scenarioId
    """
  )
  Page<ObjectType> findByTitleContainingAndScenarioId(
    @Param("title") String title,
    Pageable pageable,
    @Param("scenarioId") Integer scenarioId
  );

  //-------------Znajdź w hierarchii
  /// Znajduje bezpośrednich potomków wskazanego typu.
  /// Dla parentId=null zwraca typy korzenne (bez rodzica).
  ///
  /// @param parentId ID typu nadrzędnego lub null dla typów korzennych
  /// @return Lista bezpośrednich potomków lub typów korzennych
  @Query(
    value = """
    SELECT ot.* FROM qds_object_type ot
    WHERE (ot.parent_id = :parentId) OR (:parentId IS NULL AND ot.parent_id IS NULL)
    """,
    nativeQuery = true
  )
  List<ObjectType> findByParentId(@Param("parentId") Integer parentId);

  /// Znajduje bezpośrednich potomków typu w kontekście scenariusza.
  /// Dla parentId=null zwraca typy korzenne dostępne w scenariuszu.
  ///
  /// # SQL
  /// Łączy typy z ich powiązaniami ze scenariuszem i filtruje po:
  /// - bezpośrednim rodzicu (lub jego braku dla null)
  /// - przynależności do scenariusza
  ///
  /// @param parentId ID typu nadrzędnego lub null dla typów korzennych
  /// @param scenarioId ID scenariusza
  /// @return Lista potomków/typów korzennych dostępnych w scenariuszu
  @Query(
    value = """
    SELECT ot.*
    FROM qds_object_type ot
             JOIN qds_scenario_to_object_type stot ON ot.id = stot.object_type_id
    WHERE ((ot.parent_id = :parentId) OR (:parentId IS NULL AND ot.parent_id IS NULL))
        AND scenario_id = :scenarioId
    """,
    nativeQuery = true
  )
  List<ObjectType> findByParentIdAndScenarioId(
    @Param("parentId") Integer parentId,
    @Param("scenarioId") Integer scenarioId
  );

  @Query(
    value = """
    SELECT object_type_id FROM qds_scenario_to_object_type stot WHERE stot.scenario_id = :scenarioId
    """,
    nativeQuery = true
  )
  List<Integer> findIdsByScenarioId(@Param("scenarioId") Integer scenarioId);
}
