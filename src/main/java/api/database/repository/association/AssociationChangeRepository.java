package api.database.repository.association;

import api.database.entity.association.AssociationChange;
import api.database.model.data.EventAssociationsStateData;
import api.database.model.domain.association.InternalEventAssociationChange;
import api.database.model.domain.association.InternalLastAssociationChange;
import api.database.model.domain.association.InternalLastAssociationOperation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/// Repozytorium zarządzające zmianami asocjacji w systemie. Odpowiada za:
/// - Zarządzanie historią zmian asocjacji
/// - Pobieranie stanu asocjacji dla wydarzeń
/// - Czyszczenie nieaktualnych zmian
///
/// # Powiązania
/// - {@link api.database.entity.association.AssociationChange}
/// - {@link InternalEventAssociationChange}
public interface AssociationChangeRepository
  extends JpaRepository<AssociationChange, Integer> {
  /// Usuwa zmiany asocjacji dla wskazanych obiektów w określonym czasie.
  /// Zmiany są usuwane gdy dotyczą któregokolwiek z podanych obiektów
  /// (jako object1 lub object2).
  ///
  /// @param time moment w czasie dla którego usuwane są zmiany
  /// @param object1Ids lista ID pierwszych obiektów w asocjacjach
  /// @param object2Ids lista ID drugich obiektów w asocjacjach
  @Modifying
  @Query(
    value = """
            DELETE FROM qds_association_change ac
            USING qds_event e, qds_association a
            WHERE ac.event_id = e.id
            AND ac.association_id = a.id
            AND e.event_time = :time
            AND a.object1_id = ANY(:object1Ids)
            OR a.object2_id = ANY(:object2Ids)
    """,
    nativeQuery = true
  )
  void deleteAssociationChangesInTimeByObjectIds(
    @Param("time") Integer time,
    @Param("object1Ids") Integer[] object1Ids,
    @Param("object2Ids") Integer[] object2Ids
  );

  //--------------------------------------Association Change Inator-----------------------------------------------------
  /// Pobiera ostatnie operacje wykonane na asocjacjach przed wskazanym wydarzeniem.
  /// Dla każdej asocjacji zwracana jest tylko ostatnia operacja wykonana przed danym
  /// wydarzeniem.
  ///
  /// @param associationIds lista ID asocjacji do sprawdzenia
  /// @param eventId ID wydarzenia względem którego sprawdzane są operacje
  /// @return Lista obiektów zawierających ID asocjacji i typ ostatniej operacji
  @Query(
    value = """
        SELECT DISTINCT ON (ac.association_id)
            ac.association_id,
            ac.association_operation
        FROM qds_association_change ac
        JOIN qds_event e ON e.id = ac.event_id
        JOIN qds_event target_e ON target_e.id = :eventId
        WHERE e.event_time < target_e.event_time
        AND ac.association_id = ANY(:associationIds)
        ORDER BY ac.association_id, e.event_time DESC
    """,
    nativeQuery = true
  )
  List<InternalLastAssociationOperation> getLastOperations(
    @Param("associationIds") Integer[] associationIds,
    @Param("eventId") Integer eventId
  );

  /// Usuwa zmiany asocjacji dla wskazanego wydarzenia oraz jedno późniejsze (jeśli istnieje)
  /// ze względu na powtórzenie zmiany. Używane przy czyszczeniu historii zmian.
  ///
  /// @param eventId ID wydarzenia
  /// @param associationIds lista ID asocjacji do usunięcia
  @Modifying
  @Query(
    value = """
    WITH next_changes AS (
        SELECT DISTINCT ON (ac.association_id)
            ac.id
        FROM qds_association_change ac
        JOIN qds_event current_e ON current_e.id = :eventId
        JOIN qds_event e ON e.id = ac.event_id
        WHERE e.event_time > current_e.event_time
        AND ac.association_id = ANY(:associationIds)
        ORDER BY ac.association_id, e.event_time
    )
    DELETE FROM qds_association_change
    WHERE (event_id = :eventId AND association_id = ANY(:associationIds))
       OR (id = ANY(SELECT id FROM next_changes));
    """,
    nativeQuery = true
  )
  void deleteChangesAndNext(
    @Param("eventId") Integer eventId,
    @Param("associationIds") Integer[] associationIds
  );

  @Modifying
  @Query(
    value = """
    WITH next_changes AS (
        SELECT DISTINCT ON (ac.association_id)
            ac.id
        FROM qds_association_change ac
        JOIN qds_event current_e ON current_e.id = :eventId
        JOIN qds_event e ON e.id = ac.event_id
        WHERE e.event_time > current_e.event_time
        AND ac.association_id = ANY(:associationIds)
        ORDER BY ac.association_id, e.event_time
    )
    DELETE FROM qds_association_change
    WHERE id = ANY(SELECT id FROM next_changes);
    """,
    nativeQuery = true
  )
  void deleteNextChanges(
    @Param("eventId") Integer eventId,
    @Param("associationIds") Integer[] associationIds
  );

  //-------------------------------------------Event State Provider----------------------------------------------------
  /// Pobiera wszystkie zmiany asocjacji dla wskazanych wydarzeń.
  /// Zwraca pełne informacje o zmianie wraz z typem asocjacji i powiązanymi obiektami.
  ///
  /// @param eventIds lista ID wydarzeń
  /// @return Lista zmian asocjacji z informacjami o typie i obiektach
  @Query(
    value = """
    SELECT
        a.association_type_id,
        a.object1_id,
        a.object2_id,
        c.event_id,
        c.association_operation
    FROM qds_association_change c JOIN qds_association a ON c.association_id = a.id
    WHERE c.event_id = ANY(:eventIds)
    """,
    nativeQuery = true
  )
  List<InternalEventAssociationChange> getAssociationChanges(
    @Param("eventIds") Integer[] eventIds
  );

  /// Pobiera ostatnie zmiany asocjacji przed wskazanymi wydarzeniami.
  /// Używane do śledzenia poprzedniego stanu asocjacji przed każdym wydarzeniem.
  ///
  /// @param eventIds lista ID wydarzeń
  /// @return Lista ostatnich zmian przed wydarzeniami
  @Query(
    value = """
    WITH AssociationChanges AS (
        SELECT
            a.association_type_id,
            a.object1_id,
            a.object2_id,
            ac.event_id,
            e.event_time
        FROM qds_association_change ac
                 JOIN qds_association a ON ac.association_id = a.id
                 JOIN qds_event e ON ac.event_id = e.id
        WHERE e.id = ANY(:eventIds)
    ),
         LastValues AS (
             SELECT
                 association_type_id,
                 object1_id,
                 object2_id,
                 association_operation,
                 ac2.event_id as target_event_id
             FROM AssociationChanges ac2
                      JOIN qds_association_change ac ON ac.association_id IN (
                 SELECT id FROM qds_association a
                 WHERE a.association_type_id = ac2.association_type_id
                   AND a.object1_id = ac2.object1_id
                   AND a.object2_id = ac2.object2_id
             )
                      JOIN qds_event e ON ac.event_id = e.id
             WHERE e.event_time = (
                 SELECT MAX(e2.event_time)
                 FROM qds_association_change ac3
                          JOIN qds_association a3 ON ac3.association_id = a3.id
                          JOIN qds_event e2 ON ac3.event_id = e2.id
                 WHERE e2.event_time < ac2.event_time
                   AND a3.association_type_id = ac2.association_type_id
                   AND a3.object1_id = ac2.object1_id
                   AND a3.object2_id = ac2.object2_id
             )
         )
    SELECT * FROM LastValues
    """,
    nativeQuery = true
  )
  List<InternalLastAssociationChange> getLastAssociationChanges(
    @Param("eventIds") Integer[] eventIds
  );

  /// Pobiera stan wszystkich asocjacji dostępnych w kontekście wskazanego wydarzenia.
  /// Uwzględnia:
  /// - Asocjacje obiektów z wątku wydarzenia
  /// - Asocjacje z obiektami globalnymi
  /// - Tylko zmiany do momentu wydarzenia
  ///
  /// @param eventId ID wydarzenia
  /// @param scenarioId ID scenariusza
  /// @return Lista asocjacji aktywnych w momencie wydarzenia
  @Query(
    value = """
    WITH EventInfo AS (
        SELECT e.thread_id, e.event_time
        FROM qds_event e
        WHERE e.id = :eventId
    ),
         GlobalThread AS (
             SELECT id
             FROM qds_thread
             WHERE is_global = true
             AND scenario_id = :scenarioId
         ),
         AvailableObjects AS (
             SELECT object_id
             FROM qds_thread_to_object
             WHERE thread_id = (SELECT thread_id FROM EventInfo)
                OR thread_id = (SELECT id FROM GlobalThread)
         )
    SELECT DISTINCT ON (a.id)
        a.association_type_id,
        a.object1_id,
        a.object2_id,
        ac.association_operation
    FROM qds_association a
             JOIN qds_association_change ac ON ac.association_id = a.id
             JOIN qds_event e ON ac.event_id = e.id
    WHERE (a.object1_id IN (SELECT object_id FROM AvailableObjects)
        OR a.object2_id IN (SELECT object_id FROM AvailableObjects))
      AND e.event_time <= (SELECT event_time FROM EventInfo)
    ORDER BY a.id, e.event_time DESC
    """,
    nativeQuery = true
  )
  List<EventAssociationsStateData> getAssociationsStateForEvent(
    @Param("eventId") Integer eventId,
    @Param("scenarioId") Integer scenarioId
  );

  @Query(
    value = """
    WITH EventInfo AS (
        SELECT e.thread_id, e.event_time
        FROM qds_event e
        WHERE e.id = :eventId
        ),
        GlobalThread AS (
             SELECT id
             FROM qds_thread
             WHERE is_global = true
             AND scenario_id = :scenarioId
         ),
         AvailableObjects AS (
             SELECT object_id
             FROM qds_thread_to_object
             WHERE thread_id = (SELECT thread_id FROM EventInfo)
                OR thread_id = (SELECT id FROM GlobalThread)
         )
    SELECT DISTINCT ON (a.id)
        a.association_type_id,
        a.object1_id,
        a.object2_id,
        ac.association_operation
    FROM qds_association a
             JOIN qds_association_change ac ON ac.association_id = a.id
             JOIN qds_event e ON ac.event_id = e.id
    WHERE (a.object1_id IN (SELECT object_id FROM AvailableObjects)
        OR a.object2_id IN (SELECT object_id FROM AvailableObjects))
      AND e.event_time < (SELECT event_time FROM EventInfo)
    ORDER BY a.id, e.event_time DESC
    """,
    nativeQuery = true
  )
  List<EventAssociationsStateData> getAssociationsPreviousStateForEvent(
    Integer eventId,
    Integer scenarioId
  );
}
