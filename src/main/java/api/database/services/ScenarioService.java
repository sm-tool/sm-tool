package api.database.services;

import api.database.classes.QdsScenarioDetails;
import api.database.entities.QdsPurpose;
import api.database.entities.QdsScenario;
import api.database.repositories.QdsPurposeRepository;
import api.database.repositories.QdsScenarioRepository;
//import api.database.websocket.CustomWebSocketHandler;
//import api.database.websocket.model.MessageType;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScenarioService {

  private final QdsScenarioRepository qdsScenarioRepository;
  //private final CustomWebSocketHandler webSocketHandler;
  private final QdsPurposeRepository purposeRepository;

  @Autowired
  public ScenarioService(
    QdsScenarioRepository qdsScenarioRepository,
    //CustomWebSocketHandler webSocketHandler,
    QdsPurposeRepository purposeRepository
  ) {
    this.qdsScenarioRepository = qdsScenarioRepository;
    //this.webSocketHandler = webSocketHandler;
    this.purposeRepository = purposeRepository;
  }

  public List<QdsScenarioDetails> getScenarioList(Integer userId) {
    return qdsScenarioRepository.findScenarioList(userId);
  }

  public QdsScenario getScenarioById(Integer id) {
    //QdsScenario scenario = qdsScenarioRepository.findQdsScenarioById(id);
    //    webSocketHandler.broadcast(
    //      scenario.getId().toString(),
    //      "id: " + scenario.getId() + "entity: QdsScenario",
    //      MessageType.UPDATE,
    //      1
    //    );
    return qdsScenarioRepository.findQdsScenarioById(id);
  }

  @Transactional
  public QdsScenario addScenario(QdsScenario scenario) {
    QdsPurpose purpose = scenario.getPurposeTitle();
    purposeRepository.save(purpose);
    return qdsScenarioRepository.save(scenario);
  }
  //  public QdsScenario saveScenario(QdsScenario scenario) {
  //    return qdsScenarioRepository.save(scenario);
  //  }
  //
  //  public QdsScenario updateScenario(Integer id, QdsScenario scenarioDetails) {
  //    QdsScenario scenario = qdsScenarioRepository.findQdsScenarioById(id);
  //    if (scenario != null) {
  //      scenario.setTitle(scenarioDetails.getTitle());
  //      scenario.setDescription(scenarioDetails.getDescription());
  //      scenario.setContext(scenarioDetails.getContext());
  //      scenario.setStartTime(scenarioDetails.getStartTime());
  //      scenario.setEndTime(scenarioDetails.getEndTime());
  //      scenario.setStepLength(scenarioDetails.getStepLength());
  //      scenario.setPurposeTitle(scenarioDetails.getPurposeTitle());
  //      return qdsScenarioRepository.save(scenario);
  //    }
  //    return null;
  //  }
  //
  //  public void deleteScenario(Integer id) {
  //    qdsScenarioRepository.deleteById(id);
  //  }
}
