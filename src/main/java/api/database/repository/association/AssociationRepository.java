package api.database.repository.association;

import api.database.entity.association.Association;
import api.database.entity.association.AssociationChange;
import api.database.model.domain.association.InternalAssociationKeyWithId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/// Repozytorium zarządzające asocjacjami (powiązaniami) między obiektami w systemie.
/// Odpowiada za:
/// - Podstawowe operacje CRUD na asocjacjach
/// - Czyszczenie nieużywanych asocjacji
/// - Wyszukiwanie asocjacji według typów obiektów
///
/// # Powiązania
/// - {@link Association} - encja reprezentująca asocjację
/// - {@link AssociationChange} - historia zmian asocjacji
public interface AssociationRepository
  extends JpaRepository<Association, Integer> {
  /// Usuwa asocjacje, które nie mają żadnych zmian.
  /// Używane do czyszczenia "osieroconych" asocjacji,
  /// które nie są już wykorzystywane w żadnym kontekście czasowym.
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

  /// Pobiera asocjacje dla obiektów danego typu.
  /// Wykonuje eager loading powiązanych encji:
  /// - typ asocjacji
  /// - pierwszy obiekt
  /// - drugi obiekt
  ///
  /// @param objectTypeId id typu obiektu do wyszukania
  /// @return lista asocjacji gdzie jeden z obiektów jest danego typu
  @Query(
    value = """
    SELECT a
    FROM Association a
    JOIN FETCH a.associationType at
    JOIN FETCH a.object1 o1
    JOIN FETCH a.object2 o2
    WHERE at.firstObjectTypeId = :objectTypeId
    OR at.secondObjectTypeId = :objectTypeId
    """
  )
  List<Association> findAssociationsByObjectTypeId(
    @Param("objectTypeId") Integer objectTypeId
  );

  /// Pobiera asocjacje na podstawie par kluczy (typ_asocjacji, obiekt1, obiekt2).
  /// Umożliwia masowe wyszukiwanie asocjacji na podstawie ich kluczy biznesowych.
  ///
  /// @param associationTypeIds lista id typów asocjacji
  /// @param object1Ids lista id pierwszych obiektów
  /// @param object2Ids lista id drugich obiektów
  /// @return lista znalezionych asocjacji wraz z ich identyfikatorami
  @Query(
    value = """
    SELECT
        a.association_type_id,
        a.object1_id,
        a.object2_id,
        a.id as association_id
    FROM qds_association a
    JOIN (
        SELECT
            unnest(:associationTypeIds) as association_type_id,
            unnest(:object1Ids) as object1_id,
            unnest(:object2Ids) as object2_id
    ) keys ON a.association_type_id = keys.association_type_id
          AND a.object1_id = keys.object1_id
          AND a.object2_id = keys.object2_id
    """,
    nativeQuery = true
  )
  List<InternalAssociationKeyWithId> getAssociationsByKeys(
    @Param("associationTypeIds") Integer[] associationTypeIds,
    @Param("object1Ids") Integer[] object1Ids,
    @Param("object2Ids") Integer[] object2Ids
  );
}
