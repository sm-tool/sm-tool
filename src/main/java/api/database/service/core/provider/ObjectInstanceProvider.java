package api.database.service.core.provider;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.domain.object.InternalObjectInstance;
import api.database.model.domain.object.InternalObjectInstanceAttributes;
import api.database.model.domain.object.InternalObjectInstanceType;
import api.database.model.domain.transfer.InternalObjectIdWIthThread;
import api.database.model.domain.transfer.InternalThreadObjects;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.PossibleAssociationRequest;
import api.database.model.response.AttributeResponse;
import api.database.model.response.ObjectInstanceResponse;
import api.database.model.response.PossibleAssociationResponse;
import api.database.model.response.ThreadObjectsResponse;
import api.database.repository.object.ObjectInstanceRepository;
import api.database.service.operations.ScenarioValidator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ObjectInstanceProvider {

  private final ObjectInstanceRepository objectInstanceRepository;
  private final AttributeProvider attributeProvider;
  private final ScenarioValidator scenarioValidator;
  private final AssociationTypeProvider associationTypeProvider;

  @Autowired
  public ObjectInstanceProvider(
    ObjectInstanceRepository objectInstanceRepository,
    AttributeProvider attributeProvider,
    ScenarioValidator scenarioValidator,
    AssociationTypeProvider associationTypeProvider
  ) {
    this.objectInstanceRepository = objectInstanceRepository;
    this.attributeProvider = attributeProvider;
    this.scenarioValidator = scenarioValidator;
    this.associationTypeProvider = associationTypeProvider;
  }

  public Map<Integer, Integer> getObjectTypes(List<Integer> objectIds) {
    return objectInstanceRepository
      .getObjectTypes(objectIds.toArray(new Integer[0]))
      .stream()
      .collect(
        Collectors.toMap(
          InternalObjectInstanceType::getId,
          InternalObjectInstanceType::getObjectTypeId
        )
      );
  }

  public InternalThreadObjects getInternalObjectsAvailableForThread(
    Integer threadId,
    Integer scenarioId
  ) {
    List<InternalObjectInstance> objects =
      objectInstanceRepository.getAvailableObjects(scenarioId, threadId);

    return InternalThreadObjects.create(objects);
  }

  /// Pobiera obiekty przypisane do wątku wraz z globalnymi.
  ///
  /// @param threadId identyfikator wątku
  /// @return lista identyfikatorów obiektów
  public ThreadObjectsResponse getObjectsAvailableForThread(
    Integer threadId,
    Integer scenarioId
  ) {
    scenarioValidator.checkIfThreadsAreInScenario(
      List.of(threadId),
      scenarioId
    );
    List<InternalObjectInstance> objects =
      objectInstanceRepository.getAvailableObjects(scenarioId, threadId);
    Map<Integer, List<AttributeResponse>> attributes =
      attributeProvider.getObjectsAttributes(
        objects.stream().map(InternalObjectInstance::getId).toList()
      );
    return ThreadObjectsResponse.create(objects, attributes);
  }

  /// Pobiera id obiektów wraz z id ich atrybutów dostępne dla wątku, uwzględniając obiekty z wątku globalnego.
  ///
  /// @param threadId identyfikator wątku
  /// @param globalThreadId identyfikator wątku globalnego
  /// @return lista obiektów z ich atrybutami dostępnymi w kontekście eventu
  public List<
    InternalObjectInstanceAttributes
  > getObjectIdsWithAttributeIdsAvailableForThread(
    Integer threadId,
    Integer globalThreadId
  ) {
    return objectInstanceRepository.getObjectIdsWithAttributeIdsAvailableForThread(
      threadId,
      globalThreadId
    );
  }

  /// Pobiera podstawowe informacje o obiektach w scenariuszu.
  ///
  /// @param scenarioId id scenariusza
  /// @return lista danych obiektów
  public List<ObjectInstanceResponse> getObjectsForScenario(
    Integer scenarioId
  ) {
    List<InternalObjectInstance> objects =
      objectInstanceRepository.getAvailableObjects(scenarioId, null);
    Map<Integer, List<AttributeResponse>> attributes =
      attributeProvider.getObjectsAttributes(
        objects.stream().map(InternalObjectInstance::getId).toList()
      );
    return objects
      .stream()
      .map(o -> ObjectInstanceResponse.from(o, attributes.get(o.getId())))
      .toList();
  }

  public ObjectInstanceResponse getObjectWithAttributes(
    Integer objectId,
    Integer scenarioId
  ) {
    InternalObjectInstance obj = objectInstanceRepository.getOneObject(
      scenarioId,
      objectId
    );
    if (obj == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.OBJECT,
      HttpStatus.NOT_FOUND
    );
    Map<Integer, List<AttributeResponse>> attributes =
      attributeProvider.getObjectsAttributes(List.of(obj.getId()));
    return ObjectInstanceResponse.from(obj, attributes.get(obj.getId()));
  }

  public List<InternalObjectInstance> getObjectsUsingTemplate(
    Integer templateId
  ) {
    return objectInstanceRepository.getObjectsUsingTemplate(templateId);
  }

  public Map<Integer, List<Integer>> getObjectsIdsAssignedToThreads(
    List<Integer> threadIds
  ) {
    return objectInstanceRepository
      .getObjectIdsAssignedToThreads(threadIds.toArray(new Integer[0]))
      .stream()
      .collect(
        Collectors.groupingBy(
          InternalObjectIdWIthThread::getThreadId,
          Collectors.mapping(
            InternalObjectIdWIthThread::getObjectId,
            Collectors.toList()
          )
        )
      );
  }

  public List<PossibleAssociationResponse> getPossibleAssociations(
    PossibleAssociationRequest request,
    Integer scenarioId
  ) {
    // Sprawdzenie wątku
    scenarioValidator.checkIfThreadsAreInScenario(
      List.of(request.threadId()),
      scenarioId
    );
    // Dostępne id obiektów
    InternalThreadObjects availableObjects =
      getInternalObjectsAvailableForThread(request.threadId(), scenarioId);
    // Typy dostępnych obiektów
    Map<Integer, Integer> types = getObjectTypes(
      Stream.concat(
        availableObjects.global().stream(),
        availableObjects.local().stream()
      ).collect(Collectors.toList())
    );
    // Nie znaleziono typu to znaczy że taki obiekt nie istniał albo podano zły wątek
    if (types.get(request.objectId()) == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.OBJECT,
      HttpStatus.NOT_FOUND
    );
    // Jak jest globalny to nie może wejść z innym globalnym
    boolean isSelectedObjectGlobal = availableObjects
      .global()
      .stream()
      .anyMatch(f -> f.equals(request.objectId()));
    List<Integer> objectsToCheck;
    if (isSelectedObjectGlobal) {
      // Dla obiektu globalnego sprawdzamy tylko lokalne
      objectsToCheck = availableObjects.local();
    } else {
      // Dla obiektu lokalnego sprawdzamy wszystkie
      objectsToCheck = Stream.concat(
        availableObjects.global().stream(),
        availableObjects.local().stream()
      ).collect(Collectors.toList());
    }

    return associationTypeProvider.getAvailableAssociationTypes(
      types.get(request.objectId()),
      objectsToCheck.stream().map(types::get).toArray(Integer[]::new),
      objectsToCheck.toArray(Integer[]::new),
      scenarioId
    );
  }
}
