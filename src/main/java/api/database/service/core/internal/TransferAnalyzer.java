package api.database.service.core.internal;

import api.database.model.constant.BranchingType;
import api.database.model.domain.transfer.InternalAddAnalysisResult;
import api.database.model.domain.transfer.InternalBranchingTransfer;
import api.database.model.domain.transfer.InternalRemoveAnalysisResult;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

/// Analizator transferów obiektów między wątkami w kontekście rozgałęzień (FORK/JOIN).
/// Odpowiada za:
/// - Analizę ścieżek transferu obiektów przez rozgałęzienia
/// - Identyfikację konfliktów przy dodawaniu obiektów
/// - Określanie wątków wymagających czyszczenia przy usuwaniu obiektów
/// - Mapowanie danych rozgałęzień z bazy na wymagane struktury wewnętrzne
///
/// # Główne operacje
/// - Analiza dodawania obiektu - sprawdza potencjalne konflikty i oznacza niepoprawne FORKi
/// - Analiza usuwania obiektu - określa wątki wymagające wyczyszczenia stanu obiektu
///
/// # Kluczowe aspekty
/// - Operuje na posortowanych chronologicznie rozgałęzieniach
/// - Śledzi ścieżki transferu obiektów przez łańcuchy FORK/JOIN
/// - Identyfikuje konflikty przy łączeniu wątków (JOIN)
/// - Oznacza FORKi wymagające ponownego transferu
@Component
public class TransferAnalyzer {

  /// Analizuje dodanie obiektu do wątku, śledząc jego potencjalną ścieżkę przez rozgałęzienia.
  /// Identyfikuje:
  /// - FORKi wymagające poprawy transferu
  /// - Wątki z potencjalnymi konfliktami przy JOIN
  /// - Wątki, przez które obiekt może być bezpiecznie transferowany
  ///
  /// @param threadId id wątku otrzymującego obiekt
  /// @param objectId id dodawanego obiektu
  /// @param sortedBranchings posortowana lista rozgałęzień
  /// @return wynik analizy zawierający zidentyfikowane FORKi i wątki
  public InternalAddAnalysisResult analyzeAddedObject(
    Integer threadId,
    Integer objectId,
    List<InternalBranchingTransfer> sortedBranchings
  ) {
    Set<Integer> forksToMark = new HashSet<>();
    Set<Integer> threadsWithConflicts = new HashSet<>();
    Set<Integer> validThreads = new HashSet<>();

    analyzeAddedObjectPath(
      threadId,
      objectId,
      forksToMark,
      threadsWithConflicts,
      validThreads,
      sortedBranchings
    );
    return new InternalAddAnalysisResult(
      forksToMark,
      threadsWithConflicts,
      validThreads
    );
  }

  private void analyzeAddedObjectPath(
    Integer currentThreadId,
    Integer objectId,
    Set<Integer> forksToMark,
    Set<Integer> threadsWithConflicts,
    Set<Integer> validThreads,
    List<InternalBranchingTransfer> sortedBranchings
  ) {
    // Dodajemy aktualny wątek do valid
    validThreads.add(currentThreadId);
    // Szukamy następnego branchingu dla tego wątku
    InternalBranchingTransfer nextBranching = findNextBranchingForThread(
      currentThreadId,
      sortedBranchings
    );

    if (nextBranching == null) {
      // END - koniec ścieżki
      return;
    }

    if (nextBranching.type() == BranchingType.FORK) {
      // FORK - oznaczamy i kończymy
      forksToMark.add(nextBranching.id());
      return;
    }

    // JOIN - sprawdzamy czy obiekt był w wątku wyjściowym
    Integer outThread = findOutThreadForJoin(nextBranching);
    if (nextBranching.outThreadObjects().get(outThread).contains(objectId)) {
      // Konflikt - obiekt już tam był
      threadsWithConflicts.add(outThread);
      return;
    }

    // Nie było konfliktu - idziemy dalej
    analyzeAddedObjectPath(
      outThread,
      objectId,
      forksToMark,
      threadsWithConflicts,
      validThreads,
      sortedBranchings
    );
  }

  private Integer findOutThreadForJoin(InternalBranchingTransfer join) {
    return join.outThreadObjects().keySet().iterator().next();
  }

  /// Analizuje usunięcie obiektu z wątku, określając wymagane czyszczenia.
  /// Wykorzystuje wyniki analizy dodawania do określenia zakresu czyszczenia.
  ///
  /// @param threadId id wątku z usuwanym obiektem
  /// @param objectId id usuwanego obiektu
  /// @param sortedBranchings posortowana lista rozgałęzień
  /// @param addAnalysis wyniki wcześniejszej analizy dodawania
  /// @return wynik analizy ze zbiorem wątków do wyczyszczenia
  public InternalRemoveAnalysisResult analyzeRemovedObject(
    Integer threadId,
    Integer objectId,
    List<InternalBranchingTransfer> sortedBranchings,
    InternalAddAnalysisResult addAnalysis
  ) {
    Set<Integer> threadsToClean = new HashSet<>();

    analyzeRemovedObjectPath(
      threadId,
      objectId,
      threadsToClean,
      sortedBranchings,
      addAnalysis
    );
    return new InternalRemoveAnalysisResult(threadsToClean);
  }

  private void analyzeRemovedObjectPath(
    Integer currentThreadId,
    Integer objectId,
    Set<Integer> threadsToClean,
    List<InternalBranchingTransfer> sortedBranchings,
    InternalAddAnalysisResult addAnalysis
  ) {
    InternalBranchingTransfer nextBranching = findNextBranchingForThread(
      currentThreadId,
      sortedBranchings
    );

    if (nextBranching == null) {
      // 1. END - dodaj wątek do czyszczenia
      threadsToClean.add(currentThreadId);
      return;
    }

    if (nextBranching.type() == BranchingType.FORK) {
      // 2. FORK - dodaj obecny, znajdź następny i rekurencja
      threadsToClean.add(currentThreadId);
      Integer nextThread = findThreadWithObjectOnFork(nextBranching, objectId);
      if (nextThread != null) {
        analyzeRemovedObjectPath(
          nextThread,
          objectId,
          threadsToClean,
          sortedBranchings,
          addAnalysis
        );
      }
      return;
    }

    // JOIN cases
    Integer outThread = findOutThreadForJoin(nextBranching);
    if (!addAnalysis.threadsWithConflicts().contains(outThread)) {
      // 3. JOIN - nie było w analizie, dodaj obecny i kontynuuj
      threadsToClean.add(currentThreadId);
      analyzeRemovedObjectPath(
        outThread,
        objectId,
        threadsToClean,
        sortedBranchings,
        addAnalysis
      );
    } else {
      // 4. JOIN - był w analizie, dodaj tylko obecny i stop
      threadsToClean.add(currentThreadId);
    }
  }

  private Integer findThreadWithObjectOnFork(
    InternalBranchingTransfer fork,
    Integer objectId
  ) {
    return fork
      .outThreadObjects()
      .entrySet()
      .stream()
      .filter(e -> e.getValue().contains(objectId))
      .map(Map.Entry::getKey)
      .findFirst()
      .orElse(null);
  }

  private InternalBranchingTransfer findNextBranchingForThread(
    Integer threadId,
    List<InternalBranchingTransfer> sortedBranchings
  ) {
    return sortedBranchings
      .stream()
      .filter(b -> b.inThreadObjects().containsKey(threadId))
      .findFirst()
      .orElse(null);
  }
}
