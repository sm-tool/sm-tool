package api.database.service.global;

import api.database.entity.object.ObjectTemplate;
import api.database.entity.scenario.ScenarioToObjectTemplate;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.create.ObjectTemplateCreateRequest;
import api.database.model.request.update.ObjectTemplateUpdateRequest;
import api.database.repository.object.ObjectTemplateRepository;
import api.database.repository.scenario.ScenarioToObjectTemplateRepository;
import api.database.service.core.ObjectTypeManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ObjectTemplateService {

  private final ObjectTemplateRepository objectTemplateRepository;
  private final ScenarioToObjectTemplateRepository scenarioToObjectTemplateRepository;
  private final ObjectTypeManager objectTypeManager;

  @Autowired
  public ObjectTemplateService(
    ObjectTemplateRepository objectTemplateRepository,
    ScenarioToObjectTemplateRepository scenarioToObjectTemplateRepository,
    ObjectTypeManager objectTypeManager
  ) {
    this.objectTemplateRepository = objectTemplateRepository;
    this.scenarioToObjectTemplateRepository =
      scenarioToObjectTemplateRepository;
    this.objectTypeManager = objectTypeManager;
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

  @Transactional
  public void assignTemplatesToScenario(
    List<Integer> templateIds,
    Integer scenarioId
  ) {
    // Pobranie wszystkich szablonów wraz z ich typami
    List<ObjectTemplate> templates = objectTemplateRepository.findAllById(
      templateIds
    );

    // Znalezienie typów obiektów, które trzeba dodać do scenariusza
    Set<Integer> requiredTypeIds = templates
      .stream()
      .map(ObjectTemplate::getObjectTypeId)
      .collect(Collectors.toSet());

    objectTypeManager.assignObjectTypesToScenario(
      requiredTypeIds.stream().toList(),
      scenarioId
    );

    scenarioToObjectTemplateRepository.addTemplatesToScenario(
      scenarioId,
      templateIds.toArray(new Integer[0])
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
