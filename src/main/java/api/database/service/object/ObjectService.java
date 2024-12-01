package api.database.service.object;

import api.database.entity.object.QdsAttributeTemplate;
import api.database.entity.object.QdsObject;
import api.database.model.QdsResponseUpdateList;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.object.QdsDataAttribute;
import api.database.model.object.QdsDataObject;
import api.database.model.object.QdsDataObjectSimple;
import api.database.repository.object.QdsObjectRepository;
import api.database.service.core.BranchingOperations;
import api.database.service.core.ObjectTypeOperations;
import api.database.service.core.ThreadBaseOperations;
import api.database.service.template.AttributeTemplateService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

//TODO rozbić
/// Zarządza obiektami w systemie. Odpowiada za:
/// - Tworzenie nowych obiektów wraz z ich atrybutami
/// - Walidację typów i szablonów obiektów
/// - Zarządzanie powiązaniami obiektów z wątkami
/// - Propagację obiektów przez rozgałęzienia
@Service
public class ObjectService {

  private final QdsObjectRepository qdsObjectRepository;
  private final AttributeService attributeService;
  private final ThreadBaseOperations threadBaseOperations;
  private final ObjectThreadManagement objectThreadManagement;
  private final ObjectTypeOperations objectTypeOperations;
  private final BranchingOperations branchingOperations;
  private final ScenarioObjectTypesManagement scenarioObjectTypesManagement;
  private final AttributeTemplateService attributeTemplateService;

  @Autowired
  public ObjectService(
    QdsObjectRepository qdsObjectRepository,
    AttributeService attributeService,
    ThreadBaseOperations threadBaseOperations,
    ObjectThreadManagement objectThreadManagement,
    ObjectTypeOperations objectTypeOperations,
    BranchingOperations branchingOperations,
    ScenarioObjectTypesManagement scenarioObjectTypesManagement,
    AttributeTemplateService attributeTemplateService
  ) {
    this.qdsObjectRepository = qdsObjectRepository;
    this.attributeService = attributeService;
    this.threadBaseOperations = threadBaseOperations;
    this.objectThreadManagement = objectThreadManagement;
    this.objectTypeOperations = objectTypeOperations;
    this.branchingOperations = branchingOperations;
    this.scenarioObjectTypesManagement = scenarioObjectTypesManagement;
    this.attributeTemplateService = attributeTemplateService;
  }

  //--------------------------------------------------Dodawanie obiektów---------------------------------------------------------

  /// Weryfikuje możliwość utworzenia obiektu w danym kontekście.
  /// Sprawdza:
  /// - Poprawność typu względem globalności
  /// - Dostępność typu i szablonu w scenariuszu
  /// - Obecność eventu START w wątku
  ///
  /// @param scenarioId id scenariusza
  /// @param threadId id wątku
  /// @param objectTypeId id typu obiektu
  /// @param templateId id szablonu
  /// @return id wątku (globalny lub oryginalny)
  public Integer verifyObject(
    Integer scenarioId,
    Integer threadId,
    Integer objectTypeId,
    Integer templateId
  ) {
    //Pobranie globalnego wątku
    Integer globalThreadId = threadBaseOperations.getGlobalThreadId(scenarioId);
    if (globalThreadId == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      List.of(scenarioId.toString()),
      ErrorGroup.SCENARIO,
      HttpStatus.BAD_REQUEST
    );
    //Sprawdzenie możliwości wstawienia typu
    objectTypeOperations.checkForGlobalObjectType(
      objectTypeId,
      globalThreadId.equals(threadId) || threadId == 0
    );

    scenarioObjectTypesManagement.checkIfCanAddObjectToScenario(
      scenarioId,
      objectTypeId,
      templateId
    );
    objectThreadManagement.checkIfThreadWithStart(threadId);
    return (globalThreadId.equals(threadId) || threadId == 0)
      ? globalThreadId
      : threadId;
  }

