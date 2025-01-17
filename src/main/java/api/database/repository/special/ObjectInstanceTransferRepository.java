package api.database.repository.special;

import api.database.entity.object.ObjectInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium specjalne do zarządzania transferami obiektów między wątkami.
/// Odpowiada za:
/// - Przenoszenie obiektów między wątkami
/// - Oznaczanie niepoprawnych rozgałęzień FORK
/// - Czyszczenie nieprawidłowych powiązań obiektów
/// - Usuwanie osieroconych zmian atrybutów i asocjacji
///
/// # Powiązania
/// - {@link ObjectInstance} - encja reprezentująca instancję obiektu
/// - {@link api.database.entity.thread.Thread} - wątek zawierający obiekty
/// - {@link api.database.entity.thread.Branching} - rozgałęzienie wymagające transferu
@Repository
public interface ObjectInstanceTransferRepository
  extends JpaRepository<ObjectInstance, Integer> {
  //------------------------------------------------Object Instance Transfer--------------------------------------------
  /// Dodaje powiązania obiektów z wątkami w operacji masowej.
  /// Używane przy transferze obiektów między wątkami.
  ///
  /// @param threads tablica ID wątków docelowych
  /// @param objects tablica ID przenoszonych obiektów
  /// @apiNote Każdy obiekt z objects\[i] jest przypisywany do wątku threads\[i]
  @Modifying
  @Query(
    value = """
    INSERT INTO qds_thread_to_object (id, thread_id, object_id)
    SELECT nextval('qds_thread_to_object_id_seq'), t.thread_id, t.object_id
    FROM UNNEST(:threads, :objects) AS t(thread_id, object_id);
    """,
    nativeQuery = true
  )
  void transferObjectsToThreads(
    @Param("threads") Integer[] threads,
    @Param("objects") Integer[] objects
  );

  /// Oznacza rozgałęzienia FORK jako niepoprawne.
  /// Używane gdy wykryto problem z transferem obiektów.
  ///
  /// @param forksToMark lista ID rozgałęzień do oznaczenia
  @Modifying
  @Query(
    value = """
    UPDATE qds_branching SET is_correct = FALSE WHERE id = ANY(:forksToMark)
    """,
    nativeQuery = true
  )
  void markForksAsIncorrect(@Param("forksToMark") Integer[] forksToMark);

  //-----------------------------------------------Object State Cleaner-------------------------------------------------
  /// Usuwa wskazane powiązania obiektów z wątkami.
  /// Używane przy czyszczeniu nieprawidłowych transferów.
  ///
  /// @param threads tablica ID wątków
  /// @param objects tablica ID obiektów
  /// @apiNote Usuwane są pary (threads\[i], objects\[i])
  @Modifying
  @Query(
    value = """
    DELETE FROM qds_thread_to_object tto
    USING UNNEST(:threads, :objects) AS t(thread_id, object_id)
    WHERE tto.thread_id = t.thread_id AND tto.object_id = t.object_id;
    """,
    nativeQuery = true
  )
  void deleteSpecificObjectConnections(
    @Param("threads") Integer[] threads,
    @Param("objects") Integer[] objects
  );

  /// Usuwa zmiany atrybutów dla obiektów niedostępnych w wątku.
  /// Czyści zmiany gdy obiekt:
  /// - Nie jest dostępny w wątku wydarzenia
  /// - Nie jest obiektem globalnym
  ///
  /// @param scenarioId ID scenariusza do wyczyszczenia
  @Modifying
  @Query(
    value = """
    WITH orphaned_event_ids AS (
        SELECT e.id
        FROM qds_event e
            JOIN qds_thread t ON t.id = e.thread_id
            JOIN qds_attribute_change ac ON ac.event_id = e.id
            JOIN qds_attribute a ON a.id = ac.attribute_id
        WHERE t.scenario_id = :scenarioId
            AND NOT EXISTS (
                SELECT 1
                FROM qds_thread_to_object tto
                WHERE
                    tto.thread_id = e.thread_id AND
                    tto.object_id = a.object_id
            )
            AND NOT EXISTS (
                SELECT 1
                FROM qds_thread_to_object tto
                    JOIN qds_thread gt ON gt.id = tto.thread_id AND
                        gt.scenario_id = :scenarioId AND
                        gt.is_global = TRUE
            WHERE
                tto.object_id = a.object_id
        )
    )
    DELETE FROM qds_attribute_change ac
    WHERE ac.event_id IN (SELECT id FROM orphaned_event_ids);
    """,
    nativeQuery = true
  )
  void deleteInvalidAttributeChanges(@Param("scenarioId") Integer scenarioId);

  /// Usuwa zmiany asocjacji dla obiektów niedostępnych w wątku.
  /// Czyści zmiany gdy choć jeden z obiektów asocjacji:
  /// - Nie jest dostępny w wątku wydarzenia
  /// - Nie jest obiektem globalnym
  ///
  /// @param scenarioId ID scenariusza do wyczyszczenia
  @Modifying
  @Query(
    value = """
    WITH orphaned_event_ids AS (
        SELECT e.id
        FROM qds_event e
                 JOIN qds_thread t ON t.id = e.thread_id
                 JOIN qds_association_change ac ON ac.event_id = e.id
                 JOIN qds_association a ON a.id = ac.association_id
        WHERE t.scenario_id = :scenarioId
          AND NOT EXISTS (
            SELECT 1
            FROM qds_thread_to_object tto
            WHERE
                tto.thread_id = e.thread_id AND
                (tto.object_id = a.object1_id OR tto.object_id = a.object2_id)
        )
          AND NOT EXISTS (
            SELECT 1
            FROM qds_thread_to_object tto
                     JOIN qds_thread gt ON gt.id = tto.thread_id AND
                                           gt.scenario_id = :scenarioId AND
                                           gt.is_global = TRUE
            WHERE
                tto.object_id = a.object1_id OR tto.object_id = a.object2_id
        )
    )
    DELETE FROM qds_association_change ac
    WHERE ac.event_id IN (SELECT id FROM orphaned_event_ids);
    """,
    nativeQuery = true
  )
  void deleteInvalidAssociationChanges(@Param("scenarioId") Integer scenarioId);
}
