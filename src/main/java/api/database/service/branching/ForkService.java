package api.database.service.branching;

import api.database.entity.thread.Branching;
import api.database.model.constant.BranchingType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.BranchingData;
import api.database.model.data.OffspringData;
import api.database.model.data.OffspringObjectTransferData;
import api.database.model.domain.thread.InternalThreadBasicInfo;
import api.database.model.domain.transfer.InternalTransferPairs;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.create.ForkCreateRequest;
import api.database.model.request.composite.update.ForkUpdateRequest;
import api.database.repository.branching.BranchingRepository;
import api.database.service.core.*;
import api.database.service.core.provider.BranchingProvider;
import api.database.service.core.validator.BranchingValidator;
import jakarta.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Obsługuje operacje podziału (fork) wątków w scenariuszu.
/// Odpowiada za:
/// - Tworzenie nowych podziałów wątków z transferem obiektów
/// - Modyfikację istniejących podziałów (zmiana wątków potomnych i transferów)
/// - Usuwanie podziałów wraz z wątkami potomnymi
@Component
public class ForkService {

  private final EventManager eventManager;
  private final BranchingValidator branchingValidator;
  private final BranchingRepository branchingRepository;
  private final BranchingProvider branchingProvider;
  private final ObjectStateCleaner objectStateCleaner;
  private final OffspringAdder offspringAdder;
  private final ObjectInstanceTransfer objectInstanceTransfer;
  private final ThreadRemovalService threadRemovalService;
  private final IdleEventManager idleEventManager;

  @Autowired
  public ForkService(
    EventManager eventManager,
    BranchingValidator branchingValidator,
    BranchingRepository branchingRepository,
    BranchingProvider branchingProvider,
    ObjectStateCleaner objectStateCleaner,
    OffspringAdder offspringAdder,
    ObjectInstanceTransfer objectInstanceTransfer,
    ThreadRemovalService threadRemovalService,
    IdleEventManager idleEventManager
  ) {
    this.eventManager = eventManager;
    this.branchingValidator = branchingValidator;
    this.branchingRepository = branchingRepository;
    this.branchingProvider = branchingProvider;
    this.objectStateCleaner = objectStateCleaner;
    this.offspringAdder = offspringAdder;
    this.objectInstanceTransfer = objectInstanceTransfer;
    this.threadRemovalService = threadRemovalService;
    this.idleEventManager = idleEventManager;
  }

  /// Tworzy nowe wątki potomne podczas dodawania FORKa.
  /// Proces obejmuje:
  /// 1. Dostosowanie czasu ostatniego eventu wątku źródłowego
  /// 2. Utworzenie pierwszego wątku potomnego z przeniesieniem eventów
  /// 3. Utworzenie pozostałych wątków potomnych
  ///
  /// @param info dane operacji fork
  /// @param branchingId id utworzonego rozgałęzienia
  /// @param existingObjects lista obiektów do transferu
  /// @param scenarioId id scenariusza
  /// @return lista id utworzonych wątków potomnych
  private List<Integer> createThreadsOnAdd(
    ForkCreateRequest info,
    Integer branchingId,
    List<Integer> existingObjects,
    Integer scenarioId
  ) {
    // Pierwszy wątek
    List<Integer> offspringThreadIds = new ArrayList<>();
    offspringThreadIds.add(
      offspringAdder.addFirstOffspring(
        InternalThreadBasicInfo.from(info.offsprings().getFirst()),
        info.forkTime(),
        info.forkedThreadId(),
        branchingId,
        existingObjects,
        BranchingType.FORK,
        scenarioId
      )
    );

    // Pozostałe wątki
    offspringThreadIds.addAll(
      offspringAdder.createOffsprings(
        info.offsprings(),
        branchingId,
        info.forkTime(),
        scenarioId,
        true
      )
    );
    return offspringThreadIds;
  }

