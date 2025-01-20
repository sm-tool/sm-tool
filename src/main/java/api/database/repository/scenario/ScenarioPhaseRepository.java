package api.database.repository.scenario;

import api.database.entity.scenario.ScenarioPhase;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające fazami scenariusza - logicznymi przedziałami
/// czasowymi grupującymi wydarzenia.
///
/// # Główne funkcjonalności
/// - Podstawowe operacje CRUD na fazach
/// - Wyszukiwanie faz dla scenariusza
/// - Walidacja nakładania się przedziałów czasowych
/// - Sprawdzanie poprawności granic czasowych
///
/// # Ważne zasady
/// - Fazy tego samego scenariusza nie mogą się nakładać w czasie
/// - Czas końca fazy musi być większy niż czas początku
///
/// # Powiązane komponenty
/// - {@link ScenarioPhase} - encja reprezentująca fazę scenariusza
/// - {@link api.database.entity.scenario.Scenario} - scenariusz zawierający fazy
/// - {@link api.database.entity.event.Event} - wydarzenia w fazach
@Repository
public interface ScenarioPhaseRepository
  extends JpaRepository<ScenarioPhase, Integer> {
  /// Pobiera wszystkie fazy dla wskazanego scenariusza.
  /// Fazy są zwracane w kolejności czasowej.
  ///
  /// @param scenarioId ID scenariusza
  /// @return Lista faz należących do scenariusza
  @Query(
    value = "SELECT * " +
    "FROM qds_scenario_phase p WHERE p.scenario_id = :scenarioId " +
    "ORDER BY p.start_time",
    nativeQuery = true
  )
  List<ScenarioPhase> findAllByScenarioId(
    @Param("scenarioId") Integer scenarioId
  );

  /// Pobiera fazę o wskazanym identyfikatorze.
  /// Metoda konwencji nazewniczej JPA.
  ///
  /// @param id ID fazy do pobrania
  /// @return Faza lub null jeśli nie znaleziono
  ScenarioPhase findQdsScenarioPhaseById(Integer id);

  /// Sprawdza czy istnieją fazy nakładające się z podanym przedziałem czasowym.
  ///
  /// # SQL
  /// Sprawdza nakładanie się przedziałów poprzez warunki:
  /// - Początek nowej fazy < koniec istniejącej
  /// - Koniec nowej fazy > początek istniejącej
  /// - Opcjonalnie wyklucza wskazaną fazę (przy aktualizacji)
  ///
  /// @param scenarioId ID scenariusza
  /// @param startTime początek sprawdzanego przedziału
  /// @param endTime koniec sprawdzanego przedziału
  /// @param excludedPhaseId opcjonalne ID fazy do pominięcia
  /// @return true jeśli wykryto nakładanie się faz
  @Query(
    value = """
    SELECT EXISTS (
        SELECT 1 FROM qds_scenario_phase
        WHERE scenario_id = :scenarioId
        AND (:excludedPhaseId IS NULL OR id != :excludedPhaseId)
        AND start_time < :endTime
        AND end_time > :startTime
    )
    """,
    nativeQuery = true
  )
  boolean existsOverlappingPhase(
    @Param("scenarioId") Integer scenarioId,
    @Param("startTime") Integer startTime,
    @Param("endTime") Integer endTime,
    @Param("excludedPhaseId") Integer excludedPhaseId
  );
}
