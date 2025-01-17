package api.database.repository.object;

import api.database.entity.object.ObjectType;
import api.database.repository.RefreshableRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające typami obiektów.
/// Obsługuje:
/// - Wyszukiwanie typów dostępnych w scenariuszu
/// - Zarządzanie hierarchią typów (przodkowie/potomkowie)
/// - Walidację typów w kontekście scenariusza
@Repository
public interface ObjectTypeRepository
  extends RefreshableRepository<ObjectType, Integer> {
  /// Sprawdza czy typ obiektu jest oznaczony jako wyłącznie globalny.
  ///
  /// @param typeId identyfikator typu
  /// @return true jeśli typ jest tylko globalny
  @Query(
    value = "SELECT is_only_global FROM qds_object_type t WHERE t.id=:typeId",
    nativeQuery = true
  )
  Boolean checkOnlyGlobal(@Param("typeId") Integer typeId);

  //Hierarchia
  //TypeHierarchyOperations
  /// Sprawdza czy jeden typ jest potomkiem drugiego w hierarchii.
  ///
  /// @param descendant potencjalny potomek
  /// @param ancestor potencjalny przodek
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
  /// Pobiera wszystkich przodków dla danego typu obiektu.
  ///
  /// @param objectTypeId identyfikator typu
  /// @return lista identyfikatorów wszystkich przodków
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

  @Query(
    "SELECT ot FROM ObjectType ot JOIN ScenarioToObjectType sto ON ot.id = sto.objectTypeId WHERE sto.scenarioId = :scenarioId"
  )
  Page<ObjectType> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  @Query(
    "SELECT ot FROM ObjectType ot WHERE LOWER(ot.title) LIKE LOWER(CONCAT('%', :title, '%'))"
  )
  Page<ObjectType> findByTitleContaining(
    @Param("title") String title,
    Pageable pageable
  );

  @Query(
    "SELECT ot FROM ObjectType ot WHERE LOWER(ot.description) LIKE LOWER(CONCAT('%', :description, '%'))"
  )
  Page<ObjectType> findByDescriptionContaining(
    @Param("description") String description,
    Pageable pageable
  );

  //-------------Znajdź w hierarchii

  @Query(
    value = """
    SELECT ot.* FROM qds_object_type ot
    WHERE (ot.parent_id = :parentId) OR (:parentId IS NULL AND ot.parent_id IS NULL)
    """,
    nativeQuery = true
  )
  List<ObjectType> findByParentId(@Param("parentId") Integer parentId);

  @Query(
    value = """
    SELECT ot.*
    FROM qds_object_type ot
        JOIN qds_scenario_to_object_type stot ON ot.id = stot.object_type_id
    WHERE (ot.parent_id = :parentId) OR (:parentId IS NULL AND ot.parent_id IS NULL)
    AND scenario_id = :scenarioId
    """,
    nativeQuery = true
  )
  List<ObjectType> findByParentIdAndScenarioId(
    @Param("parentId") Integer parentId,
    @Param("scenarioId") Integer scenarioId
  );
}
