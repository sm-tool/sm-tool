package api.database.service.scenario;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import api.database.entity.scenario.QdsScenarioPhase;
import api.database.model.exception.ApiException;
import api.database.model.scenario.QdsInfoScenarioPhaseAdd;
import api.database.repository.scenario.QdsScenarioPhaseRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class ScenarioPhaseServiceTest {

  @Mock
  private QdsScenarioPhaseRepository qdsScenarioPhaseRepository;

  @InjectMocks
  private ScenarioPhaseService scenarioPhaseService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testAddPhaseWithoutOverlap() {
    when(qdsScenarioPhaseRepository.findAllByScenarioId(1)).thenReturn(
      List.of(new QdsScenarioPhase(1, "Phase 1", "", "", 10, 20, 1, null))
    );

    scenarioPhaseService.addPhase(
      1,
      new QdsInfoScenarioPhaseAdd("New Phase", "", "", 25, 30)
    );

    verify(qdsScenarioPhaseRepository, times(1)).save(any());
  }

  @ParameterizedTest
  @CsvSource(
    {
      "5, 15", // Częściowe nakładanie z przodu
      "15, 25", // Częściowe nakładanie z tyłu
      "12, 18", // Całkowicie w środku
      "5, 25", // Całkowite nakładanie z obydwu stron
    }
  )
  void testAddPhaseWithOverlapParameterized(int startTime, int endTime) {
    when(qdsScenarioPhaseRepository.findAllByScenarioId(1)).thenReturn(
      List.of(new QdsScenarioPhase(1, "Phase 1", "", "", 10, 20, 1, null))
    );

    QdsInfoScenarioPhaseAdd testCase = new QdsInfoScenarioPhaseAdd(
      "Overlapping Phase",
      "",
      "",
      startTime,
      endTime
    );

    ApiException exception = assertThrows(ApiException.class, () ->
      scenarioPhaseService.addPhase(1, testCase)
    );

    assertEquals("PHASE_OVERLAP", exception.getErrorCode().name());

    verify(qdsScenarioPhaseRepository, never()).save(any());
  }
}
