package api.database.service.branching;

import api.database.entity.event.Event;
import api.database.entity.thread.Branching;
import api.database.model.constant.BranchingType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.BranchingData;
import api.database.model.domain.thread.InternalThreadBasicInfo;
import api.database.model.domain.transfer.InternalTransferPairs;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.create.JoinCreateRequest;
import api.database.model.request.composite.update.JoinUpdateRequest;
import api.database.repository.branching.BranchingRepository;
import api.database.service.core.EventManager;
import api.database.service.core.IdleEventManager;
import api.database.service.core.ObjectInstanceTransfer;
import api.database.service.core.provider.BranchingProvider;
import api.database.service.core.provider.ObjectInstanceProvider;
import api.database.service.core.validator.BranchingValidator;
import jakarta.transaction.Transactional;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Serwis odpowiedzialny za zarządzanie operacjami JOIN (łączenia wątków) w systemie.
/// Obsługuje tworzenie i modyfikację operacji łączenia wątków wraz z transferem
/// obiektów między nimi.
///
/// # Główne funkcjonalności
/// - Tworzenie nowych operacji JOIN
/// - Modyfikacja istniejących operacji JOIN
/// - Zarządzanie transferem obiektów między wątkami
/// - Walidacja poprawności operacji
///
/// # Proces łączenia wątków
/// 1. Walidacja wątków źródłowych
/// 2. Utworzenie wpisu operacji JOIN
/// 3. Utworzenie wątku wynikowego
/// 4. Konfiguracja wątków źródłowych (zmiana eventów końcowych)
/// 5. Transfer obiektów do wątku wynikowego
///
/// # Ważne zasady
/// - Wątek globalny nie może uczestniczyć w operacji JOIN
/// - Wszystkie obiekty z wątków źródłowych są przenoszone do wątku wynikowego
/// - Wydarzenia są przenoszone tylko z pierwszego wątku źródłowego
///
/// # Powiązania
/// - {@link Branching} - encja reprezentująca operację JOIN
/// - {@link Event} - wydarzenia w wątkach
/// - {@link Thread} - wątki uczestniczące w operacji
@Component
public class JoinService {

  private final BranchingRepository branchingRepository;
  private final BranchingValidator branchingValidator;
  private final EventManager eventManager;
  private final ObjectInstanceProvider objectInstanceProvider;
  private final ObjectInstanceTransfer objectInstanceTransfer;
  private final OffspringAdder offspringAdder;
  private final BranchingProvider branchingProvider;
  private final IdleEventManager idleEventManager;

  @Autowired
  public JoinService(
    BranchingRepository branchingRepository,
    BranchingValidator branchingValidator,
    EventManager eventManager,
    ObjectInstanceProvider objectInstanceProvider,
    ObjectInstanceTransfer objectInstanceTransfer,
    OffspringAdder offspringAdder,
    BranchingProvider branchingProvider,
    IdleEventManager idleEventManager
  ) {
    this.branchingRepository = branchingRepository;
    this.branchingValidator = branchingValidator;
    this.eventManager = eventManager;
    this.objectInstanceProvider = objectInstanceProvider;
    this.objectInstanceTransfer = objectInstanceTransfer;
    this.offspringAdder = offspringAdder;
    this.branchingProvider = branchingProvider;
    this.idleEventManager = idleEventManager;
  }

  //--------------------------------------------------Dodawanie rozgałęzień---------------------------------------------------------

  /// Tworzy nową operację łączenia wątków (JOIN).
  /// Proces obejmuje:
  /// 1. Walidację wątków źródłowych
  /// 2. Utworzenie operacji JOIN
  /// 3. Utworzenie wątku wynikowego
  /// 4. Konfigurację wątków źródłowych
  /// 5. Transfer obiektów
  ///
  /// @param scenarioId id scenariusza
  /// @param info dane konfiguracyjne operacji JOIN
  /// @throws ApiException gdy:
  ///   - Próba łączenia wątku globalnego
  ///   - Niepoprawne ID wątków
  ///   - Konflikt czasowy z istniejącymi eventami
  @Transactional
  public void addJoin(Integer scenarioId, JoinCreateRequest info) {
    branchingValidator.checkThreads(info.threadIdsToJoin(), scenarioId);

    Integer joinId = createJoinBranching(scenarioId, info);
    Integer firstThreadId = info.threadIdsToJoin().getFirst();

    eventManager.changeLastEventInIncomingThreadForBranching(
      firstThreadId,
      info.joinTime(),
      joinId,
      BranchingType.JOIN
    );

    Map<Integer, List<Integer>> objectsAssignedToThreads =
      objectInstanceProvider.getObjectsIdsAssignedToThreads(
        info.threadIdsToJoin()
      );

    Integer outputThreadId = createOutputThread(
      joinId,
      info,
      firstThreadId,
      objectsAssignedToThreads.getOrDefault(firstThreadId, List.of()),
      scenarioId
    );

    setupRemainingThreads(
      info.threadIdsToJoin(),
      info.joinTime(),
      joinId,
      true
    );

    transferObjects(
      objectsAssignedToThreads,
      outputThreadId,
      firstThreadId,
      scenarioId
    );
  }

  private Integer createJoinBranching(
    Integer scenarioId,
    JoinCreateRequest info
  ) {
    return branchingRepository
      .save(Branching.createJoin(info, scenarioId))
      .getId();
  }