  /// Weryfikuje zgodność atrybutów ze wskazanym szablonem.
  /// Sprawdza:
  /// - Zgodność typu obiektu z typem szablonu
  /// - Kompletność wymaganych atrybutów
  ///
  /// @param attributes lista atrybutów
  /// @param objectTypeId id typu obiektu
  /// @param templateId id szablonu
  /// @throws ApiException gdy niezgodność z szablonem
  private void verifyCorrespondenceWithTemplate(
    List<QdsDataAttribute> attributes,
    Integer objectTypeId,
    Integer templateId
  ) {
    if (
      !objectTypeId.equals(objectTypeOperations.getTemplateType(templateId))
    ) throw new ApiException(
      ErrorCode.INCOMPATIBLE_TYPES,
      ErrorGroup.OBJECT,
      HttpStatus.BAD_REQUEST
    );
    List<Integer> attributeTemplatesId = attributeTemplateService
      .getAttributeTemplates(templateId)
      .stream()
      .map(QdsAttributeTemplate::getId)
      .sorted()
      .toList();
    List<Integer> attributeTemplatesFromAttributes = attributes
      .stream()
      .map(QdsDataAttribute::attributeTemplateId)
      .sorted()
      .toList();
    if (
      !attributeTemplatesFromAttributes.equals(attributeTemplatesId)
    ) throw new ApiException(
      ErrorCode.INCOMPATIBLE_TEMPLATE_WITH_OBJECT,
      ErrorGroup.ATTRIBUTE,
      HttpStatus.BAD_REQUEST
    );
  }

  //TODO sprawdzić
  /// Dodaje nowy obiekt do systemu.
  /// Proces tworzenia:
  /// 1. Weryfikacja możliwości utworzenia
  /// 2. Utworzenie obiektu bazowego
  /// 3. Weryfikacja i dodanie atrybutów
  /// 4. Powiązanie z wątkiem
  /// 5. Aktualizacja rozgałęzień i propagacja przez JOIN-y
  ///
  /// @param scenarioId id scenariusza
  /// @param info dane nowego obiektu
  /// @return status aktualizacji
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public QdsResponseUpdateList addObject(
    Integer scenarioId,
    QdsDataObject info
  ) {
    Integer threadId = verifyObject(
      scenarioId,
      info.id(),
      info.objectTypeId(),
      info.templateId()
    );
    //Wstawienie obiektu
    Integer objectId = qdsObjectRepository
      .save(
        new QdsObject(
          null,
          scenarioId,
          info.templateId(),
          info.objectTypeId(),
          info.name(),
          null,
          null,
          null
        )
      )
      .getId();
    //Weryfikacja wszystkich atrybutów
    verifyCorrespondenceWithTemplate(
      info.attributes(),
      info.objectTypeId(),
      info.templateId()
    );

    //Wstawienie atrybutów
    attributeService.addAttributes(objectId, info.attributes());

    qdsObjectRepository.addObjectToThread(objectId, threadId);
    //Uporządkowanie rozgałęzień
    branchingOperations.findIncorrectForksAndMarkThem(threadId);
    branchingOperations.transferAdditionalObjectsOnJoins(
      threadId,
      List.of(objectId)
    );
    return new QdsResponseUpdateList(List.of("thread", "branching", "object"));
  }

  //----------------------Usuwanie Scenariusza-------------------------------------
  /// Usuwa wszystkie obiekty dla scenariusza.
  ///
  /// @param scenarioId id scenariusza
  @Transactional
  public void deleteObjectsByScenarioId(Integer scenarioId) {
    qdsObjectRepository.deleteObjectsByScenarioId(scenarioId);
    //Atrybuty obiektu usuwane za pomocą ON_DELETE na kluczu obcym na object
    //Asocjacje usuwane za pomocą ON_DELETE na kluczu obcym na object
    //UserToObject usuwane za pomocą ON_DELETE na kluczu obcym na object
  }

  //---------------------Wyświetlanie obiektów przypisanych do danego scenariusza-----------------------
  /// Pobiera podstawowe informacje o obiektach w scenariuszu.
  ///
  /// @param scenarioId id scenariusza
  /// @return lista uproszczonych danych obiektów
  public List<QdsDataObjectSimple> getObjectsByScenarioId(Integer scenarioId) {
    List<QdsObject> objects = qdsObjectRepository.findObjectsByScenarioId(
      scenarioId
    );
    return objects
      .stream()
      .map(obj ->
        new QdsDataObjectSimple(
          obj.getId(),
          obj.getScenarioId(),
          obj.getTemplateId(),
          obj.getObjectTypeId(),
          obj.getName()
        )
      )
      .collect(Collectors.toList());
  }

  //-------------------------------------------Usuwanie obiektów---------------------------------------
  @Transactional
  public void deleteObjectById(Integer objectId) {
    if (!qdsObjectRepository.existsById(objectId)) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.OBJECT,
        HttpStatus.NOT_FOUND
      );
    }
    qdsObjectRepository.deleteById(objectId);
  }
}
