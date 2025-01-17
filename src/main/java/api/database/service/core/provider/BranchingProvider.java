package api.database.service.core.provider;

import static java.util.Comparator.comparing;

import api.database.model.constant.BranchingType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.BranchingData;
import api.database.model.data.OffspringObjectTransferData;
import api.database.model.domain.thread.InternalBranchingRow;
import api.database.model.domain.transfer.InternalBranchingTransfer;
import api.database.model.exception.ApiException;
import api.database.repository.branching.BranchingRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/// Serwis dostarczający informacje o rozgałęzieniach (FORK/JOIN) w scenariuszu.
/// Obsługuje:
/// - Pobieranie danych rozgałęzień na podstawie ich identyfikatorów
/// - Pobieranie wszystkich rozgałęzień dla scenariusza
/// - Mapowanie danych z bazy na struktury rozgałęzień i transferów
@Service
public class BranchingProvider {

  private final BranchingRepository branchingRepository;

  @Autowired
  public BranchingProvider(BranchingRepository branchingRepository) {
    this.branchingRepository = branchingRepository;
  }

  /// Pobiera rozgałęzienia o podanych identyfikatorach.
  ///
  /// @param ids lista identyfikatorów rozgałęzień
  /// @return lista zmapowanych odpowiedzi z danymi rozgałęzień
  public List<BranchingData> getBranchingsByIds(List<Integer> ids) {
    List<InternalBranchingRow> branchings =
      branchingRepository.getBranchingsByIds(ids.toArray(new Integer[0]));
    return formatBranchings(branchings, createResponseMapper());
  }

  /// Pobiera wszystkie rozgałęzienia dla scenariusza.
  ///
  /// @param scenarioId id scenariusza
  /// @return lista zmapowanych odpowiedzi z danymi rozgałęzień
  public List<BranchingData> getBranchingsForScenario(Integer scenarioId) {
    List<Integer> branchingIds = branchingRepository.getBranchingIdsForScenario(
      scenarioId
    );
    return getBranchingsByIds(branchingIds);
  }

