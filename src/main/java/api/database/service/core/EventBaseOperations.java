package api.database.service.core;

import api.database.entity.event.QdsEvent;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.QdsEventType;
import api.database.model.event.QdsInfoEventModifyLast;
import api.database.model.exception.ApiException;
import api.database.repository.event.QdsEventRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Klasa dostarczająca podstawowe operacje na eventach scenariusza.
/// Zapewnia funkcjonalności związane z obsługą ostatnich eventów w wątkach,
/// w tym modyfikację czasu, typu i rozgałęzień.
@Component
public class EventBaseOperations {

  private final QdsEventRepository qdsEventRepository;

  @Autowired
  public EventBaseOperations(QdsEventRepository qdsEventRepository) {
    this.qdsEventRepository = qdsEventRepository;
  }

  /// Modyfikuje ostatni event (typu END) w wątku.
  /// Umożliwia zmianę czasu eventu oraz dodanie rozgałęzienia.
  ///
  /// @param event event do modyfikacji
  /// @param info dane modyfikacji zawierające nowy czas, typ i id rozgałęzienia
  /// @apiNote Operacja wykonywana w ramach transakcji "nadrzędnej"
  public void saveModifiedLastEvent(
    QdsEvent event,
    QdsInfoEventModifyLast info
  ) {
    event.setEventTime(info.eventTime());
    event.setEventType(info.type());
    event.setBranchingId(info.branchingId());

    qdsEventRepository.saveAndFlush(event);
  }

  /// Pobiera i waliduje ostatni event w wątku.
  /// Sprawdza warunki związane z rozgałęzieniami i czasem eventu.
  ///
  /// @param threadId id wątku
  /// @param time null dla blokowania wątków rozgałęzionych lub czas do walidacji
  /// @return ostatni event w wątku
  /// @throws ApiException gdy:
  ///  - wątek nie istnieje
  ///  - wątek jest już rozgałęziony (dla time = null)
  ///  - istnieją późniejsze eventy niż podany czas
  public QdsEvent getAndCheckLastEvent(Integer threadId, Integer time) {
    QdsEvent lastEvent = qdsEventRepository.getLastEvent(threadId);
    //Tylko dla braku wątku
    if (lastEvent == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      List.of(threadId.toString()),
      ErrorGroup.THREAD,
      HttpStatus.BAD_REQUEST
    );
    //Jeżeli wątek kończy się rozgałęzieniem
    if (lastEvent.getEventType() != QdsEventType.END) {
      if (time == null) throw new ApiException(
        ErrorCode.THREAD_ALREADY_BRANCHED,
        List.of(threadId.toString()),
        ErrorGroup.THREAD,
        HttpStatus.BAD_REQUEST
      );
      else if (lastEvent.getEventTime() > time) throw new ApiException(
        ErrorCode.EXIST_LATER_EVENTS,
        ErrorGroup.THREAD,
        HttpStatus.BAD_REQUEST
      );
    }
    return lastEvent;
  }

  /// Pobiera pierwsze wydarzenie wątku (START, FORK_OUT lub JOIN_OUT)
  ///
  /// @param threadId identyfikator wątku
  /// @return pierwsze wydarzenie w wątku
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public QdsEvent getFirstEvent(Integer threadId) {
    QdsEvent firstEvent = qdsEventRepository.getFirstEvent(threadId);
    if (firstEvent == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      List.of(threadId.toString()),
      ErrorGroup.THREAD,
      HttpStatus.BAD_REQUEST
    );
    return firstEvent;
  }
}
