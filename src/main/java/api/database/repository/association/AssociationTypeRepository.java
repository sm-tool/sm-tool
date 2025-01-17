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

@Repository
public interface AssociationTypeRepository
  extends JpaRepository<AssociationType, Integer> {
  //---------------------------------------------Association Type Provider----------------------------------------------

  @Query(
    value = """
    SELECT at.* FROM qds_association_type at
    WHERE first_object_type_id = ANY(:objectTypes)
        OR second_object_type_id = ANY(:objectTypes)
    """,
    nativeQuery = true
  )
  List<AssociationType> getByObjectTypes(
    @Param("objectTypes") Integer[] objectTypes
  );

  // Fetch all association types for a given scenario, optionally filtering by first and/or second object type
  @Query(
    value = """
    SELECT at.*
    FROM qds_association_type at
    WHERE
        at.first_object_type_id IN (
            SELECT stot.object_type_id
            FROM qds_scenario_to_object_type stot
            WHERE stot.scenario_id = :scenarioId
        )
        AND at.second_object_type_id IN (
            SELECT stot.object_type_id
            FROM qds_scenario_to_object_type stot
            WHERE stot.scenario_id = :scenarioId
        )
        AND (CAST(:firstObjectTypesId AS INT[]) IS NULL OR at.first_object_type_id = ANY(:firstObjectTypesId))
        AND (CAST(:secondObjectTypesId AS INT[]) IS NULL OR at.second_object_type_id= ANY(:secondObjectTypesId))
    """,
    //Dla bezpieczeństwa - chociaż i tak powinna działać
    countQuery = """
    SELECT COUNT(*)
        FROM qds_association_type at
    WHERE
        at.first_object_type_id IN (
            SELECT stot.object_type_id
            FROM qds_scenario_to_object_type stot
            WHERE stot.scenario_id = :scenarioId
        )
        AND at.second_object_type_id IN (
            SELECT stot.object_type_id
            FROM qds_scenario_to_object_type stot
            WHERE stot.scenario_id = :scenarioId
        )
        AND (CAST(:firstObjectTypesId AS INT[]) IS NULL OR at.first_object_type_id = ANY(:firstObjectTypesId))
        AND (CAST(:secondObjectTypesId AS INT[]) IS NULL OR at.second_object_type_id= ANY(:secondObjectTypesId))
    """,
    nativeQuery = true
  )
  Page<AssociationType> findAssociationTypes(
    Pageable pageable,
    @Param("scenarioId") Integer scenarioId,
    @Param("firstObjectTypesId") Integer[] firstObjectTypesId,
    @Param("secondObjectTypesId") Integer[] secondObjectTypesId
  );

  @Query(
    "SELECT at FROM AssociationType at WHERE LOWER(at.description) LIKE LOWER(CONCAT('%', :description, '%' ))"
  )
  Page<AssociationType> findByDescriptionContaining(
    @Param("description") String description,
    Pageable pageable
  );

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
    SELECT DISTINCT o.id as object_id, at.id as association_type_id
    FROM unnest(:objectIds) o(id)
        JOIN qds_object oi ON oi.id = o.id
        JOIN qds_object_type base_type ON base_type.id = oi.object_type_id
        JOIN object_type_hierarchy h ON h.id = base_type.id
        JOIN qds_association_type at ON (
            at.first_object_type_id = :selectedObjectType
                AND at.second_object_type_id = base_type.id
            )
        JOIN qds_scenario_to_object_type stot ON stot.object_type_id = at.id
    WHERE stot.scenario_id = :scenarioId
    ORDER BY o.id, at.id
    """,
    nativeQuery = true
  )
  List<PossibleAssociationResponse> getAvailableAssociationTypesWithObjects(
    @Param("selectedObjectType") Integer selectedObjectType,
    @Param("availableObjectTypes") Integer[] availableObjectTypes,
    @Param("objectIds") Integer[] objectIds,
    @Param("scenarioId") Integer scenarioId
  );

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

  Page<AssociationType> findBySecondObjectTypeId(
    Integer typeId,
    Pageable pageable
  );

  Page<AssociationType> findByFirstObjectTypeId(
    Integer typeId,
    Pageable pageable
  );
}
