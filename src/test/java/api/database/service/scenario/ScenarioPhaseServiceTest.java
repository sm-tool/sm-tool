package api.database.service.scenario;

import static org.junit.jupiter.api.Assertions.*;

import api.database.entity.scenario.Scenario;
import api.database.model.exception.ApiException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseUnitTest;
import utils.builders.QdsAddScenarioBuilder;
import utils.builders.ScenarioPhaseSaveRequestBuilder;

class ScenarioPhaseServiceTest extends BaseUnitTest {

  @Autowired
  private ScenarioPhaseService scenarioPhaseService;

  @Test
  @Transactional
  void testValidatePhaseOverlapWithoutOverlap() {
    Scenario addedScenario = getObjectManager()
      .addScenarioByManager(new QdsAddScenarioBuilder().build());

    getObjectManager()
      .addScenarioPhaseByManager(
        new ScenarioPhaseSaveRequestBuilder()
          .setStartTime(10)
          .setEndTime(20)
          .build(),
        addedScenario.getId()
      );

    assertDoesNotThrow(() ->
      scenarioPhaseService.validatePhaseOverlap(
        addedScenario.getId(),
        25,
        30,
        null
      )
    );
  }

  @ParameterizedTest
  @CsvSource(
    {
      "5, 15", // Częściowe nakładanie z przodu
      "15, 25", // Częściowe nakładanie z tyłu
      "12, 18", // Całkowicie w środku
      "5, 25", // Całkowite nakładanie z obu stron
    }
  )
  void testValidatePhaseOverlapWithOverlap(int startTime, int endTime) {
    Scenario addedScenario = getObjectManager()
      .addScenarioByManager(new QdsAddScenarioBuilder().build());

    getObjectManager()
      .addScenarioPhaseByManager(
        new ScenarioPhaseSaveRequestBuilder()
          .setStartTime(10)
          .setEndTime(20)
          .build(),
        addedScenario.getId()
      );

    ApiException exception = assertThrows(ApiException.class, () ->
      scenarioPhaseService.validatePhaseOverlap(
        addedScenario.getId(),
        startTime,
        endTime,
        null
      )
    );

    assertEquals("PHASE_OVERLAP", exception.getErrorCode().name());
  }
}
//class ScenarioPhaseServiceTest extends BaseUnitTest {
//
//  @InjectMocks
//  private ScenarioPhaseService scenarioPhaseService;
//
//  @Test
//  void testAddScenarioPhaseWithoutOverlap() {
//    scenarioPhaseService.addScenarioPhase(
//      new ScenarioPhaseSaveRequest("New Phase", "", "", 25, 30),
//      1
//    );
//  }
//
//  @ParameterizedTest
//  @CsvSource(
//    {
//      "5, 15", // Częściowe nakładanie z przodu
//      "15, 25", // Częściowe nakładanie z tyłu
//      "12, 18", // Całkowicie w środku
//      "5, 25", // Całkowite nakładanie z obydwu stron
//    }
//  )
//  void testAddScenarioPhaseWithOverlapParameterized(
//    int startTime,
//    int endTime
//  ) {
//    Scenario addedScenario = getObjectManager()
//      .addScenarioByManager(new QdsAddScenarioBuilder().build());
//
//    ScenarioPhase addedPhase = getObjectManager()
//      .addScenarioPhaseByManager(
//        new ScenarioPhaseSaveRequestBuilder()
//          .setStartTime(10)
//          .setEndTime(20)
//          .build(),
//        addedScenario.getId()
//      );
//
//    ScenarioPhaseSaveRequest testCase = new ScenarioPhaseSaveRequest(
//      "Overlapping Phase",
//      "",
//      "",
//      startTime,
//      endTime
//    );
//
//    ApiException exception = assertThrows(ApiException.class, () ->
//      scenarioPhaseService.addScenarioPhase(testCase, 1)
//    );
//
//    assertEquals("PHASE_OVERLAP", exception.getErrorCode().name());
//  }
//}
