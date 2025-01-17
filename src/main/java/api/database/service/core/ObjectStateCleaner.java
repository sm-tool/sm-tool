package api.database.service.core;

import api.database.model.domain.association.InternalEventAssociationChange;
import api.database.model.domain.transfer.InternalRemoveAnalysisResult;
import api.database.repository.association.AssociationChangeRepository;
import api.database.repository.association.AssociationRepository;
import api.database.repository.attribute.AttributeChangeRepository;
import api.database.repository.object.ObjectInstanceRepository;
import api.database.repository.special.ObjectInstanceTransferRepository;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Serwis odpowiedzialny za czyszczenie stanu obiektów w systemie.
/// Umożliwia usuwanie zmian atrybutów, asocjacji oraz powiązań obiektów z wątkami
/// w określonych kontekstach czasowych i scenariuszowych.
///
/// # Główne operacje
/// - Usuwanie nieaktualnych powiązań obiektów z wątkami
/// - Czyszczenie nieprawidłowych zmian w scenariuszu
/// - Zarządzanie usuwaniem obiektów z wielu wątków
@Component
public class ObjectStateCleaner {

  private final AssociationChangeRepository associationChangeRepository;
  private final AttributeChangeRepository attributeChangeRepository;
  private final AssociationRepository associationRepository;
  private final ObjectInstanceRepository objectRepository;
  private final ObjectInstanceTransferRepository objectInstanceTransferRepository;
  private final EventManager eventManager;

  @Autowired
  public ObjectStateCleaner(
    AssociationChangeRepository associationChangeRepository,
    AttributeChangeRepository attributeChangeRepository,
    AssociationRepository associationRepository,
    ObjectInstanceRepository objectRepository,
    ObjectInstanceTransferRepository objectInstanceTransferRepository,
    EventManager eventManager
  ) {
    this.associationChangeRepository = associationChangeRepository;
    this.attributeChangeRepository = attributeChangeRepository;
    this.associationRepository = associationRepository;
    this.objectRepository = objectRepository;
    this.objectInstanceTransferRepository = objectInstanceTransferRepository;
    this.eventManager = eventManager;
  }

  /// Usuwa asocjacje, które nie są już używane po usunięciu zmian asocjacji.
  /// Wykonuje czyszczenie "osieroconych" rekordów.
  ///
  /// @apiNote Operacja wykonywana w ramach transakcji nadrzędnej
  public void deleteNotUsedAssociations() {
    associationRepository.deleteEmptyAssociations();
  }

  //------------------------------Usuwanie konfliktów zmian dla globalnego wątku----------------------------------------

  /// Usuwa zmiany atrybutów dla wskazanych obiektów w określonym czasie.
  ///
  /// @param time czas graniczny dla usuwanych zmian
  /// @param objects lista identyfikatorów obiektów
  public void deleteAttributeChangesInTime(
    Integer time,
    List<Integer> objects,
    Integer scenarioId
  ) {
    attributeChangeRepository.deleteAttributeChangesInTimeByObjectIds(
      time,
      objects.toArray(new Integer[0])
    );
    eventManager.changeEventsWithoutChangesToIdle(scenarioId);
  }

  /// Usuwa zmiany asocjacji dla wskazanych par obiektów w kontekście wątku.
  ///
  /// @param time czas
  /// @param associationsToDelete lista zmian asocjacji do usunięcia
  public void deleteAssociationChangesInTime(
    Integer time,
    List<InternalEventAssociationChange> associationsToDelete,
    Integer scenarioId
  ) {
    associationChangeRepository.deleteAssociationChangesInTimeByObjectIds(
      time,
      associationsToDelete
        .stream()
        .map(InternalEventAssociationChange::getObject1Id)
        .toArray(Integer[]::new),
      associationsToDelete
        .stream()
        .map(InternalEventAssociationChange::getObject2Id)
        .toArray(Integer[]::new)
    );
    eventManager.changeEventsWithoutChangesToIdle(scenarioId);
  }

  //------------------------------------------------------ThreadToObject-------------------------------------------------
  /// Usuwa powiązania obiektów z wątkami po określonym czasie.
  /// Wykonuje się w kontekście czyszczenia stanu po zmianie struktury wątków.
  ///
  /// @param time czas graniczny dla usuwanych powiązań
  /// @param objectIds lista identyfikatorów obiektów
  public void deleteObjectConnectionsToThreadsAfterTime(
    Integer time,
    List<Integer> objectIds
  ) {
    objectRepository.deleteObjectConnectionsToThreadsAfterTime(
      time,
      objectIds.toArray(new Integer[0])
    );
  }

  //--------------------------------------------------Połączone----------------------------------------------------------

  public void deleteObjectInformationAfterTime(
    Integer time,
    List<Integer> objectIds,
    Integer scenarioId
  ) {
    deleteObjectConnectionsToThreadsAfterTime(time, objectIds);
    deleteInvalidChanges(scenarioId);
    eventManager.changeEventsWithoutChangesToIdle(scenarioId);
  }

  /// Usuwa wszystkie nieprawidłowe zmiany dla danego scenariusza.
  /// Kolejno:
  /// 1. Usuwa nieprawidłowe zmiany asocjacji
  /// 2. Usuwa nieprawidłowe zmiany atrybutów
  /// 3. Czyści nieużywane asocjacje
  ///
  /// @param scenarioId identyfikator scenariusza
  public void deleteInvalidChanges(Integer scenarioId) {
    objectInstanceTransferRepository.deleteInvalidAssociationChanges(
      scenarioId
    );
    objectInstanceTransferRepository.deleteInvalidAttributeChanges(scenarioId);
    associationRepository.deleteEmptyAssociations();
    eventManager.changeEventsWithoutChangesToIdle(scenarioId);
  }

  /// Usuwa powiązania obiektów z wątkami na podstawie wyników analizy usuwania.
  /// Wykorzystuje wyniki analizy do określenia, które powiązania należy usunąć
  /// dla poszczególnych par obiekt-wątek.
  ///
  /// @param removeAnalysis mapa wyników analizy usuwania per obiekt
  public void deleteObjectConnections(
    Map<Integer, InternalRemoveAnalysisResult> removeAnalysis
  ) {
    objectInstanceTransferRepository.deleteSpecificObjectConnections(
      // Thread IDs - po prostu wszystkie threadIds ze zbiorów
      removeAnalysis
        .values()
        .stream()
        .flatMap(result -> result.threadsToClean().stream())
        .toArray(Integer[]::new),
      // Object IDs - każdy objectId powtórzony tyle razy ile ma wątków
      removeAnalysis
        .entrySet()
        .stream()
        .flatMap(e ->
          Collections.nCopies(
            e.getValue().threadsToClean().size(),
            e.getKey()
          ).stream()
        )
        .toArray(Integer[]::new)
    );
  }
}