  /// Dodaje nowy podział wątku (FORK).
  /// Kolejno:
  /// 1. Weryfikuje możliwość podziału wątku
  /// 2. Tworzy wpis operacji fork
  /// 3. Dodaje odpowiednie eventy
  /// 4. Tworzy nowe wątki potomne
  /// 5. Wykonuje transfer obiektów między wątkami
  ///
  /// @param info dane operacji fork
  /// @param scenarioId id scenariusza
  @Transactional
  public void addFork(ForkCreateRequest info, Integer scenarioId) {
    // 1. Weryfikacja wątku
    branchingValidator.checkThreads(List.of(info.forkedThreadId()), scenarioId);
    // 3. Dodanie samego FORKa
    Integer branchingId = branchingRepository
      .save(Branching.createFork(info, scenarioId))
      .getId();
    // 2. Obsługa wątku wchodzącego
    Integer eventId = eventManager.changeLastEventInIncomingThreadForBranching(
      info.forkedThreadId(),
      info.forkTime(),
      branchingId,
      BranchingType.FORK
    );

    // 5. Weryfikacja
    List<Integer> existingObjects = branchingValidator.verifyTransfer(
      eventId,
      info.offsprings().stream().map(OffspringData::transfer).toList(),
      info.forkedThreadId(),
      scenarioId
    );
    // 6. Utworzenie wątków
    List<Integer> offspringThreadIds = createThreadsOnAdd(
      info,
      branchingId,
      existingObjects,
      scenarioId
    );
    // 7. Transfer obiektów
    List<OffspringObjectTransferData> allTransfers = getFullTransferList(
      info.offsprings(),
      offspringThreadIds
    );

    InternalTransferPairs pairs = objectInstanceTransfer.getPairs(
      // existingTransfers - pierwsza lista + puste dla reszty
      Stream.concat(
        Stream.of(existingObjects),
        Stream.generate(() -> new ArrayList<Integer>()).limit(
          info.offsprings().size() - 1
        )
      ).toList(),
      // newTransfers - z każdego transferu objectIds
      allTransfers
        .stream()
        .map(OffspringObjectTransferData::objectIds)
        .toList(),
      // threadIds - z każdego transferu id
      offspringThreadIds
    );

    objectInstanceTransfer.handleObjectTransfers(pairs, scenarioId);
    objectStateCleaner.deleteInvalidChanges(scenarioId);
  }

  //-----------------------Funkcje pomocnicze dla usuwania i zmian------------------------------------------------------
  private BranchingData getAndCheckFork(Integer forkId) {
    List<BranchingData> branchings = branchingProvider.getBranchingsByIds(
      List.of(forkId)
    );
    if (branchings.isEmpty()) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      List.of(forkId.toString()),
      ErrorGroup.BRANCHING,
      HttpStatus.NOT_FOUND
    );
    BranchingData branching = branchings.getFirst();

