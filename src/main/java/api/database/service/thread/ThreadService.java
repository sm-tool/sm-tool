package api.database.service.thread;

import api.database.entity.thread.Thread;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.composite.create.ThreadCreateRequest;
import api.database.model.request.update.ThreadUpdateRequest;
import api.database.model.response.ThreadResponse;
import api.database.repository.thread.ThreadRepository;
import api.database.service.core.ThreadAdder;
import api.database.service.core.provider.GlobalThreadProvider;
import api.database.service.operations.ScenarioValidator;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/// Zarządza podstawowymi operacjami na wątkach scenariusza:
/// - Pobieranie wątków z ich obiektami
/// - Tworzenie nowych wątków z bazowymi eventami
/// - Modyfikacja istniejących wątków
///
/// # Powiązania
/// - {@link Thread} - encja reprezentująca wątek
/// - {@link ThreadResponse} - odpowiedź zawierająca dane wątku
/// - {@link ThreadCreateRequest} - dane do utworzenia wątku
/// - {@link ThreadUpdateRequest} - dane do zmiany danych wątku
@Service
public class ThreadService {

  private final ThreadRepository threadRepository;
  private final GlobalThreadProvider globalThreadProvider;
  private final ThreadAdder threadAdder;
  private final ScenarioValidator scenarioValidator;

  @Autowired
  public ThreadService(
    ThreadRepository threadRepository,
    GlobalThreadProvider globalThreadProvider,
    ThreadAdder threadAdder,
    ScenarioValidator scenarioValidator
  ) {
    this.threadRepository = threadRepository;
    this.globalThreadProvider = globalThreadProvider;
    this.threadAdder = threadAdder;
    this.scenarioValidator = scenarioValidator;
  }

  //--------------------------------------------------Pobieranie wątków---------------------------------------------------------

  /// Pobiera wszystkie wątki scenariusza wraz z ich obiektami.
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @return lista wątków z ich obiektami
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public List<ThreadResponse> getScenarioThreads(Integer scenarioId) {
    return threadRepository.getThreads(null, scenarioId);
  }

  /// Pobiera pojedynczy wątek wraz z jego obiektami.
  /// Weryfikuje czy wątek należy do wskazanego scenariusza.
  ///
  /// @param threadId ID wątku (0 dla wątku globalnego)
  /// @param scenarioId ID scenariusza
  /// @return dane wątku z jego obiektami
  /// @throws ApiException gdy wątek nie istnieje lub nie należy do scenariusza
  @Transactional
  public ThreadResponse getOneThread(Integer threadId, Integer scenarioId) {
    scenarioValidator.checkIfThreadsAreInScenario(
      List.of(threadId),
      scenarioId
    );
    List<ThreadResponse> threads = threadRepository.getThreads(
      threadId,
      scenarioId
    );
    if (threads.isEmpty()) {
      throw new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.THREAD,
        HttpStatus.NOT_FOUND
      );
    }
    return threads.getFirst();
  }

  //----------------------------------------------------Dodawanie wątków-------------------------------------------------------
  /// Dodaje nowy wątek do scenariusza.
  /// Automatycznie tworzy dwa eventy:
  /// - START w czasie rozpoczęcia wątku
  /// - END w następnej jednostce czasu
  ///
  /// @param scenarioId identyfikator scenariusza
  /// @param info dane nowego wątku
  /// @return status aktualizacji
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public ThreadResponse addThread(
    Integer scenarioId,
    ThreadCreateRequest info
  ) {
    Integer threadId = threadAdder.addThread(scenarioId, info);

    return getOneThread(threadId, scenarioId);
  }

  //------------------------------------------------------------Zmiana wątków----------------------------------------------
  /// Modyfikuje podstawowe informacje o wątku.
  /// Obsługuje zarówno wątki normalne, jak i globalny (ID=0).
  /// Aktualizuje tylko tytuł i opis wątku.
  ///
  /// @param threadId ID wątku (0 dla wątku globalnego)
  /// @param info nowe dane wątku (tytuł i opis)
  /// @param scenarioId ID scenariusza
  /// @return zaktualizowany wątek wraz z jego obiektami
  /// @throws ApiException gdy wątek nie należy do scenariusza
  /// @apiNote Wykonywana w ramach osobnej transakcji
  @Transactional
  public ThreadResponse changeThread(
    Integer threadId,
    ThreadUpdateRequest info,
    Integer scenarioId
  ) {
    scenarioValidator.checkIfThreadsAreInScenario(
      List.of(threadId),
      scenarioId
    );

    Thread thread = new Thread(
      threadId == 0
        ? globalThreadProvider.getGlobalThreadId(scenarioId)
        : threadId,
      scenarioId,
      info.title(),
      info.description(),
      threadId == 0,
      null
    );
    threadRepository.save(thread);
    return getOneThread(threadId, scenarioId);
  }
}
