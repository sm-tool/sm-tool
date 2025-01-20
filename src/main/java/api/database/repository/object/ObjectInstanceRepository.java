package api.database.repository.object;

import api.database.entity.object.ObjectInstance;
import api.database.model.domain.object.InternalObjectInstance;
import api.database.model.domain.object.InternalObjectInstanceAttributes;
import api.database.model.domain.object.InternalObjectInstanceType;
import api.database.model.domain.transfer.InternalObjectIdWIthThread;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające instancjami obiektów w systemie.
/// Dostarcza operacje bazodanowe dla encji `ObjectInstance` oraz
/// kompleksowe operacje na obiektach w kontekście wątków i scenariuszy.
///
/// # Główne funkcjonalności
/// - Podstawowe operacje CRUD na obiektach
/// - Zarządzanie powiązaniami obiektów z wątkami
/// - Pobieranie obiektów z uwzględnieniem hierarchii wątków
/// - Operacje na atrybutach obiektów
/// - Czyszczenie obiektów podczas usuwania wątków/scenariuszy
///
/// # Specjalne przypadki
/// - Wątek globalny (ID=0) ma specjalne traktowanie w zapytaniach
/// - Obiekty mogą być współdzielone między wątkami
/// - Atrybuty są pobierane z zachowaniem relacji obiekt-atrybut
///
/// # Powiązane komponenty
/// - {@link ObjectInstance} - encja reprezentująca instancję obiektu
/// - {@link api.database.entity.thread.Thread} - wątek zawierający obiekty
/// - {@link api.database.entity.object.Attribute} - atrybuty obiektu
/// - {@link InternalObjectInstance} - projekcja danych obiektu
@Repository
public interface ObjectInstanceRepository
  extends JpaRepository<ObjectInstance, Integer> {
  //--------------------------------------ThreadObjectCleaner-----------------------------------------------------------
  /// Usuwa obiekty przypisane do wskazanego wątku.
  /// Używa złączenia z tabelą powiązań thread_to_object.
  ///
  /// @param threadId ID wątku do wyczyszczenia
  @Modifying
  @Query(
    value = "DELETE FROM qds_object o " +
    "USING qds_thread_to_object tto " +
    "WHERE o.id = tto.object_id " +
    "AND tto.thread_id = :threadId",
    nativeQuery = true
  )
  void deleteObjectsForThread(@Param("threadId") Integer threadId);

  //--------------------------------Usuwanie scenariusza--------------------------------------------------
  /// Usuwa wszystkie obiekty należące do scenariusza.
  /// Kaskadowo usuwa powiązane atrybuty i asocjacje.
  ///
  /// @param scenarioId ID scenariusza
  @Modifying
  @Query("DELETE FROM ObjectInstance o WHERE o.scenario.id = :scenarioId")
  void deleteObjectsByScenarioId(@Param("scenarioId") Integer scenarioId);

  /// Usuwa powiązania obiektów z wątkami po określonym czasie.
  /// Dotyczy tylko wątków utworzonych przez FORK/JOIN.
  ///
  /// # SQL
  /// - Łączy tabele thread_to_object, thread i event
  /// - Filtruje po typach eventów FORK_OUT/JOIN_OUT
  /// - Usuwa powiązania dla wydarzeń po wskazanym czasie
  ///
  /// @param time czas graniczny
  /// @param objectIds lista ID obiektów
  @Modifying
  @Query(
    value = """
        DELETE FROM qds_thread_to_object tto
            USING qds_thread t JOIN qds_event e ON t.id = e.thread_id
        WHERE tto.thread_id = t.id
            AND event_type IN ('FORK_OUT','JOIN_OUT')
            AND event_time >= :time
            AND tto.object_id = ANY(:objectIds)
    """,
    nativeQuery = true
  )
  void deleteObjectConnectionsToThreadsAfterTime(
    @Param("time") Integer time,
    @Param("objectIds") Integer[] objectIds
  );

  //---------------------------------------Object Provider-------------------------------------------

  /// Pobiera obiekty dostępne w kontekście scenariusza/wątku.
  /// Uwzględnia obiekty globalne (origin_thread_id = 0) oraz lokalne dla wątku.
  ///
  /// # SQL
  /// - Łączy obiekty z ich przypisaniami do wątków
  /// - Grupuje wyniki aby uniknąć duplikatów
  /// - Specjalne traktowanie wątku globalnego
  ///
  /// @param scenarioId ID scenariusza
  /// @param threadId ID wątku (null dla wszystkich wątków)
  /// @return Lista obiektów z podstawowymi danymi
  @Query(
    value = """
    SELECT
        o.id,
        o.name,
        o.template_id,
        o.object_type_id,
        o.origin_thread_id
    FROM qds_object o
      JOIN qds_thread_to_object tto ON o.id = tto.object_id
    WHERE o.scenario_id = :scenarioId
      AND (
        o.origin_thread_id = 0
        OR (
          :threadId IS NULL
          OR tto.thread_id = :threadId
        )
      )
    GROUP BY o.id, o.name, o.template_id, o.object_type_id, o.origin_thread_id;
    """,
    nativeQuery = true
  )
  List<InternalObjectInstance> getAvailableObjects(
    @Param("scenarioId") Integer scenarioId,
    @Param("threadId") Integer threadId
  );

  /// Pobiera pojedynczy obiekt ze scenariusza.
  /// Zwraca thread_id=0 dla zachowania spójności z pozostałymi metodami.
  ///
  /// # SQL
  /// Pobiera podstawowe dane obiektu
  ///
  /// @param scenarioId ID scenariusza
  /// @param objectId ID obiektu
  /// @return Projekcja danych obiektu lub null
  @Query(
    value = """
    SELECT
        o.id,
        o.name,
        o.template_id,
        o.object_type_id,
        o.origin_thread_id
    FROM qds_object o
    WHERE o.scenario_id = :scenarioId
    AND o.id = :objectId;
    """,
    nativeQuery = true
  )
  InternalObjectInstance getOneObject(
    @Param("scenarioId") Integer scenarioId,
    @Param("objectId") Integer objectId
  );

  /// Pobiera wszystkie obiekty używające wskazanego szablonu.
  ///
  /// @param templateId ID szablonu
  /// @return Lista obiektów korzystających z szablonu
  @Query(
    value = """
    SELECT
        o.id,
        o.name,
        o.template_id,
        o.object_type_id,
        o.origin_thread_id
    FROM qds_object o
    WHERE o.template_id = :templateId
    """,
    nativeQuery = true
  )
  List<InternalObjectInstance> getObjectsUsingTemplate(
    @Param("templateId") Integer templateId
  );

  /// Pobiera typy obiektów dla wskazanych identyfikatorów.
  ///
  /// # SQL
  /// Proste zapytanie zwracające ID obiektu i jego typ.
  ///
  /// @param objectIds Lista ID obiektów
  /// @return Lista par (ID obiektu, ID typu)
  @Query(
    value = """
        SELECT o.id, o.object_type_id
        FROM qds_object o
        WHERE o.id = ANY(:objectIds)
    """,
    nativeQuery = true
  )
  List<InternalObjectInstanceType> getObjectTypes(
    @Param("objectIds") Integer[] objectIds
  );

  /// Pobiera przypisania obiektów do wątków.
  ///
  /// # SQL
  /// Proste zapytanie do tabeli thread_to_object.
  ///
  /// @param threadIds Lista ID wątków
  /// @return Lista par (ID obiektu, ID wątku)
  @Query(
    value = """
    SELECT object_id, thread_id FROM qds_thread_to_object tto WHERE thread_id=ANY(:threadIds)
    """,
    nativeQuery = true
  )
  List<InternalObjectIdWIthThread> getObjectIdsAssignedToThreads(
    @Param("threadIds") Integer[] threadIds
  );

  /// Pobiera obiekty wraz z ich atrybutami dostępne dla wątku.
  /// Uwzględnia obiekty z wątku globalnego.
  ///
  /// # SQL
  /// - Pobiera podstawowe dane obiektu
  /// - Agreguje ID atrybutów w tablicę
  /// - Łączy z tabelą przypisań do wątków
  /// - Uwzględnia wątek globalny
  ///
  /// @param threadId ID wątku
  /// @param globalThreadId ID wątku globalnego
  /// @return Lista obiektów z ich atrybutami
  @Query(
    value = """
    SELECT o.id,
           o.origin_thread_id,
    ARRAY(SELECT id FROM qds_attribute WHERE object_id=o.id) AS attributes
    FROM qds_object o JOIN qds_thread_to_object tto ON o.id = tto.object_id
    WHERE tto.thread_id = :threadId OR tto.thread_id=:globalThreadId
    """,
    nativeQuery = true
  )
  List<
    InternalObjectInstanceAttributes
  > getObjectIdsWithAttributeIdsAvailableForThread(
    Integer threadId,
    Integer globalThreadId
  );
}