    if (branching.type() != BranchingType.FORK) throw new ApiException(
      ErrorCode.WRONG_BRANCHING_TYPE,
      ErrorGroup.BRANCHING,
      HttpStatus.CONFLICT
    );
    return branching;
  }

  //----------------------------------------Zmiana----------------------------------------------------------------------

  private BranchingData changeForkValidation(
    Integer forkId,
    ForkUpdateRequest forkChangeInfo,
    Integer scenarioId
  ) {
    // 1. Sprawdzenie i pobranie wątku
    BranchingData branching = getAndCheckFork(forkId);
    // 2. Weryfikacja transferu - nowego
    Integer lastEventId = eventManager.getLastEventForAssociations(
      branching.comingIn()[0]
    );

    branchingValidator.verifyTransfer(
      lastEventId,
      forkChangeInfo
        .offsprings()
        .stream()
        .map(OffspringData::transfer)
        .toList(),
      branching.comingIn()[0],
      scenarioId
    );

    return branching;
  }

  /// Usuwa nieużywane wątki po zmianie podziału.
  /// Weryfikuje czy usuwane wątki nie mają kolejnych rozgałęzień.
  ///
  /// @param branching id wątków w bazie
  /// @param request  id wątków po aktualizacji
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  private void deleteOldForkThreads(
    BranchingData branching,
    ForkUpdateRequest request,
    Integer scenarioId
  ) {
    //----------------------------Pobranie id wątków
    //-------------------------z bazy oraz przesłanych
    Set<Integer> databaseThreadIds = branching
      .objectTransfer()
      .stream()
      .map(OffspringObjectTransferData::id)
      .collect(Collectors.toSet());

    Set<Integer> updatedThreadIds = request
      .offsprings()
      .stream()
      .map(x -> x.transfer().id())
      .filter(Objects::nonNull)
      .collect(Collectors.toSet());

    Set<Integer> deletedThreads = new HashSet<>(databaseThreadIds);
    deletedThreads.removeAll(updatedThreadIds);
    //Usuwanie już niewystępujących wątków
    for (Integer threadId : deletedThreads) {
      threadRemovalService.removeThread(scenarioId, threadId);
    }
  }

  private static List<OffspringObjectTransferData> getFullTransferList(
    List<OffspringData> offsprings,
    List<Integer> newThreadIds
  ) {
    List<OffspringObjectTransferData> allTransfers = new ArrayList<>();
    int newThreadIndex = 0;

    for (OffspringData offspring : offsprings) {
      if (offspring.transfer().id() != null) {
        // Istniejący wątek
        allTransfers.add(offspring.transfer());
      } else {
        // Nowy wątek
        allTransfers.add(
          new OffspringObjectTransferData(
            newThreadIds.get(newThreadIndex++),
            offspring.transfer().objectIds()
          )
        );
      }
    }
    return allTransfers;
  }

  /// Modyfikuje istniejący podział wątku.
  /// Proces obejmuje:
  /// 1. Weryfikację możliwości modyfikacji
  /// 2. Aktualizację podstawowych danych FORKa
  /// 3. Usunięcie nieużywanych wątków potomnych
  /// 4. Utworzenie nowych wątków potomnych
  /// 5. Transfer obiektów do zaktualizowanych wątków
  ///
  /// @param forkId id modyfikowanego forka
  /// @param forkChangeInfo nowe dane forka
  /// @param scenarioId id scenariusza
  @Transactional
  public void changeFork(
    Integer forkId,
    ForkUpdateRequest forkChangeInfo,
    Integer scenarioId
  ) {
    BranchingData branching = changeForkValidation(
      forkId,
      forkChangeInfo,
      scenarioId
    );

    // 4. Usuwanie wątków
    deleteOldForkThreads(branching, forkChangeInfo, scenarioId);

    // 5. Tworzenie nowych wątków
    List<OffspringData> newThreads = forkChangeInfo
      .offsprings()
      .stream()
      .filter(offspring -> offspring.transfer().id() == null)
      .toList();

    List<Integer> newThreadIds = offspringAdder.createOffsprings(
      newThreads,
      branching.id(),
      branching.time(),
      scenarioId,
      false
    );

    // 6. Transfer
    //Pełna lista istniejących obiektów
    List<OffspringObjectTransferData> allTransfers = getFullTransferList(
      forkChangeInfo.offsprings(),
      newThreadIds
    );

    // Wykonujemy transfer dla wszystkich obiektów
    InternalTransferPairs pairs = createTransferPairs(branching, allTransfers);
    objectInstanceTransfer.handleObjectTransfers(pairs, scenarioId);
    objectStateCleaner.deleteInvalidChanges(scenarioId);

    // 7. Zmiana samych danych - tytułu i opisu
    branchingRepository.save(
      Branching.from(forkChangeInfo, branching, scenarioId)
    );
  }

  private InternalTransferPairs createTransferPairs(
    BranchingData branching,
    List<OffspringObjectTransferData> allTransfers
  ) {
    // Dla każdego nowego wątku:
    List<List<Integer>> existingObjects = allTransfers
      .stream()
      .map(transfer ->
        branching
          .objectTransfer()
          .stream()
          .filter(old -> old.id().equals(transfer.id()))
          .findFirst()
          .map(OffspringObjectTransferData::objectIds)
          .orElse(List.of())
      )
      .toList();

    return objectInstanceTransfer.getPairs(
      existingObjects,
      allTransfers
        .stream()
        .map(OffspringObjectTransferData::objectIds)
        .toList(),
      allTransfers.stream().map(OffspringObjectTransferData::id).toList()
    );
  }
}