  private Integer createOutputThread(
    Integer joinId,
    JoinCreateRequest info,
    Integer sourceThreadId,
    List<Integer> objectsToTransfer,
    Integer scenarioId
  ) {
    return offspringAdder.addFirstOffspring(
      InternalThreadBasicInfo.from(info),
      info.joinTime(),
      sourceThreadId,
      joinId,
      objectsToTransfer,
      BranchingType.JOIN,
      scenarioId
    );
  }

  private void transferObjects(
    Map<Integer, List<Integer>> objectsAssignedToThreads,
    Integer outputThreadId,
    Integer firstThreadId,
    Integer scenarioId
  ) {
    List<Integer> existingObjects = objectsAssignedToThreads.getOrDefault(
      firstThreadId,
      List.of()
    );

    // Zbieramy wszystkie obiekty ze wszystkich wątków
    List<Integer> allObjects = objectsAssignedToThreads
      .values()
      .stream()
      .flatMap(List::stream)
      .distinct()
      .toList();

    InternalTransferPairs pairs = objectInstanceTransfer.getPairs(
      List.of(existingObjects), // obiekty już przeniesione z pierwszego wątku
      List.of(allObjects), // docelowy stan - obiekty ze wszystkich wątków
      List.of(outputThreadId) // wątek wyjściowy
    );

    objectInstanceTransfer.handleObjectTransfers(pairs, scenarioId);
  }

  //-----------------------------------------------Zmiana JOIN----------------------------------------------------------

  /// Modyfikuje istniejącą operację JOIN.
  /// Umożliwia zmianę:
  /// - Listy łączonych wątków
  /// - Tytułu i opisu operacji
  ///
  /// Proces modyfikacji:
  /// 1. Walidacja danych wejściowych
  /// 2. Aktualizacja konfiguracji JOIN
  /// 3. Przywrócenie eventów END w odłączanych wątkach
  /// 4. Konfiguracja nowo dołączanych wątków
  /// 5. Aktualizacja transferów obiektów
  ///
  /// @param joinId id modyfikowanej operacji JOIN
  /// @param info nowa konfiguracja operacji
  /// @param scenarioId id scenariusza
  /// @throws ApiException gdy:
  ///   - JOIN nie istnieje
  ///   - Niepoprawny typ operacji
  ///   - Błąd walidacji wątków
  @Transactional
  public void changeJoin(
    Integer joinId,
    JoinUpdateRequest info,
    Integer scenarioId
  ) {
    BranchingData join = getAndCheckJoin(joinId);
    branchingValidator.checkThreads(info.threadIdsToJoin(), scenarioId);
    // Aktualizujemy JOIN
    branchingRepository.save(Branching.from(info, join, scenarioId));
    // Przywracamy END na odłączanych wątkach
    Integer[] disconnectedThreads = Arrays.stream(join.comingIn())
      .filter(threadId -> !info.threadIdsToJoin().contains(threadId))
      .toArray(Integer[]::new);
    System.out.println(
      "Disconnected threads: " + Arrays.toString(disconnectedThreads)
    );
    eventManager.ensureEndEvents(disconnectedThreads);
    System.out.println("ddd");
    idleEventManager.cleanupIdleEvents(scenarioId);

    List<Integer> newThreads = info
      .threadIdsToJoin()
      .stream()
      .filter(threadId -> !Arrays.asList(join.comingIn()).contains(threadId))
      .toList();

    setupRemainingThreads(newThreads, join.time(), joinId, false);

    Map<Integer, List<Integer>> objectsPerThread =
      objectInstanceProvider.getObjectsIdsAssignedToThreads(
        Stream.concat(
          Arrays.stream(join.comingIn()),
          info.threadIdsToJoin().stream()
        )
          .collect(Collectors.toSet())
          .stream()
          .toList()
      );

    // existingTransfers
    List<Integer> objectsFromComingIn = Arrays.stream(join.comingIn())
      .flatMap(threadId ->
        objectsPerThread
          .getOrDefault(threadId, Collections.emptyList())
          .stream()
      )
      .toList();

    // newTransfers
    List<Integer> objectsToTransfer = info
      .threadIdsToJoin()
      .stream()
      .flatMap(threadId ->
        objectsPerThread
          .getOrDefault(threadId, Collections.emptyList())
          .stream()
      )
      .toList();

    InternalTransferPairs pairs = objectInstanceTransfer.getPairs(
      List.of(objectsFromComingIn),
      List.of(objectsToTransfer),
      List.of(join.comingOut()[0])
    );

    objectInstanceTransfer.handleObjectTransfers(pairs, scenarioId);
  }

  private BranchingData getAndCheckJoin(Integer joinId) {
    List<BranchingData> branchings = branchingProvider.getBranchingsByIds(
      List.of(joinId)
    );
    if (branchings.isEmpty()) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      List.of(joinId.toString()),
      ErrorGroup.BRANCHING,
      HttpStatus.NOT_FOUND
    );
    BranchingData branching = branchings.getFirst();

    if (branching.type() != BranchingType.JOIN) throw new ApiException(
      ErrorCode.WRONG_BRANCHING_TYPE,
      ErrorGroup.BRANCHING,
      HttpStatus.CONFLICT
    );
    return branching;
  }

  //------------------------------------------------Funkcje pomocnicze--------------------------------------------------

  private void setupRemainingThreads(
    List<Integer> threadIdsToJoin,
    Integer joinTime,
    Integer joinId,
    boolean skipFirst
  ) {
    threadIdsToJoin
      .stream()
      .skip(skipFirst ? 1 : 0) // pomijamy pierwszy wątek dla dodawania nowego JOIN
      .forEach(threadId ->
        eventManager.changeLastEventForJoin(threadId, joinTime, joinId)
      );
  }
}
