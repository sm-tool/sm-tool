package api.database.service.branching;

import api.database.model.constant.BranchingType;
import api.database.model.data.OffspringData;
import api.database.model.domain.thread.InternalBranchedThreadCreate;
import api.database.model.domain.thread.InternalThreadBasicInfo;
import api.database.model.request.composite.create.ThreadCreateRequest;
import api.database.service.core.EventManager;
import api.database.service.core.ObjectInstanceTransfer;
import api.database.service.core.ThreadAdder;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/// Serwis odpowiedzialny za tworzenie wątków potomnych podczas operacji FORK/JOIN.
/// Obsługuje:
/// - Tworzenie pierwszego wątku potomnego z przeniesieniem eventów
/// - Tworzenie pozostałych wątków potomnych
/// - Inicjalizację stanu obiektów w pierwszym wątku potomnym
@Component
public class OffspringAdder {

  private final ThreadAdder threadAdder;
  private final ObjectInstanceTransfer objectInstanceTransfer;
  private final EventManager eventManager;

  @Autowired
  public OffspringAdder(
    ThreadAdder threadAdder,
    ObjectInstanceTransfer objectInstanceTransfer,
    EventManager eventManager
  ) {
    this.threadAdder = threadAdder;
    this.objectInstanceTransfer = objectInstanceTransfer;
    this.eventManager = eventManager;
  }

  //----------------------------------------------------------------------------------------------------------------
  /// Tworzy pierwszy wątek potomny.
  /// Jest to specjalny przypadek, ponieważ:
  /// - Otrzymuje eventy przeniesione z wątku źródłowego
  /// - Dostaje kopię początkowego stanu obiektów
  /// - Nie ma automatycznie dodawanego eventu END
  ///
  /// @param basicInfo dane wątku potomnego
  /// @param branchingTime czas wykonania operacji FORK
  /// @param firstIncomingThreadId id wątku źródłowego
  /// @param branchingId id operacji FORK
  /// @param existingObjects lista obiektów do skopiowania
  /// @param scenarioId id scenariusza
  /// @return id utworzonego wątku potomnego
  public Integer addFirstOffspring(
    InternalThreadBasicInfo basicInfo,
    Integer branchingTime,
    Integer firstIncomingThreadId,
    Integer branchingId,
    List<Integer> existingObjects,
    BranchingType branchingType,
    Integer scenarioId
  ) {
    // Pierwszy - najważniejszy do niego przenoszone są wydarzenia
    Integer threadId = threadAdder.addBranchedThread(
      scenarioId,
      new InternalBranchedThreadCreate(
        new ThreadCreateRequest(
          basicInfo.title(),
          basicInfo.description(),
          branchingTime
        ),
        branchingId,
        branchingType
      ),
      false
    );
    eventManager.moveEventsBetweenThreads(
      new Integer[] { firstIncomingThreadId },
      new Integer[] { threadId },
      branchingTime
    );

    // Potrzebny jest "stan początkowy"
    objectInstanceTransfer.copyFirstOffspringObjects(existingObjects, threadId);
    return threadId;
  }

  /// Tworzy pozostałe wątki potomne dla operacji FORK.
  /// Każdy utworzony wątek:
  /// - Otrzymuje event FORK_OUT
  /// - Ma dodawany event END
  /// - Nie dziedziczy eventów ani obiektów
  ///
  /// @param offsprings lista danych wątków potomnych
  /// @param branchingId id operacji FORK
  /// @param forkTime czas wykonania operacji FORK
  /// @param scenarioId id scenariusza
  /// @param skipFirst czy pominąć pierwszy wątek z listy offsprings
  /// @return lista id utworzonych wątków
  public List<Integer> createOffsprings(
    List<OffspringData> offsprings,
    Integer branchingId,
    Integer forkTime,
    Integer scenarioId,
    Boolean skipFirst
  ) {
    List<Integer> offspringThreadIds = new ArrayList<>();
    for (int i = skipFirst ? 1 : 0; i < offsprings.size(); i++) {
      offspringThreadIds.add(
        threadAdder.addBranchedThread(
          scenarioId,
          new InternalBranchedThreadCreate(
            new ThreadCreateRequest(
              offsprings.get(i).title(),
              offsprings.get(i).description(),
              forkTime
            ),
            branchingId,
            BranchingType.FORK
          ),
          true
        )
      );
    }
    return offspringThreadIds;
  }
}
