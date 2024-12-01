package api.database.service.object;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.thread.QdsThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Zarządza relacjami między obiektami a wątkami.
/// Odpowiada za walidację warunków dotyczących wątków
/// przy operacjach na obiektach.
@Component
class ObjectThreadManagement {

  private final QdsThreadRepository qdsThreadRepository;

  @Autowired
  ObjectThreadManagement(QdsThreadRepository qdsThreadRepository) {
    this.qdsThreadRepository = qdsThreadRepository;
  }

  //---------------------------------------------------Weryfikacja warunków--------------------------------------------------------
  /// Sprawdza czy wątek ma event typu START.
  /// Weryfikacja konieczna przed utworzeniem obiektu w wątku.
  ///
  /// @param threadId identyfikator wątku
  /// @throws ApiException gdy wątek nie posiada eventu START
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public void checkIfThreadWithStart(Integer threadId) {
    if (
      !qdsThreadRepository.checkIfThreadWithStart(threadId)
    ) throw new ApiException(
      ErrorCode.TRIED_TO_CREATE_OBJECT_ON_THREAD_WITHOUT_START_EVENT,
      ErrorGroup.THREAD,
      HttpStatus.BAD_REQUEST
    );
  }
}
