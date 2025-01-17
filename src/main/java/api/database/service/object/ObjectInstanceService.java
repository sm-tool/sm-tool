package api.database.service.object;

import api.database.entity.object.ObjectInstance;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.domain.transfer.InternalObjectThreadPair;
import api.database.model.domain.transfer.InternalTransferPairs;
import api.database.model.exception.ApiException;
import api.database.model.request.create.ObjectInstanceCreateRequest;
import api.database.model.request.update.ObjectInstanceUpdateRequest;
import api.database.model.response.ObjectInstanceResponse;
import api.database.repository.object.ObjectInstanceRepository;
import api.database.service.core.AttributeAdder;
import api.database.service.core.ObjectInstanceTransfer;
import api.database.service.core.provider.ObjectInstanceProvider;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/// Zarządza obiektami w systemie. Odpowiada za:
/// - Tworzenie nowych obiektów wraz z ich atrybutami
/// - Walidację typów i szablonów obiektów
/// - Zarządzanie powiązaniami obiektów z wątkami
/// - Propagację obiektów przez rozgałęzienia
@Service
public class ObjectInstanceService {

  private final ObjectInstanceRepository objectRepository;
  private final ObjectInstanceValidator objectInstanceValidator;
  private final AttributeAdder attributeAdder;
  private final ObjectInstanceTransfer objectInstanceTransfer;
  private final ObjectInstanceProvider objectInstanceProvider;

  @Autowired
  public ObjectInstanceService(
    ObjectInstanceRepository objectRepository,
    ObjectInstanceValidator objectInstanceValidator,
    AttributeAdder attributeAdder,
    ObjectInstanceTransfer objectInstanceTransfer,
    ObjectInstanceProvider objectInstanceProvider
  ) {
    this.objectRepository = objectRepository;
    this.objectInstanceValidator = objectInstanceValidator;
    this.attributeAdder = attributeAdder;
    this.objectInstanceTransfer = objectInstanceTransfer;
    this.objectInstanceProvider = objectInstanceProvider;
  }

  //--------------------------------------------------Dodawanie obiektów---------------------------------------------------------

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
  public ObjectInstanceResponse addObject(
    Integer scenarioId,
    ObjectInstanceCreateRequest info
  ) {
    Pair<Integer, Integer> threadWithFirstEvent =
      objectInstanceValidator.verifyObject(scenarioId, info);
    //Wstawienie obiektu
    Integer objectId = objectRepository
      .save(ObjectInstance.create(info, scenarioId))
      .getId();

    //Wstawienie atrybutów
    attributeAdder.addDefaultAttributes(
      objectId,
      info.templateId(),
      threadWithFirstEvent.getSecond()
    );

    // Transfer obiektu
    objectInstanceTransfer.handleObjectTransfers(
      new InternalTransferPairs(
        Set.of(
          new InternalObjectThreadPair(
            objectId,
            threadWithFirstEvent.getFirst()
          )
        ),
        Set.of()
      ),
      scenarioId
    );
    return objectInstanceProvider.getObjectWithAttributes(objectId, scenarioId);
  }

  //----------------------Aktualizacja nazwy---------------------------------------
  @Transactional
  public void updateObject(
    Integer id,
    ObjectInstanceUpdateRequest updateRequest
  ) {
    ObjectInstance objectInstance = objectRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          List.of(id.toString()),
          ErrorGroup.OBJECT,
          HttpStatus.NOT_FOUND
        )
      );
    objectInstance.setName(updateRequest.name());
    objectRepository.save(objectInstance);
  }

  //----------------------Usuwanie Scenariusza-------------------------------------
  /// Usuwa wszystkie obiekty dla scenariusza.
  ///
  /// @param scenarioId id scenariusza
  @Transactional
  public void deleteObjectsByScenarioId(Integer scenarioId) {
    objectRepository.deleteObjectsByScenarioId(scenarioId);
    //Atrybuty obiektu usuwane za pomocą ON_DELETE na kluczu obcym na object
    //Asocjacje usuwane za pomocą ON_DELETE na kluczu obcym na object
    //UserToObject usuwane za pomocą ON_DELETE na kluczu obcym na object
  }

  //-------------------------------------------Usuwanie obiektów---------------------------------------
  @Transactional
  public void deleteObjectById(Integer objectId) {
    if (!objectRepository.existsById(objectId)) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.OBJECT,
        HttpStatus.NOT_FOUND
      );
    }
    objectRepository.deleteById(objectId);
  }
}
