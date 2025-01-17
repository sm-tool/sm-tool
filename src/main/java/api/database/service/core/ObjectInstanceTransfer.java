package api.database.service.core;

import api.database.model.domain.transfer.InternalAddAnalysisResult;
import api.database.model.domain.transfer.InternalBranchingTransfer;
import api.database.model.domain.transfer.InternalObjectThreadPair;
import api.database.model.domain.transfer.InternalRemoveAnalysisResult;
import api.database.model.domain.transfer.InternalTransferPairs;
import api.database.repository.special.ObjectInstanceTransferRepository;
import api.database.service.core.internal.TransferAnalyzer;
import api.database.service.core.provider.BranchingProvider;
import java.util.*;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

/// Zarządza transferem instancji obiektów między wątkami w kontekście rozgałęzień.
/// Odpowiada za analizę i wykonanie transferów obiektów, uwzględniając:
/// - Wykrywanie zmian w przypisaniach obiektów do wątków
/// - Propagację obiektów przez łańcuchy rozgałęzień FORK/JOIN
/// - Oznaczanie niepoprawnych operacji FORK wymagających ponownego transferu
/// - Czyszczenie nieaktualnych powiązań obiektów z wątkami
///
/// # Główne operacje
/// - Analiza różnic w transferach obiektów
/// - Obsługa transferów z uwzględnieniem rozgałęzień
/// - Kopiowanie obiektów do nowych wątków potomnych
/// - Oznaczanie FORK jako niepoprawnych
@Component
public class ObjectInstanceTransfer {

  private final ObjectInstanceTransferRepository objectInstanceTransferRepository;
  private final ObjectStateCleaner objectStateCleaner;
  private final TransferAnalyzer transferAnalyzer;
  private final BranchingProvider branchingProvider;

  public ObjectInstanceTransfer(
    ObjectInstanceTransferRepository objectInstanceTransferRepository,
    ObjectStateCleaner objectStateCleaner,
    TransferAnalyzer transferAnalyzer,
    BranchingProvider branchingProvider
  ) {
    this.objectInstanceTransferRepository = objectInstanceTransferRepository;
    this.objectStateCleaner = objectStateCleaner;
    this.transferAnalyzer = transferAnalyzer;
    this.branchingProvider = branchingProvider;
  }

  /// Identyfikuje różnice między istniejącymi a nowymi transferami obiektów.
  /// Tworzy pary obiekt-wątek do dodania i usunięcia na podstawie porównania list.
  ///
  /// @param existingTransfers lista aktualnych transferów per wątek
  /// @param newTransfers lista nowych transferów per wątek
  /// @param threadIds lista identyfikatorów wątków
  /// @return struktura zawierająca pary do dodania i usunięcia
  public InternalTransferPairs getPairs(
    List<List<Integer>> existingTransfers,
    List<List<Integer>> newTransfers,
    List<Integer> threadIds
  ) {
    Set<InternalObjectThreadPair> toAdd = new HashSet<>();
    Set<InternalObjectThreadPair> toRemove = new HashSet<>();

    for (int i = 0; i < existingTransfers.size(); i++) {
      List<Integer> existingObjects = existingTransfers.get(i);
      List<Integer> newObjects = newTransfers.get(i);
      Integer threadId = threadIds.get(i);

      for (Integer objectId : newObjects) {
        if (!existingObjects.contains(objectId)) {
          toAdd.add(new InternalObjectThreadPair(objectId, threadId));
        }
      }

      for (Integer objectId : existingObjects) {
        if (!newObjects.contains(objectId)) {
          toRemove.add(new InternalObjectThreadPair(objectId, threadId));
        }
      }
    }
    return new InternalTransferPairs(toAdd, toRemove);
  }

