package api.database.service.object;

import static api.database.service.configuration.ConfigurationService.CONFIG_ID;

import api.database.entity.association.QdsAssociation;
import api.database.entity.association.QdsAssociationType;
import api.database.entity.object.QdsObject;
import api.database.entity.object.QdsObjectType;
import api.database.entity.scenario.QdsScenarioToObjectType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.association.QdsAssociationRepository;
import api.database.repository.association.QdsAssociationTypeRepository;
import api.database.repository.configuration.QdsConfigurationRepository;
import api.database.repository.object.QdsObjectTypeRepository;
import api.database.repository.scenario.QdsScenarioRepository;
import api.database.repository.scenario.QdsScenarioToObjectTypeRepository;
import java.util.List;
import java.util.Optional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//TODO rozbić
@Service
public class ObjectTypeService {

  private final QdsScenarioToObjectTypeRepository qdsScenarioToObjectTypeRepository;
  private final QdsObjectTypeRepository qdsObjectTypeRepository;
  private final QdsConfigurationRepository qdsConfigurationRepository;
  private final QdsScenarioRepository qdsScenarioRepository;
  private final QdsAssociationRepository qdsAssociationRepository;
  private final QdsAssociationTypeRepository qdsAssociationTypeRepository;

  @Autowired
  public ObjectTypeService(
    QdsScenarioToObjectTypeRepository qdsScenarioToObjectTypeRepository,
    QdsObjectTypeRepository qdsObjectTypeRepository,
    QdsConfigurationRepository qdsConfigurationRepository,
    QdsScenarioRepository qdsScenarioRepository,
    QdsAssociationRepository qdsAssociationRepository,
    QdsAssociationTypeRepository qdsAssociationTypeRepository
  ) {
    this.qdsScenarioToObjectTypeRepository = qdsScenarioToObjectTypeRepository;
    this.qdsObjectTypeRepository = qdsObjectTypeRepository;
    this.qdsConfigurationRepository = qdsConfigurationRepository;
    this.qdsScenarioRepository = qdsScenarioRepository;
    this.qdsAssociationRepository = qdsAssociationRepository;
    this.qdsAssociationTypeRepository = qdsAssociationTypeRepository;
  }

  //--------------------------------------------------Pobieranie typów---------------------------------------------------------

  public List<QdsObjectType> getAllObjectTypes() {
    return qdsObjectTypeRepository.findAll();
  }

  public Optional<QdsObjectType> findById(Integer id) {
    Optional<QdsObjectType> objectType = qdsObjectTypeRepository.findById(id);
    objectType.ifPresent(obj -> Hibernate.initialize(obj.getParent()));
    return objectType;
  }

  public Page<QdsObjectType> findAllByScenarioId(
    Integer scenarioId,
    Pageable pageable
  ) {
    return qdsObjectTypeRepository.findAllByScenarioId(scenarioId, pageable);
  }

  //--------------------------------------------------Dodawanie typów---------------------------------------------------------

  /**
   * Funkcja dodająca typy obiektów do scenariusza działająca wraz z tworzeniem scenariusza
   * @apiNote Wykonywana w ramach transakcji nadrzędnej
   */
  public void addObjectTypesToScenario(
    Integer scenarioId,
    List<Integer> objectTypeIds
  ) {
    for (Integer objectTypeId : objectTypeIds) {
      qdsScenarioToObjectTypeRepository.save(
        new QdsScenarioToObjectType(null, scenarioId, objectTypeId, null, null)
      );
    }
  }

  /**
   * Funkcja dodająca podstawowe typy (z konfiguracji) do nowo utworzonego scenariusza
   * @param scenarioId
   */
  public void addDefaultTypes(Integer scenarioId) {
    qdsScenarioToObjectTypeRepository.addDefaultTypes(scenarioId, CONFIG_ID);
  }

  @Transactional
  public QdsObjectType saveObjectType(
    QdsObjectType objectType,
    Integer scenarioId
  ) {
    QdsObjectType savedObjectType = qdsObjectTypeRepository.save(objectType);

    if (scenarioId != null) {
      QdsScenarioToObjectType scenarioToObjectType =
        new QdsScenarioToObjectType();
      scenarioToObjectType.setScenarioId(scenarioId);
      scenarioToObjectType.setObjectTypeId(savedObjectType.getId());

      qdsScenarioToObjectTypeRepository.save(scenarioToObjectType);
    }

    return savedObjectType;
  }

  //--------------------------------------------------Zmiana typów---------------------------------------------------------

  @Transactional
  public void deleteById(Integer id) {
    if (qdsObjectTypeRepository.existsByParentId(id)) {
      throw new ApiException(
        ErrorCode.EXIST_CHILD_OBJECT_TYPE,
        ErrorGroup.OBJECT_TYPE,
        HttpStatus.BAD_REQUEST
      );
    } else if (qdsConfigurationRepository.getTypeIds().contains(id)) {
      throw new ApiException(
        ErrorCode.CANNOT_DELETE_BASIC_OBJECT_TYPE,
        ErrorGroup.OBJECT_TYPE,
        HttpStatus.BAD_REQUEST
      );
    } else {
      qdsObjectTypeRepository.deleteById(id);
    }
  }

  //--------------------------------------------------Import typów---------------------------------------------------------

  @Transactional
  public void copyObjectTypesBetweenScenarios(
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
    qdsScenarioToObjectTypeRepository.copyObjectTypesBetweenScenarios(
      sourceScenarioId,
      targetScenarioId
    );
  }

  //--------------------Zmiana nazwy typu------------------------------------
  @Transactional
  public QdsObjectType updateObjectTypeTitle(
    Integer objectTypeId,
    String newTitle,
    String newDescription,
    String newColor,
    Boolean newIsOnlyGlobal,
    Integer newParentId
  ) {
    QdsObjectType objectType = qdsObjectTypeRepository
      .findById(objectTypeId)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.OBJECT_TYPE,
          HttpStatus.NOT_FOUND
        )
      );
    objectType.setTitle(newTitle);
    objectType.setDescription(newDescription);
    objectType.setColor(newColor);
    objectType.setIsOnlyGlobal(newIsOnlyGlobal);
    objectType.setParentId(newParentId);
    qdsObjectTypeRepository.save(objectType);
    List<QdsAssociation> associations =
      qdsAssociationRepository.findAssociationsByObjectTypeId(objectTypeId);
    for (QdsAssociation association : associations) {
      QdsAssociationType associationType = association.getAssociationType();
      QdsObject object1 = association.getObject1();
      QdsObject object2 = association.getObject2();
      Integer requiredTypeForObject1 = associationType.getFirstObjectTypeId();
      Integer requiredTypeForObject2 = associationType.getSecondObjectTypeId();
      boolean isFirstTypeValid = object1
        .getObjectTypeId()
        .equals(requiredTypeForObject1);
      boolean isSecondTypeValid = object2
        .getObjectTypeId()
        .equals(requiredTypeForObject2);
      if (!isFirstTypeValid || !isSecondTypeValid) {
        qdsAssociationRepository.delete(association);
      }
    }
    return objectType;
  }
}
