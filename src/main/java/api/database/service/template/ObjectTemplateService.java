package api.database.service.template;

import api.database.entity.object.QdsObjectTemplate;
import api.database.entity.scenario.QdsScenario;
import api.database.entity.scenario.QdsScenarioToObjectTemplate;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.object.QdsInfoAddObjectTemplate;
import api.database.repository.object.QdsObjectTemplateRepository;
import api.database.repository.scenario.QdsScenarioRepository;
import api.database.repository.scenario.QdsScenarioToObjectTemplateRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ObjectTemplateService {

  private final QdsObjectTemplateRepository qdsObjectTemplateRepository;
  private final QdsScenarioRepository qdsScenarioRepository;
  private final QdsScenarioToObjectTemplateRepository qdsScenarioToObjectTemplateRepository;

  @Autowired
  public ObjectTemplateService(
    QdsObjectTemplateRepository qdsObjectTemplateRepository,
    QdsScenarioRepository qdsScenarioRepository,
    QdsScenarioToObjectTemplateRepository qdsScenarioToObjectTemplateRepository
  ) {
    this.qdsObjectTemplateRepository = qdsObjectTemplateRepository;
    this.qdsScenarioRepository = qdsScenarioRepository;
    this.qdsScenarioToObjectTemplateRepository =
      qdsScenarioToObjectTemplateRepository;
  }

  public Page<QdsObjectTemplate> getScenarioTemplates(
    Integer scenarioId,
    Pageable pageable
  ) {
    return qdsObjectTemplateRepository.findAllByScenarioId(
      scenarioId,
      pageable
    );
  }

  public QdsObjectTemplate getTemplate(Integer templateId) {
    return qdsObjectTemplateRepository
      .findById(templateId)
      .orElseThrow(() ->
        new RuntimeException("Template not found with id: " + templateId)
      );
  }

  public void deleteTemplate(Integer id) {
    qdsObjectTemplateRepository.deleteById(id);
  }

  //--------------------------------------------------Dodawanie szablonów---------------------------------------------------------

  /**
   * Funkcja dodaje szablony możliwe do użycia w danym scenariuszu
   * @apiNote Wykonywana w ramach transakcji nadrzędnej
   */
  public void addObjectTemplatesToScenario(
    Integer scenarioId,
    List<Integer> objectTemplateIds
  ) {
    for (Integer objectTemplateId : objectTemplateIds) {
      qdsScenarioToObjectTemplateRepository.save(
        new QdsScenarioToObjectTemplate(
          null,
          scenarioId,
          objectTemplateId,
          null,
          null
        )
      );
    }
  }

  @Transactional
  public Integer addObjectTemplate(
    QdsInfoAddObjectTemplate objectTemplate,
    Integer scenarioId
  ) {
    QdsScenario qdsScenario = qdsScenarioRepository
      .findById(scenarioId)
      .orElseThrow(() ->
        new RuntimeException("Scenario not found with id: " + scenarioId)
      );
    QdsObjectTemplate qdsObjectTemplate = new QdsObjectTemplate(
      null,
      objectTemplate.title(),
      objectTemplate.description(),
      objectTemplate.color(),
      objectTemplate.typeId(),
      null
    );
    QdsObjectTemplate savedQdsObjectTemplate = qdsObjectTemplateRepository.save(
      qdsObjectTemplate
    );

    QdsScenarioToObjectTemplate qdsScenarioToObjectTemplate =
      new QdsScenarioToObjectTemplate(
        null,
        qdsScenario.getId(),
        savedQdsObjectTemplate.getId(),
        null,
        null
      );
    qdsScenarioToObjectTemplateRepository.save(qdsScenarioToObjectTemplate);

    return savedQdsObjectTemplate.getId();
  }

  public List<QdsObjectTemplate> getTemplatesByScenarioIdAndObjectType(
    Integer scenarioId,
    Integer objectTypeId
  ) {
    return qdsObjectTemplateRepository.findTemplatesByScenarioIdAndObjectTypeId(
      scenarioId,
      objectTypeId
    );
  }

  @Transactional
  public void copyObjectTemplatesBetweenScenarios(
    Integer sourceScenarioId,
    Integer targetScenarioId
  ) {
    if (!qdsScenarioRepository.existsById(sourceScenarioId)) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SCENARIO,
        HttpStatus.NOT_FOUND
      );
    }
    if (!qdsScenarioRepository.existsById(targetScenarioId)) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SCENARIO,
        HttpStatus.NOT_FOUND
      );
    }
    qdsScenarioToObjectTemplateRepository.copyObjectTemplatesBetweenScenarios(
      sourceScenarioId,
      targetScenarioId
    );
  }
}
