package api.database.repository.object;

import api.database.entity.object.QdsObjectType;
import api.database.model.association.QdsInfoAssociationObjectTypes;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające typami obiektów.
/// Obsługuje:
/// - Wyszukiwanie typów dostępnych w scenariuszu
/// - Zarządzanie hierarchią typów (przodkowie/potomkowie)
/// - Walidację typów w kontekście scenariusza
@Repository
public interface QdsObjectTypeRepository
  extends JpaRepository<QdsObjectType, Integer> {
  @Query(
    "SELECT ot FROM QdsObjectType ot JOIN QdsScenarioToObjectType sto ON ot.id = sto.objectTypeId WHERE sto.scenarioId = :scenarioId"
  )
  Page<QdsObjectType> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  /// Sprawdza czy typ obiektu jest oznaczony jako wyłącznie globalny.
  ///
  /// @param typeId identyfikator typu
  /// @return true jeśli typ jest tylko globalny
  @Query(
    value = "SELECT is_only_global FROM qds_object_type t WHERE t.id=:typeId",
    nativeQuery = true
  )
  Boolean checkOnlyGlobal(@Param("typeId") Integer typeId);

  /// Pobiera typy dla listy obiektów.
  ///
  /// @param objectIds lista identyfikatorów obiektów
  /// @return lista typów obiektów
  @Query(
    value = "SELECT object_type_id FROM qds_object WHERE id IN (:objectIds) ORDER BY id",
    nativeQuery = true
  )
  List<Integer> getObjectsTypes(@Param("objectIds") List<Integer> objectIds);

  //Hierarchia
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

  /// Sprawdza czy istnieją typy z danym rodzicem.
  ///
  /// @param parentId identyfikator rodzica
  boolean existsByParentId(Integer parentId);

  /// Pobiera typ szablonu obiektu.
  ///
  /// @param templateId identyfikator szablonu
  /// @return identyfikator typu
  @Query(
    value = "SELECT object_type_id FROM qds_object_template WHERE id = :templateId",
    nativeQuery = true
  )
  Integer getTemplateType(@Param("templateId") Integer templateId);

  /// Sprawdza czy obiekt o danym typie i szablonie może być dodany do scenariusza.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param typeId identyfikator typu
  /// @param templateId identyfikator szablonu
  /// @return true jeśli obiekt może być dodany
  @Query(
    value = """
        SELECT EXISTS(
            SELECT 1 FROM qds_scenario_to_object_type
            WHERE object_type_id = :typeId AND scenario_id=:scenarioId
        ) AND EXISTS(
            SELECT 1 FROM qds_scenario_to_object_template
            WHERE template_id=:templateId AND scenario_id=:scenarioId)
    """,
    nativeQuery = true
  )
  Boolean canAddObjectToScenario(
    @Param("scenarioId") Integer scenarioId,
    @Param("typeId") Integer typeId,
    @Param("templateId") Integer templateId
  );

  @Query(
    value = "SELECT first_object_type_id, second_object_type_id FROM qds_association_type WHERE id = :associationTypeId",
    nativeQuery = true
  )
  QdsInfoAssociationObjectTypes getObjectTypesFromAssociationType(
    @Param("associationTypeId") Integer associationTypeId
  );
}
