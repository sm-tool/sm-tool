package api.database.repository.association;

import api.database.entity.association.QdsAssociation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QdsAssociationRepository
  extends JpaRepository<QdsAssociation, Integer> {
  @Query(
    value = "SELECT id FROM qds_association WHERE " +
    "association_type_id=:associationTypeId AND object1_id=:object1Id AND object2_id=:object2Id",
    nativeQuery = true
  )
  Integer getAssociation(
    @Param("associationTypeId") Integer associationTypeId,
    @Param("object1Id") Integer object1Id,
    @Param("object2Id") Integer object2Id
  );

  @Modifying
  @Query(
    value = """
    DELETE FROM qds_association a
    WHERE a.id NOT IN
    (
        SELECT association_id
        FROM qds_association_change
    )
    """,
    nativeQuery = true
  )
  void deleteEmptyAssociations();

  @Query(
    value = """
        SELECT a
        FROM QdsAssociation a
        WHERE (
            a.associationType.firstObjectTypeId = :objectTypeId
            OR a.associationType.secondObjectTypeId = :objectTypeId
        )
    """
  )
  List<QdsAssociation> findAssociationsByObjectTypeId(
    @Param("objectTypeId") Integer objectTypeId
  );
}
