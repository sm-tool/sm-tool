package api.database.service.core.provider;

import api.database.entity.object.ObjectTemplate;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.object.ObjectTemplateRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ObjectTemplateProvider {

  private final ObjectTemplateRepository objectTemplateRepository;

  @Autowired
  public ObjectTemplateProvider(
    ObjectTemplateRepository objectTemplateRepository
  ) {
    this.objectTemplateRepository = objectTemplateRepository;
  }

  public Page<ObjectTemplate> findAllTemplates(
    Pageable pageable,
    Integer scenarioId
  ) {
    return scenarioId == null
      ? objectTemplateRepository.findAll(pageable)
      : objectTemplateRepository.findAllByScenarioId(scenarioId, pageable);
  }

  public Page<ObjectTemplate> getTemplatesByScenarioIdAndObjectType(
    Integer scenarioId,
    Integer objectTypeId,
    Pageable pageable
  ) {
    return objectTemplateRepository.findTemplatesByScenarioIdAndObjectTypeId(
      scenarioId,
      objectTypeId,
      pageable
    );
  }

  public Page<ObjectTemplate> findByTitleContaining(
    String title,
    Pageable pageable,
    Integer scenarioId
  ) {
    return scenarioId == null
      ? objectTemplateRepository.findByTitleContaining(title, pageable)
      : objectTemplateRepository.findByTitleContainingAndScenarioId(
        title,
        scenarioId,
        pageable
      );
  }

  public ObjectTemplate getTemplateById(Integer id) {
    return objectTemplateRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          List.of(id.toString()),
          ErrorGroup.OBJECT_TEMPLATE,
          HttpStatus.NOT_FOUND
        )
      );
  }

  public List<Integer> findIdsByScenarioId(Integer scenarioId) {
    return objectTemplateRepository.findIdsByScenarioId(scenarioId);
  }
}
