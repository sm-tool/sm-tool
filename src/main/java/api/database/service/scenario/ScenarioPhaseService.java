package api.database.service.scenario;

import api.database.entity.scenario.ScenarioPhase;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.save.ScenarioPhaseSaveRequest;
import api.database.repository.scenario.ScenarioPhaseRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/// Serwis zarządzający fazami scenariusza - logicznymi przedziałami czasowymi
/// grupującymi wydarzenia. Odpowiada za tworzenie, modyfikację i usuwanie faz
/// oraz zapewnienie ich nienakładania się w czasie.
///
/// # Ważne zasady
/// - Fazy tego samego scenariusza nie mogą się nakładać w czasie
/// - Czas końca fazy musi być większy niż czas początku
/// - Faza musi należeć do scenariusza
/// - Zmiany czasu fazy są walidowane pod kątem nakładania się
///
/// # Walidacja czasów
/// - Przy tworzeniu/modyfikacji sprawdzane jest nakładanie z innymi fazami
/// - Sprawdzenie pomija fazę modyfikowaną (przy update)
/// - W przypadku nakładania zgłaszany jest błąd PHASE_OVERLAP
@Service
public class ScenarioPhaseService {

  private final ScenarioPhaseRepository scenarioPhaseRepository;

  @Autowired
  public ScenarioPhaseService(ScenarioPhaseRepository scenarioPhaseRepository) {
    this.scenarioPhaseRepository = scenarioPhaseRepository;
  }

  //------------------------------------------Warunki-------------------------------------------------------------------
  /// Sprawdza czy nowa/modyfikowana faza nie nakłada się z istniejącymi.
  ///
  /// @param scenarioId id scenariusza
  /// @param startTime czas początku fazy
  /// @param endTime czas końca fazy
  /// @param excludedPhaseId id fazy pomijanej przy sprawdzeniu (lub null)
  /// @throws ApiException gdy wykryto nakładanie się faz
  void validatePhaseOverlap(
    Integer scenarioId,
    Integer startTime,
    Integer endTime,
    Integer excludedPhaseId
  ) {
    boolean overlapExists = scenarioPhaseRepository.existsOverlappingPhase(
      scenarioId,
      startTime,
      endTime,
      excludedPhaseId
    );

    if (overlapExists) {
      throw new ApiException(
        ErrorCode.PHASE_OVERLAP,
        ErrorGroup.SCENARIO_PHASE,
        HttpStatus.CONFLICT
      );
    }
  }

  //------------------------------------------Pobieranie faz------------------------------------------------------------
  /// Pobiera wszystkie fazy scenariusza.
  ///
  /// @param scenarioId id scenariusza
  /// @return lista faz scenariusza
  @Transactional
  public List<ScenarioPhase> getScenarioPhases(Integer scenarioId) {
    return scenarioPhaseRepository.findAllByScenarioId(scenarioId);
  }

  //------------------------------------------Dodawanie faz----=--------------------------------------------------------

  /// Dodaje nową fazę do scenariusza.
  ///
  /// @param info dane nowej fazy
  /// @param scenarioId id scenariusza
  /// @return utworzona faza
  /// @throws ApiException gdy faza nakłada się z istniejącymi
  @Transactional
  public ScenarioPhase addScenarioPhase(
    ScenarioPhaseSaveRequest info,
    Integer scenarioId
  ) {
    validatePhaseOverlap(scenarioId, info.startTime(), info.endTime(), null);
    return scenarioPhaseRepository.save(ScenarioPhase.create(info, scenarioId));
  }

  //------------------------------------------Aktualizacja faz----------------------------------------------------------
  /// Aktualizuje istniejącą fazę.
  ///
  /// @param id id fazy do aktualizacji
  /// @param info nowe dane fazy
  /// @return zaktualizowana faza
  /// @throws ApiException gdy faza nie istnieje lub nakłada się z innymi
  @Transactional
  public ScenarioPhase updatePhase(Integer id, ScenarioPhaseSaveRequest info) {
    ScenarioPhase phase = scenarioPhaseRepository.findQdsScenarioPhaseById(id);
    if (phase == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.SCENARIO_PHASE,
      HttpStatus.NOT_FOUND
    );
    validatePhaseOverlap(
      phase.getScenarioId(),
      info.startTime(),
      info.endTime(),
      id
    );
    phase.setTitle(info.title());
    phase.setDescription(info.description());
    phase.setColor(info.color());
    phase.setStartTime(info.startTime());
    phase.setEndTime(info.endTime());
    return scenarioPhaseRepository.save(phase);
  }

  //----------------------------------------------Usuwanie faz----------------------------------------------------------
  /// Usuwa fazę scenariusza.
  ///
  /// @param id id fazy do usunięcia
  @Transactional
  public void deleteScenarioPhaseById(Integer id) {
    scenarioPhaseRepository.deleteById(id);
  }
}
