package api.database.service.scenario;

import api.database.entity.scenario.QdsScenarioPhase;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.scenario.QdsInfoScenarioPhaseAdd;
import api.database.repository.scenario.QdsScenarioPhaseRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScenarioPhaseService {

  private final QdsScenarioPhaseRepository qdsScenarioPhaseRepository;

  @Autowired
  public ScenarioPhaseService(
    QdsScenarioPhaseRepository qdsScenarioPhaseRepository
  ) {
    this.qdsScenarioPhaseRepository = qdsScenarioPhaseRepository;
  }

  //TODO
  // warunki
  /** Funkcja dodająca fazy scenariusza
   * @apiNote Wykonywana w ramach transakcji nadrzędnej
   */
  @Transactional
  public QdsScenarioPhase addPhase(
    Integer scenarioId,
    QdsInfoScenarioPhaseAdd info
  ) {
    validatePhaseOverlap(scenarioId, info.startTime(), info.endTime(), null);
    QdsScenarioPhase scenarioPhase = new QdsScenarioPhase(
      null,
      info.title(),
      info.description(),
      info.color(),
      info.startTime(),
      info.endTime(),
      scenarioId,
      null
    );
    return qdsScenarioPhaseRepository.save(scenarioPhase);
  }

  @Transactional
  public List<QdsScenarioPhase> getScenarioPhases(Integer scenarioId) {
    return qdsScenarioPhaseRepository.findAllByScenarioId(scenarioId);
  }

  @Transactional
  public void deleteScenarioPhaseById(Integer id) {
    qdsScenarioPhaseRepository.deleteById(id);
  }

  @Transactional
  public QdsScenarioPhase updatePhase(
    Integer id,
    QdsInfoScenarioPhaseAdd info
  ) {
    QdsScenarioPhase phase =
      qdsScenarioPhaseRepository.findQdsScenarioPhaseById(id);
    if (phase != null) {
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
      return qdsScenarioPhaseRepository.save(phase);
    } else {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SCENARIO_PHASE,
        HttpStatus.NOT_FOUND
      );
    }
  }

  private void validatePhaseOverlap(
    Integer scenarioId,
    Integer startTime,
    Integer endTime,
    Integer excludedPhaseId
  ) {
    List<QdsScenarioPhase> phases =
      qdsScenarioPhaseRepository.findAllByScenarioId(scenarioId);
    boolean overlapExists = phases
      .stream()
      .filter(phase -> !phase.getId().equals(excludedPhaseId))
      .anyMatch(
        phase ->
          phase.getStartTime() < endTime && phase.getEndTime() > startTime
      );

    if (overlapExists) {
      throw new ApiException(
        ErrorCode.PHASE_OVERLAP,
        ErrorGroup.SCENARIO_PHASE,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
