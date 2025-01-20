package api.database.service.global;

import api.database.entity.object.ObjectType;
import api.database.entity.scenario.ScenarioToObjectType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.save.ObjectTypeSaveRequest;
import api.database.repository.object.ObjectTypeRepository;
import api.database.repository.scenario.ScenarioRepository;
import api.database.repository.scenario.ScenarioToObjectTypeRepository;
import api.database.service.core.ObjectTypeManager;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//TODO rozbić
@Service
public class ObjectTypeService {

  private final ScenarioToObjectTypeRepository scenarioToObjectTypeRepository;
  private final ObjectTypeRepository objectTypeRepository;
  private final ScenarioRepository scenarioRepository;
  private final ObjectTypeAssociationManagement objectTypeAssociationManagement;
  private final ObjectTypeManager objectTypeManager;

  @Autowired
  public ObjectTypeService(
    ScenarioToObjectTypeRepository scenarioToObjectTypeRepository,
    ObjectTypeRepository objectTypeRepository,
    ScenarioRepository scenarioRepository,
    ObjectTypeAssociationManagement objectTypeAssociationManagement,
    ObjectTypeManager objectTypeManager
  ) {
    this.scenarioToObjectTypeRepository = scenarioToObjectTypeRepository;
    this.objectTypeRepository = objectTypeRepository;
    this.scenarioRepository = scenarioRepository;
    this.objectTypeAssociationManagement = objectTypeAssociationManagement;
    this.objectTypeManager = objectTypeManager;
  }

  //--------------------------------------------------Dodawanie typów---------------------------------------------------------

  @Transactional
  public ObjectType addObjectType(
    ObjectTypeSaveRequest objectTypeInfo,
    Integer scenarioId
  ) {
    ObjectType savedObjectType = objectTypeRepository.saveAndRefresh(
      ObjectType.create(objectTypeInfo)
    );

    if (scenarioId != null) {
      scenarioToObjectTypeRepository.save(
        ScenarioToObjectType.create(savedObjectType.getId(), scenarioId)
      );
    }

    return savedObjectType;
  }

  //--------------------------------------------------Zmiana typów---------------------------------------------------------

  @Transactional
  public void deleteById(Integer id) {
    ObjectType objectType = objectTypeRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          List.of(id.toString()),
          ErrorGroup.OBJECT_TYPE,
          HttpStatus.BAD_REQUEST
        )
      );
    if (objectType.getHasChildren()) {
      throw new ApiException(
        ErrorCode.EXIST_CHILD_OBJECT_TYPE,
        ErrorGroup.OBJECT_TYPE,
        HttpStatus.BAD_REQUEST
      );
    } else if (objectType.getIsBaseType()) {
      throw new ApiException(
        ErrorCode.CANNOT_DELETE_BASIC_OBJECT_TYPE,
        ErrorGroup.OBJECT_TYPE,
        HttpStatus.BAD_REQUEST
      );
    } else {
      objectTypeRepository.deleteById(id);
    }
  }

  //--------------------Zmiana nazwy typu------------------------------------
  @Transactional
  public ObjectType updateObjectType(
    Integer objectTypeId,
    ObjectTypeSaveRequest request
  ) {
    ObjectType objectType = objectTypeRepository
      .findById(objectTypeId)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.OBJECT_TYPE,
          HttpStatus.NOT_FOUND
        )
      );
    if (
      objectTypeManager.checkIfTypesAreInHierarchy(
        objectType.getId(),
        request.parentId()
      )
    ) throw new ApiException(
      ErrorCode.WRONG_HIERARCHY,
      ErrorGroup.OBJECT_TYPE,
      HttpStatus.BAD_REQUEST
    );
    objectType.setTitle(request.title());
    objectType.setDescription(request.description());
    objectType.setColor(request.color());
    objectType.setIsOnlyGlobal(request.isOnlyGlobal());
    objectType.setParentId(request.parentId());
    objectType.setCanBeUser(request.canBeUser());

    objectTypeRepository.saveAndRefresh(objectType);

    objectTypeAssociationManagement.checkAssociationsAndDeleteIfInvalid(
      objectTypeId
    );
    return objectType;
  }
}