  /// Pobiera jedno rozgałęzienie.
  ///
  /// @param branchingId id rozgałęzienia
  /// @return lista zmapowanych odpowiedzi z danymi rozgałęzień
  public BranchingData getOneBranching(Integer branchingId) {
    List<BranchingData> branchings = getBranchingsByIds(List.of(branchingId));
    if (branchings.isEmpty()) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.BRANCHING,
      HttpStatus.NOT_FOUND
    );
    return branchings.getFirst();
  }

  /// Pobiera informacje o transferach obiektów dla wszystkich rozgałęzień w scenariuszu.
  /// Zwraca posortowaną po czasie listę transferów.
  ///
  /// @param scenarioId id scenariusza
  /// @return lista transferów posortowana chronologicznie
  public List<InternalBranchingTransfer> getBranchingTransferForScenario(
    Integer scenarioId
  ) {
    List<Integer> branchingIds = branchingRepository.getBranchingIdsForScenario(
      scenarioId
    );
    List<InternalBranchingRow> branchings =
      branchingRepository.getBranchingsByIds(
        branchingIds.toArray(new Integer[0])
      );
    return formatBranchings(branchings, createTransferMapper())
      .stream()
      .sorted(comparing(InternalBranchingTransfer::time))
      .toList();
  }

  ///  Pobiera id pierwszego FORK po danym wątku
  /// @return id lub null w przypadku braku
  public Integer getFirstForkId(Integer threadId) {
    return branchingRepository.getFirstForkId(threadId);
  }

  //-----------------------------------Mapowanie surowych danych na struktury wewnętrzne--------------------------------

  /// Mapper wykorzystywany do generowania różnych formatów odpowiedzi z tych samych danych wejściowych.
  /// Pozwala na elastyczne mapowanie danych rozgałęzień na struktury BranchingData lub InternalBranchingTransfer.
  @FunctionalInterface
  private interface BranchingMapper<T> {
    T map(List<InternalBranchingRow> rows);
  }

  /// Formatuje surowe dane z bazy na wybraną strukturę wyjściową.
  /// Grupuje wiersze po id rozgałęzienia i aplikuje wybrany mapper.
  ///
  /// @param branchings surowe dane z bazy
  /// @param mapper funkcja mapująca dane na wybraną strukturę
  /// @return lista zmapowanych obiektów
  private <T> List<T> formatBranchings(
    List<InternalBranchingRow> branchings,
    BranchingMapper<T> mapper
  ) {
    return branchings
      .stream()
      .collect(Collectors.groupingBy(InternalBranchingRow::getId))
      .values()
      .stream()
      .map(mapper::map)
      .toList();
  }

  /// Struktura pomocnicza przechowująca podział wątków na wejściowe (IN) i wyjściowe (OUT).
  private record ThreadSplit(
    List<InternalBranchingRow> inThreads,
    List<InternalBranchingRow> outThreads
  ) {}

  /// Dzieli listę wątków na podstawie typu eventu (IN/OUT).
  ///
  /// @param rows lista wierszy z danymi wątków
  /// @return struktura zawierająca podział na wątki IN i OUT
  private ThreadSplit splitThreadsByType(List<InternalBranchingRow> rows) {
    List<InternalBranchingRow> inThreads = rows
      .stream()
      .filter(r -> r.getEventType().toString().endsWith("_IN"))
      .toList();

    List<InternalBranchingRow> outThreads = rows
      .stream()
      .filter(r -> r.getEventType().toString().endsWith("_OUT"))
      .toList();

    return new ThreadSplit(inThreads, outThreads);
  }

  /// Tworzy mapper generujący strukturę InternalBranchingTransfer.
  /// Zawiera informacje o transferach obiektów między wątkami.
  private BranchingMapper<InternalBranchingTransfer> createTransferMapper() {
    return rows -> {
      InternalBranchingRow first = rows.getFirst();
      ThreadSplit split = splitThreadsByType(rows);

      Map<Integer, List<Integer>> inObjects = split
        .inThreads()
        .stream()
        .collect(
          Collectors.toMap(InternalBranchingRow::getThreadId, r ->
            Arrays.asList(r.getThreadObjects())
          )
        );

      Map<Integer, List<Integer>> outObjects = split
        .outThreads()
        .stream()
        .collect(
          Collectors.toMap(InternalBranchingRow::getThreadId, r ->
            Arrays.asList(r.getThreadObjects())
          )
        );

      return new InternalBranchingTransfer(
        first.getId(),
        first.getBranchingType(),
        first.getBranchingTime(),
        first.getIsCorrect(),
        inObjects,
        outObjects
      );
    };
  }

  /// Tworzy mapper generujący strukturę BranchingData.
  /// Zawiera pełne informacje o rozgałęzieniu włącznie z transferami obiektów dla FORK.
  private BranchingMapper<BranchingData> createResponseMapper() {
    return rows -> {
      InternalBranchingRow first = rows.getFirst();
      ThreadSplit split = splitThreadsByType(rows);

      List<Integer> comingIn = split
        .inThreads()
        .stream()
        .map(InternalBranchingRow::getThreadId)
        .sorted()
        .toList();

      List<Integer> comingOut = split
        .outThreads()
        .stream()
        .map(InternalBranchingRow::getThreadId)
        .sorted()
        .toList();

      List<OffspringObjectTransferData> objectTransfer =
        first.getBranchingType() == BranchingType.FORK
          ? split
            .outThreads()
            .stream()
            .map(r ->
              new OffspringObjectTransferData(
                r.getThreadId(),
                Arrays.stream(r.getThreadObjects()).toList()
              )
            )
            .toList()
          : null;

      return new BranchingData(
        first.getId(),
        first.getBranchingType(),
        first.getIsCorrect(),
        first.getTitle(),
        first.getDescription(),
        first.getBranchingTime(),
        comingIn.toArray(Integer[]::new),
        comingOut.toArray(Integer[]::new),
        objectTransfer
      );
    };
  }
}
