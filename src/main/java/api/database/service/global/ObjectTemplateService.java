package api.database.service.global;

import api.database.entity.object.ObjectTemplate;
import api.database.entity.scenario.ScenarioToObjectTemplate;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.create.ObjectTemplateCreateRequest;
import api.database.model.request.update.ObjectTemplateUpdateRequest;
import api.database.repository.object.ObjectTemplateRepository;
import api.database.repository.scenario.ScenarioRepository;
import api.database.repository.scenario.ScenarioToObjectTemplateRepository;
import api.database.repository.scenario.ScenarioToObjectTypeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ObjectTemplateService {

  private final ObjectTemplateRepository objectTemplateRepository;
  private final ScenarioRepository scenarioRepository;
  private final ScenarioToObjectTemplateRepository scenarioToObjectTemplateRepository;
  private final ScenarioToObjectTypeRepository scenarioToObjectTypeRepository;

  @Autowired
  public ObjectTemplateService(
    ObjectTemplateRepository objectTemplateRepository,
    ScenarioRepository scenarioRepository,
    ScenarioToObjectTemplateRepository scenarioToObjectTemplateRepository,
    ScenarioToObjectTypeRepository scenarioToObjectTypeRepository
  ) {
    this.objectTemplateRepository = objectTemplateRepository;
    this.scenarioRepository = scenarioRepository;
    this.scenarioToObjectTemplateRepository =
      scenarioToObjectTemplateRepository;
    this.scenarioToObjectTypeRepository = scenarioToObjectTypeRepository;
  }

  @Transactional
  public void deleteTemplate(Integer id) {
    objectTemplateRepository.deleteById(id);
  }

  //--------------------------------------------------Dodawanie szablonów---------------------------------------------------------

  @Transactional
  public ObjectTemplate addObjectTemplate(
    ObjectTemplateCreateRequest objectTemplateInfo,
    Integer scenarioId
  ) {
    ObjectTemplate savedObjectTemplate = objectTemplateRepository.save(
      ObjectTemplate.create(objectTemplateInfo)
    );

    if (scenarioId != null) {
      scenarioToObjectTemplateRepository.save(
        ScenarioToObjectTemplate.create(savedObjectTemplate.getId(), scenarioId)
      );
    }

    return savedObjectTemplate;
  }

  //  @Transactional
  //  public void copyObjectTemplatesBetweenScenarios(
  //    Integer sourceScenarioId,
  //    Integer targetScenarioId
  //  ) {
  //    if (!scenarioRepository.existsById(sourceScenarioId)) {
  //      throw new ApiException(
  //        ErrorCode.DOES_NOT_EXIST,
  //        ErrorGroup.SCENARIO,
  //        HttpStatus.NOT_FOUND
  //      );
  //    }
  //    if (!scenarioRepository.existsById(targetScenarioId)) {
  //      throw new ApiException(
  //        ErrorCode.DOES_NOT_EXIST,
  //        ErrorGroup.SCENARIO,
  //        HttpStatus.NOT_FOUND
  //      );
  //    }
  //    scenarioToObjectTemplateRepository.copyObjectTemplatesBetweenScenarios(
  //      sourceScenarioId,
  //      targetScenarioId
  //    );
  //  }

  @Transactional
  public void assignTemplateToScenario(Integer templateId, Integer scenarioId) {
    ObjectTemplate template = objectTemplateRepository
      .findById(templateId)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.OBJECT_TEMPLATE,
          HttpStatus.NOT_FOUND
        )
      );
    if (template.getObjectTypeId() == null) {
      throw new ApiException(
        ErrorCode.NULL_VALUE,
        ErrorGroup.OBJECT_TEMPLATE,
        HttpStatus.BAD_REQUEST
      );
    }
    if (!scenarioRepository.existsById(scenarioId)) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SCENARIO,
        HttpStatus.NOT_FOUND
      );
    }
    if (
      !scenarioToObjectTypeRepository.existsByScenarioIdAndObjectTypeId(
        scenarioId,
        template.getObjectTypeId()
      )
    ) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.OBJECT_TEMPLATE,
        HttpStatus.BAD_REQUEST
      );
    }

    scenarioToObjectTemplateRepository.save(
      ScenarioToObjectTemplate.create(templateId, scenarioId)
    );
  }

  //--------------------------------------------------Edycja szablonów---------------------------------------------------------

  @Transactional
  public ObjectTemplate updateObjectTemplate(
    Integer id,
    ObjectTemplateUpdateRequest updatedTemplate
  ) {
    ObjectTemplate existingTemplate = objectTemplateRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.OBJECT_TEMPLATE,
          HttpStatus.NOT_FOUND
        )
      );

    existingTemplate.setTitle(updatedTemplate.title());
    existingTemplate.setDescription(updatedTemplate.description());
    existingTemplate.setColor(updatedTemplate.color());

    return objectTemplateRepository.save(existingTemplate);
  }
}