  /// Obsługuje transfery obiektów z uwzględnieniem analizy rozgałęzień.
  /// Proces obejmuje:
  /// 1. Pobranie i analizę struktury rozgałęzień
  /// 2. Analizę dodawania obiektów i potencjalnych konfliktów
  /// 3. Analizę usuwania obiektów i wymaganych czyszczeń
  /// 4. Wykonanie operacji w bazie danych:
  ///    - Oznaczenie niepoprawnych FORKów
  ///    - Usunięcie starych powiązań
  ///    - Utworzenie nowych transferów
  ///
  /// @param pairs pary obiekt-wątek do przetworzenia
  /// @param scenarioId identyfikator scenariusza
  public void handleObjectTransfers(
    InternalTransferPairs pairs,
    Integer scenarioId
  ) {
    // 1. Pobierz wszystkie branching pointy i zbuduj strukturę
    List<InternalBranchingTransfer> sortedBranchings =
      branchingProvider.getBranchingTransferForScenario(scenarioId);

    // 2. Analiza dodawania dla każdej pary DO DODANIA
    Map<Integer, InternalAddAnalysisResult> addAnalyses = new HashMap<>();
    for (InternalObjectThreadPair pair : pairs.toAdd()) {
      InternalAddAnalysisResult analysis = transferAnalyzer.analyzeAddedObject(
        pair.threadId(),
        pair.objectId(),
        sortedBranchings
      );
      addAnalyses.put(pair.objectId(), analysis);
    }
    // 3. Analiza usuwania dla każdej pary DO USUNIĘCIA
    Map<Integer, InternalRemoveAnalysisResult> removeAnalyses = new HashMap<>();
    for (InternalObjectThreadPair pair : pairs.toRemove()) {
      InternalRemoveAnalysisResult analysis =
        transferAnalyzer.analyzeRemovedObject(
          pair.threadId(),
          pair.objectId(),
          sortedBranchings,
          addAnalyses.get(pair.objectId())
        );
      removeAnalyses.put(pair.objectId(), analysis);
    }
    System.out.println(pairs);
    System.out.println(removeAnalyses);
    System.out.println(addAnalyses);
    // 4. Wykonaj faktyczne operacje w bazie:
    // a) Oznacz niepoprawne forki
    objectInstanceTransferRepository.markForksAsIncorrect(
      addAnalyses
        .values()
        .stream()
        .flatMap(a -> a.forksToMark().stream())
        .toArray(Integer[]::new)
    );

    // b) Usuń powiązania z wątków
    objectStateCleaner.deleteObjectConnections(removeAnalyses);

    // c) Zrób nowe transfery - wykorzystując validThreads z analizy
    Map<Integer, List<Integer>> threadToObjects = new HashMap<>();
    for (Map.Entry<
      Integer,
      InternalAddAnalysisResult
    > entry : addAnalyses.entrySet()) {
      Integer objectId = entry.getKey();
      for (Integer threadId : entry.getValue().validThreads()) {
        threadToObjects
          .computeIfAbsent(threadId, k -> new ArrayList<>())
          .add(objectId);
      }
    }

    objectInstanceTransferRepository.transferObjectsToThreads(
      // Wątki - każdy powtórzony tyle razy ile ma obiektów
      threadToObjects
        .entrySet()
        .stream()
        .flatMap(e ->
          Collections.nCopies(
            e.getValue().size(), // tyle razy ile obiektów dla wątku
            e.getKey() // thread_id
          ).stream()
        )
        .toArray(Integer[]::new),
      // Obiekty - wszystkie po kolei
      threadToObjects
        .values()
        .stream()
        .flatMap(List::stream)
        .toArray(Integer[]::new)
    );
  }

  /// Kopiuje obiekty z istniejącego wątku do pierwszego wątku potomnego.
  /// Używane przy inicjalizacji pierwszego nowego wątku powstałego z rozgałęzienia.
  ///
  /// @param existingObjects lista obiektów do skopiowania
  /// @param firstThread identyfikator pierwszego wątku potomnego
  public void copyFirstOffspringObjects(
    List<Integer> existingObjects,
    Integer firstThread
  ) {
    objectInstanceTransferRepository.transferObjectsToThreads(
      Stream.generate(() -> firstThread)
        .limit(existingObjects.size())
        .toArray(Integer[]::new),
      existingObjects.toArray(new Integer[0])
    );
  }

  public void markForkAsIncorrect(Integer forkId) {
    objectInstanceTransferRepository.markForksAsIncorrect(
      new Integer[] { forkId }
    );
  }
}
