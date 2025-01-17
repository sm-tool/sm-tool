package api.database.service.core.internal;

import api.database.repository.object.ObjectInstanceRepository;
import api.database.service.core.ObjectStateCleaner;
import api.database.service.core.provider.ObjectInstanceProvider;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ThreadObjectCleaner {

  private final ObjectInstanceProvider objectInstanceProvider;
  private final ObjectStateCleaner objectStateCleaner;
  private final ObjectInstanceRepository objectInstanceRepository;

  public ThreadObjectCleaner(
    ObjectInstanceProvider objectInstanceProvider,
    ObjectStateCleaner objectStateCleaner,
    ObjectInstanceRepository objectInstanceRepository
  ) {
    this.objectInstanceProvider = objectInstanceProvider;
    this.objectStateCleaner = objectStateCleaner;
    this.objectInstanceRepository = objectInstanceRepository;
  }

  public void cleanObjectsFromStartThread(Integer threadId) {
    objectInstanceRepository.deleteObjectsForThread(threadId);
    //Atrybuty obiektu usuwane za pomocą ON_DELETE na kluczu obcym na object
    //Asocjacje usuwane za pomocą ON_DELETE na kluczu obcym na object
    //Zmiany atrybutów usuwane za pomocą ON_DELETE na kluczu obcym na atrybutach
    //Zmiany asocjacji usuwane za pomocą ON_DELETE na kluczu obcym na asocjacjach
    //ThreadToObject usuwane za pomocą ON_DELETE na kluczu obcym na object
    //UserToObject usuwane za pomocą ON_DELETE na kluczu obcym na object
  }

  public void cleanObjectOperationsAfterTime(
    Integer threadId,
    Integer eventTime,
    Integer scenarioId
  ) {
    List<Integer> objectIds = objectInstanceProvider
      .getObjectsIdsAssignedToThreads(List.of(threadId))
      .getOrDefault(threadId, List.of());
    objectStateCleaner.deleteObjectInformationAfterTime(
      eventTime,
      objectIds,
      scenarioId
    );
    // Zmiany atrybutów obiektu usuwane po danym czasie za pomocą deleteObjectInformationAfterTime
    // Zmiany assocjacji obiektu usuwane po danym czasie za pomocą deleteObjectInformationAfterTime
    //ThreadToObject usuwane po danym czasie za pomocą deleteObjectInformationAfterTime
  }
}
