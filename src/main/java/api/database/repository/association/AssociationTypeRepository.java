package api.database.repository.association;

import api.database.entity.association.AssociationType;
import api.database.model.domain.association.InternalAssociationIdWithObjectTypes;
import api.database.model.response.PossibleAssociationResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium do zarządzania typami asocjacji w systemie.
/// Umożliwia wykonywanie operacji CRUD na encjach {@link AssociationType} oraz
/// zawiera wyspecjalizowane zapytania do wyszukiwania i filtrowania typów asocjacji.
///
/// # Główne funkcjonalności
/// - Pobieranie typów asocjacji po typach obiektów
/// - Filtrowanie typów dla scenariusza z uwzględnieniem typów obiektów
/// - Wyszukiwanie po opisie
/// - Analiza hierarchii typów obiektów dla asocjacji
@Repository
public interface AssociationTypeRepository
  extends JpaRepository<AssociationType, Integer> {
  //---------------------------------------------Association Type Provider----------------------------------------------

  /// Wyszukuje typy asocjacji po fragmencie opisu (case-insensitive).
  ///
  /// @param description szukany fragment opisu
  /// @param pageable parametry stronicowania
  /// @return strona z typami asocjacji zawierającymi podany tekst w opisie
  @Query(
    "SELECT at FROM AssociationType at WHERE LOWER(at.description) LIKE LOWER(CONCAT('%', :description, '%' ))"
  )
  Page<AssociationType> findByDescriptionContaining(
    @Param("description") String description,
    Pageable pageable
  );

  /// Znajduje możliwe typy asocjacji między wybranym typem obiektu a dostępnymi obiektami.
  /// Uwzględnia hierarchię typów obiektów i ograniczenia scenariusza.
  ///
  /// @param selectedObjectType typ wybranego obiektu
  /// @param availableObjectTypes typy dostępnych obiektów
  /// @param objectIds identyfikatory dostępnych obiektów
  /// @return lista możliwych asocjacji z obiektami
  @Query(
    value = """
    WITH RECURSIVE object_type_hierarchy AS (
        SELECT id, parent_id, 0 as level
        FROM qds_object_type
        WHERE id = ANY(:availableObjectTypes)

        UNION ALL

        SELECT ot.id, ot.parent_id, h.level + 1
        FROM qds_object_type ot
                 JOIN object_type_hierarchy h ON h.parent_id = ot.id
    )
    --BLOKOWANIE WIĘKSZEJ ILOŚCI TYPÓW
    SELECT DISTINCT ON (o.id) o.id as object_id, at.id as association_type_id
    FROM unnest(:objectIds) o(id)
             JOIN qds_object oi ON oi.id = o.id
             JOIN qds_object_type base_type ON base_type.id = oi.object_type_id
             JOIN object_type_hierarchy h ON h.id = base_type.id
             JOIN qds_association_type at ON (
        at.first_object_type_id = :selectedObjectType
            AND at.second_object_type_id = base_type.id
        )
    ORDER BY o.id, at.id;
    """,
    nativeQuery = true
  )
  List<PossibleAssociationResponse> getAvailableAssociationTypesWithObjects(
    @Param("selectedObjectType") Integer selectedObjectType,
    @Param("availableObjectTypes") Integer[] availableObjectTypes,
    @Param("objectIds") Integer[] objectIds
  );

  /// Pobiera informacje o typach obiektów dla wskazanych typów asocjacji.
  ///
  /// @param associationTypeIds tablica identyfikatorów typów asocjacji
  /// @return lista zawierająca identyfikatory typów obiektów dla każdej asocjacji
  @Query(
    value = """
    SELECT at.id, at.first_object_type_id, at.second_object_type_id
           FROM qds_association_type at WHERE at.id = ANY(:associationTypeIds)
    """,
    nativeQuery = true
  )
  List<InternalAssociationIdWithObjectTypes> getAssociationTypesObjectTypes(
    @Param("associationTypeIds") Integer[] associationTypeIds
  );

  /// Wyszukuje typy asocjacji po drugim typie obiektu.
  ///
  /// @param typeId identyfikator drugiego typu obiektu
  /// @param pageable parametry stronicowania
  /// @return strona z pasującymi typami asocjacji
  Page<AssociationType> findBySecondObjectTypeId(
    Integer typeId,
    Pageable pageable
  );

  @Query(
    """
    SELECT at
    FROM AssociationType at
    WHERE EXISTS (
        SELECT 1
        FROM ScenarioToObjectType stot1
        WHERE stot1.scenarioId = :scenarioId
        AND stot1.objectTypeId = at.firstObjectTypeId
    )
    AND EXISTS (
        SELECT 1
        FROM ScenarioToObjectType stot2
        WHERE stot2.scenarioId = :scenarioId
        AND stot2.objectTypeId = at.secondObjectTypeId
    )
    AND at.secondObjectTypeId = :typeId
    """
  )
  Page<AssociationType> findBySecondObjectTypeIdAndScenarioId(
    @Param("typeId") Integer typeId,
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  /// Wyszukuje typy asocjacji po pierwszym typie obiektu.
  ///
  /// @param typeId identyfikator pierwszego typu obiektu
  /// @param pageable parametry stronicowania
  /// @return strona z pasującymi typami asocjacji
  Page<AssociationType> findByFirstObjectTypeId(
    Integer typeId,
    Pageable pageable
  );

  @Query(
    """
    SELECT at
    FROM AssociationType at
    WHERE EXISTS (
        SELECT 1
        FROM ScenarioToObjectType stot1
        WHERE stot1.scenarioId = :scenarioId
        AND stot1.objectTypeId = at.firstObjectTypeId
    )
    AND EXISTS (
        SELECT 1
        FROM ScenarioToObjectType stot2
        WHERE stot2.scenarioId = :scenarioId
        AND stot2.objectTypeId = at.secondObjectTypeId
    )
    AND at.firstObjectTypeId = :typeId
    """
  )
  Page<AssociationType> findByFirstObjectTypeIdAndScenarioId(
    @Param("typeId") Integer typeId,
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  @Query(
    """
    SELECT at
    FROM AssociationType at
    WHERE EXISTS (
        SELECT 1
        FROM ScenarioToObjectType stot1
        WHERE stot1.scenarioId = :scenarioId
        AND stot1.objectTypeId = at.firstObjectTypeId
    )
    AND EXISTS (
        SELECT 1
        FROM ScenarioToObjectType stot2
        WHERE stot2.scenarioId = :scenarioId
        AND stot2.objectTypeId = at.secondObjectTypeId
    )
    AND LOWER(at.description) LIKE LOWER(CONCAT('%', :description, '%' ))
    """
  )
  Page<AssociationType> findByDescriptionContainingAndScenarioId(
    @Param("description") String description,
    @Param("scenarioId") Integer scenarioId,
    Pageable pageable
  );

  @Query(
    """
    SELECT at
    FROM AssociationType at
    WHERE EXISTS (
        SELECT 1
        FROM ScenarioToObjectType stot1
        WHERE stot1.scenarioId = :scenarioId
        AND stot1.objectTypeId = at.firstObjectTypeId
    )
    AND EXISTS (
        SELECT 1
        FROM ScenarioToObjectType stot2
        WHERE stot2.scenarioId = :scenarioId
        AND stot2.objectTypeId = at.secondObjectTypeId
    )
    """
  )
  Page<AssociationType> findAllByScenarioId(
    Integer scenarioId,
    Pageable pageable
  );
}
