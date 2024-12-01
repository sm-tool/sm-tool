package api.database.repository.association;

import api.database.entity.association.QdsAssociationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsAssociationTypeRepository
  extends JpaRepository<QdsAssociationType, Integer> {
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
  Page<QdsAssociationType> findAssociationTypes(
    Pageable pageable,
    @Param("scenarioId") Integer scenarioId,
    @Param("firstObjectTypesId") Integer[] firstObjectTypesId,
    @Param("secondObjectTypesId") Integer[] secondObjectTypesId
  );
}
