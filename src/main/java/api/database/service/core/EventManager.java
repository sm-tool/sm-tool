package api.database.service.core;

import api.database.entity.event.Event;
import api.database.model.constant.BranchingType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.EventType;
import api.database.model.domain.event.InternalSpecialEvent;
import api.database.model.exception.ApiException;
import api.database.repository.event.EventRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class EventManager {

  private final EventRepository eventRepository;
  private final IdleEventManager idleEventManager;

  @Autowired
  public EventManager(
    EventRepository eventRepository,
    IdleEventManager idleEventManager
  ) {
    this.eventRepository = eventRepository;
    this.idleEventManager = idleEventManager;
  }

  /// Dodaje specjalny event, który nie może zawierać zmian asocjacji i atrybutów.
  /// Obsługuje typy eventów:
  /// - JOIN_IN, JOIN_OUT
  /// - FORK_IN, FORK_OUT
  /// - START, END
  ///
  /// @param info dane nowego eventu specjalnego
  /// @apiNote Operacja wykonywana w ramach transakcji nadrzędnej
  public Integer addSpecialEvent(InternalSpecialEvent info) {
    return eventRepository.save(Event.createSpecial(info)).getId();
  }

  //-----------------------------------------------Last event-----------------------------------------------------------

  // Dla walidacji JOIN - sprawdza czy:
  // 1. Wątek kończy się END
  // 2. Nie ma wydarzeń po czasie JOIN-a
  public void changeLastEventForJoin(
    Integer threadId,
    Integer joinTime,
    Integer joinId
  ) {
    Event lastEvent = getLastEvent(threadId);
    // Typ
    if (lastEvent.getEventType() != EventType.END) {
      throw new ApiException(
        ErrorCode.THREAD_ALREADY_BRANCHED,
        ErrorGroup.BRANCHING,
        HttpStatus.CONFLICT
      );
    }
    // Czas
    Integer lastEventTime = lastEvent.getEventTime();
    // JOIN nie może być "w środku" wątku - musi być po ostatnim evencie lub w jego trakcie (gdyż jest to END)
    if (lastEventTime > joinTime) {
      throw new ApiException(
        ErrorCode.CANNOT_INSERT_JOIN,
        ErrorGroup.BRANCHING,
        HttpStatus.BAD_REQUEST
      );
    }

    // Zmiana ostatniego wydarzenia
    lastEvent.setEventTime(joinTime);
    lastEvent.setEventType(EventType.JOIN_IN);
    lastEvent.setBranchingId(joinId);
    eventRepository.saveAndFlush(lastEvent);
    // Wypełnienie Idlami
    idleEventManager.fillWithIdleEvents(threadId, lastEventTime, joinTime);
  }

  private Integer handleBranchingAfterLastEvent(
    Integer threadId,
    Integer lastEventTime,
    Integer branchingTime,
    BranchingType type,
    Integer branchingId,
    Event lastEvent
  ) { // Rozgałęzienie jest po czasie ostatniego
    // Przesunięcie ostatniego wydarzenia na czas po rozgałęzieniu - będzie "przeniesione" do wątku wychodzącego
    // Reszta zostaje taka sama - END bez rozgałęzienia
    lastEvent.setEventTime(branchingTime + 1);
    eventRepository.saveAndFlush(lastEvent);
    //Generuj IDLE ostatnie wydarzenie - branchingTime
    idleEventManager.fillWithIdleEvents(threadId, lastEventTime, branchingTime);
    // Dodaj event kończący wątek wchodzący
    return addSpecialEvent(
      new InternalSpecialEvent(
        threadId,
        EventType.valueOf(type.name() + "_IN"),
        branchingTime,
        branchingId
      )
    );
  }

  private Integer handleBranchingBeforeLastEvent(
    Integer threadId,
    Integer branchingTime,
    BranchingType type,
    Integer branchingId
  ) {
    Event idleEvent = idleEventManager.getIdleEventInTimeAndThread(
      branchingTime,
      threadId
    );
    if (idleEvent == null) throw new ApiException(
      ErrorCode.EXIST_EVENT_IN_TIME,
      ErrorGroup.BRANCHING,
      HttpStatus.CONFLICT
    );
    // Zmiana IDLE na wydarzenie zakończenia wątku poprzez rozgałęzienie
    idleEventManager.changeIdleToBranched(
      idleEvent,
      branchingId,
      EventType.valueOf(type.name() + "_IN")
    );
    return idleEvent.getId();
  }

  // Dla FORK i pierwszego wątku JOIN - sprawdza czy możemy dodać wydarzenie w danym czasie
  public Integer changeLastEventInIncomingThreadForBranching(
    Integer threadId,
    Integer branchingTime,
    Integer branchingId,
    BranchingType branchingType
  ) {
    // Pobranie ostatniego wydarzenia
    Event lastEvent = getLastEvent(threadId);
    // Jeśli wątek już rozgałęziony i próba wstawienia po ostatnim wydarzeniu
    if (
      lastEvent.getEventType() != EventType.END &&
      lastEvent.getEventTime() <= branchingTime
    ) throw new ApiException(
      ErrorCode.THREAD_ALREADY_BRANCHED,
      ErrorGroup.BRANCHING,
      HttpStatus.CONFLICT
    );
    // Jeśli FORK/JOIN po zakończeniu wątku
    if (lastEvent.getEventTime() <= branchingTime) {
      return handleBranchingAfterLastEvent(
        threadId,
        lastEvent.getEventTime(),
        branchingTime,
        branchingType,
        branchingId,
        lastEvent
      );
    } else {
      return handleBranchingBeforeLastEvent(
        threadId,
        branchingTime,
        branchingType,
        branchingId
      );
    }
  }

  // Do pobrania ostatniego eventu do walidacji asocjacji
  public Integer getLastEventForAssociations(Integer threadId) {
    return getLastEvent(threadId).getId();
  }

  private Event getLastEvent(Integer threadId) {
    return eventRepository.getLastEvent(threadId);
  }

  //--------------------------------------------First event-------------------------------------------------------------

  /// Pobiera pierwsze wydarzenie wątku (START, FORK_OUT lub JOIN_OUT)
  ///
  /// @param threadId identyfikator wątku
  /// @return pierwsze wydarzenie w wątku
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public Event getFirstEvent(Integer threadId) {
    return eventRepository.getFirstEvent(threadId);
  }

  //--------------------------------------------------------------------------------------------------------------------

  /// Usuwa wszystkie eventy dla wskazanych wątków.
  /// Nie weryfikuje stanu rozgałęzień.
  ///
  /// @param threadIds lista identyfikatorów wątków do wyczyszczenia
  public void deleteThreadsEvents(List<Integer> threadIds) {
    eventRepository.deleteThreadEvents(threadIds.toArray(new Integer[0]));
  }

  public void moveEventsBetweenThreads(
    Integer[] idsFrom,
    Integer[] idsTo,
    Integer time
  ) {
    eventRepository.moveEventsBetweenThreads(idsTo, idsFrom, time);
  }

  public void ensureEndEvents(Integer[] threadIds) {
    eventRepository.ensureEndEvents(threadIds);
  }

  public void changeEventsWithoutChangesToIdle(Integer scenarioId) {
    eventRepository.changeEventsWithoutChangesToIdle(scenarioId);
  }
}
