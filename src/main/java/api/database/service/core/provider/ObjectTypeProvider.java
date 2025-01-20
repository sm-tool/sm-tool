package api.database.service.core.provider;

import api.database.entity.object.ObjectType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.object.ObjectTypeRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ObjectTypeProvider {

  private final ObjectTypeRepository objectTypeRepository;

  @Autowired
  public ObjectTypeProvider(ObjectTypeRepository objectTypeRepository) {
    this.objectTypeRepository = objectTypeRepository;
  }

  /// Pobiera listę wszystkich przodków dla danego typu obiektu.
  ///
  /// @param objectTypeId identyfikator typu obiektu
  /// @return lista identyfikatorów przodków
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public List<Integer> getTypeAncestors(Integer objectTypeId) {
    return objectTypeRepository.getAllAncestors(objectTypeId);
  }

  public Page<ObjectType> findByTitleContaining(
    String title,
    Pageable pageable,
    Integer scenarioId
  ) {
    return scenarioId == null
      ? objectTypeRepository.findByTitleContaining(title, pageable)
      : objectTypeRepository.findByTitleContainingAndScenarioId(
        title,
        pageable,
        scenarioId
      );
  }

  public Page<ObjectType> findAll(Pageable pageable, Integer scenarioId) {
    return scenarioId == null
      ? objectTypeRepository.findAll(pageable)
      : objectTypeRepository.findAllByScenarioId(scenarioId, pageable);
  }

  public ObjectType findById(Integer id) {
    return objectTypeRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.OBJECT_TYPE,
          HttpStatus.NOT_FOUND
        )
      );
  }

  public List<ObjectType> findByParentId(
    Integer parentId,
    boolean findRoots,
    Integer scenarioId
  ) {
    if (parentId == null && !findRoots) throw new ApiException(
      ErrorCode.NULL_VALUE,
      List.of("parentId"),
      ErrorGroup.OBJECT_TYPE,
      HttpStatus.BAD_REQUEST
    );
    if (scenarioId == null) {
      return objectTypeRepository.findByParentId(parentId);
    } else {
      return objectTypeRepository.findByParentIdAndScenarioId(
        parentId,
        scenarioId
      );
    }
  }

  public List<Integer> findIdsByScenarioId(Integer scenarioId) {
    return objectTypeRepository.findIdsByScenarioId(scenarioId);
  }
}
