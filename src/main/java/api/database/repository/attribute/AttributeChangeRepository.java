package api.database.repository.attribute;

import api.database.entity.object.AttributeChange;
import api.database.model.domain.attribute.InternalLastAttributeChange;
import api.database.model.response.EventAttributesStateResponse;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/// Repozytorium zarządzające historią zmian atrybutów obiektów w systemie.
///
/// # Główne funkcjonalności
/// - Śledzenie i zapisywanie zmian wartości atrybutów w czasie
/// - Pobieranie stanu atrybutów dla określonego momentu w czasie
/// - Zarządzanie historią zmian (dodawanie, aktualizacja, usuwanie)
/// - Obsługa wartości początkowych atrybutów dla nowych obiektów
///
/// # Operacje na zmianach
/// - Dodawanie pojedynczych i grupowych zmian atrybutów
/// - Aktualizacja istniejących wartości atrybutów
/// - Usuwanie zmian dla określonych obiektów/wydarzeń
/// - Pobieranie stanu atrybutów w kontekście wydarzeń
///
/// # Powiązane komponenty
/// - {@link AttributeChange} - encja reprezentująca pojedynczą zmianę atrybutu
/// - {@link EventAttributesStateResponse} - projekcja stanu atrybutów w czasie
public interface AttributeChangeRepository
  extends JpaRepository<AttributeChange, Integer> {
  /// Usuwa zmiany atrybutów dla wskazanych obiektów w określonym czasie.
  ///
  /// Wykorzystywane przy czyszczeniu historii zmian dla obiektów, np. podczas:
  /// - Usuwania obiektów
  /// - Przenoszenia obiektów między wątkami
  /// - Rozwiązywania konfliktów zmian
  ///
  /// @param time moment w czasie dla którego usuwane są zmiany
  /// @param objectIds identyfikatory obiektów do wyczyszczenia
  @Modifying
  @Query(
    value = """
    DELETE FROM qds_attribute_change ac
    USING qds_event e, qds_attribute a
    WHERE ac.event_id = e.id
    AND ac.attribute_id = a.id
    AND e.event_time = :time
    AND a.object_id = ANY(:objectIds)
    """,
    nativeQuery = true
  )
  void deleteAttributeChangesInTimeByObjectIds(
    @Param("time") Integer time,
    @Param("objectIds") Integer[] objectIds
  );

  //--------------------------------------------Attribute Adder---------------------------------------------------------
  /// Inicjalizuje wartości początkowe dla grupy atrybutów w wydarzeniach typu START.
  ///
  /// Proces inicjalizacji:
  /// 1. Mapowanie obiektów na ich efektywne wątki (globalne/lokalne)
  /// 2. Identyfikacja wydarzeń START dla każdego wątku
  /// 3. Dodanie wartości początkowych dla wszystkich wskazanych atrybutów
  ///
  /// @param objectIds lista ID obiektów do zainicjalizowania
  /// @param attributeIds lista ID atrybutów do ustawienia
  /// @param defaultValue wartość początkowa dla wszystkich atrybutów
  @Modifying
  @Query(
    value = """
    WITH thread_mapping AS (
        SELECT
            o.id AS object_id,
            CASE
                WHEN o.origin_thread_id = 0 THEN (
                    SELECT id
                    FROM qds_thread
                    WHERE scenario_id = o.scenario_id AND is_global = TRUE
                )
                ELSE o.origin_thread_id
                END AS effective_thread_id
        FROM qds_object o
        WHERE o.id = ANY (:objectIds)
    ),
         first_events AS (
             SELECT
                 t.effective_thread_id,
                 t.object_id,
                 e.id AS first_event_id
             FROM thread_mapping t
                      JOIN qds_thread th ON th.id = t.effective_thread_id
                      JOIN qds_event e ON e.thread_id = th.id
             WHERE e.event_type = 'START'
         )
    INSERT INTO qds_attribute_change (id, attribute_id, event_id, value)
    SELECT
        nextval('qds_attribute_change_id_seq'),
        a.id AS attribute_id,
        fe.first_event_id,
        :defaultValue
    FROM first_events fe
             JOIN qds_attribute a ON a.object_id = fe.object_id
    WHERE a.id = ANY (:attributeIds);
    """,
    nativeQuery = true
  )
  void addMultipleChanges(
    @Param("objectIds") Integer[] objectIds,
    @Param("attributeIds") Integer[] attributeIds,
    @Param("defaultValue") String defaultValue
  );

  //--------------------------------------------Attribute Change Executor-----------------------------------------------
  /// Usuwa zmiany atrybutów dla konkretnego wydarzenia.
  ///
  /// @param eventId ID wydarzenia
  /// @param attributeIds lista ID atrybutów do usunięcia
  @Modifying
  @Query(
    value = """
    DELETE FROM qds_attribute_change ac WHERE ac.event_id = :eventId AND ac.attribute_id = ANY(:attributeIds)
    """,
    nativeQuery = true
  )
  void deleteByEventIdAndAttributeIds(
    @Param("eventId") Integer eventId,
    @Param("attributeIds") Integer[] attributeIds
  );

  /// Aktualizuje wartość atrybutu w kontekście wydarzenia.
  ///
  /// @param eventId ID wydarzenia
  /// @param attributeId ID atrybutu
  /// @param value nowa wartość atrybutu
  @Modifying
  @Query(
    value = """
    UPDATE qds_attribute_change ac SET value=:value WHERE event_id=:eventId AND attribute_id=:attributeId
    """,
    nativeQuery = true
  )
  void updateByEventIdAndAttributeId(
    @Param("eventId") Integer eventId,
    @Param("attributeId") Integer attributeId,
    @Param("value") String value
  );

  //-----------------------------------------------Event State Provider-------------------------------------------------
  /// Pobiera kompletną historię zmian atrybutów dla wskazanych wydarzeń.
  ///
  /// @param eventIds lista ID wydarzeń
  /// @return lista wszystkich zmian atrybutów dla danych wydarzeń
  @Query(
    value = "SELECT * FROM qds_attribute_change WHERE event_id = ANY(:eventIds)",
    nativeQuery = true
  )
  List<AttributeChange> getEventsAttributeChanges(
    @Param("eventIds") Integer[] eventIds
  );

  /// Znajduje ostatnie zmiany atrybutów przed wskazanymi wydarzeniami.
  ///
  /// Dla każdego wydarzenia zwraca najświeższą zmianę każdego atrybutu,
  /// która nastąpiła przed tym wydarzeniem.
  ///
  /// @param eventIds lista ID wydarzeń
  /// @return lista ostatnich zmian sprzed każdego wydarzenia
  @Query(
    value = """
    WITH AttributeChanges AS (
        SELECT ac.attribute_id, ac.event_id, e.event_time
        FROM qds_attribute_change ac
                 JOIN qds_event e ON ac.event_id = e.id
        WHERE e.id = ANY(:eventIds)
    ),
         LastValues AS (
             SELECT
                 ac.attribute_id,
                 ac.value,
                 ac2.event_id as target_event_id
             FROM AttributeChanges ac2
                      JOIN qds_attribute_change ac ON ac.attribute_id = ac2.attribute_id
                      JOIN qds_event e ON ac.event_id = e.id
             WHERE e.event_time = (
                 SELECT MAX(e2.event_time)
                 FROM qds_attribute_change ac3
                          JOIN qds_event e2 ON ac3.event_id = e2.id
                 WHERE e2.event_time < ac2.event_time
                   AND ac3.attribute_id = ac2.attribute_id
             )
         )
    SELECT * FROM LastValues
    """,
    nativeQuery = true
  )
  List<InternalLastAttributeChange> getLastAttributeChanges(
    @Param("eventIds") Integer[] eventIds
  );

  /// Pobiera aktualny stan atrybutów w kontekście wydarzenia.
  ///
  /// Uwzględnia:
  /// - Atrybuty obiektów z wątku wydarzenia
  /// - Atrybuty obiektów globalnych
  /// - Ostatnią zmianę do momentu wydarzenia
  ///
  /// @param eventId ID wydarzenia
  /// @param scenarioId ID scenariusza
  /// @return lista aktualnych wartości dostępnych atrybutów
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
        attribute_id,
        value
    FROM qds_attribute a
             JOIN qds_attribute_change ac ON ac.attribute_id = a.id
             JOIN qds_event e ON ac.event_id = e.id
    WHERE a.object_id IN (SELECT object_id FROM AvailableObjects)
      AND e.event_time <= (SELECT event_time FROM EventInfo)
    ORDER BY a.id, e.event_time DESC
    """,
    nativeQuery = true
  )
  List<EventAttributesStateResponse> getAttributesStateForEvent(
    Integer eventId,
    Integer scenarioId
  );

  /// Pobiera poprzedni stan atrybutów przed wskazanym wydarzeniem.
  ///
  /// Analogicznie jak `getAttributesStateForEvent`, ale zwraca stan
  /// sprzed danego wydarzenia.
  ///
  /// @param eventId ID wydarzenia
  /// @param scenarioId ID scenariusza
  /// @return lista wartości atrybutów sprzed wydarzenia
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
        attribute_id,
        value
    FROM qds_attribute a
             JOIN qds_attribute_change ac ON ac.attribute_id = a.id
             JOIN qds_event e ON ac.event_id = e.id
    WHERE a.object_id IN (SELECT object_id FROM AvailableObjects)
      AND e.event_time < (SELECT event_time FROM EventInfo)
    ORDER BY a.id, e.event_time DESC
    """,
    nativeQuery = true
  )
  List<EventAttributesStateResponse> getAttributesPreviousStateForEvent(
    Integer eventId,
    Integer scenarioId
  );
}
