package api.database.model.constant;

// Kody błędów występujących w systemie.
// Używane do precyzyjnego określenia rodzaju błędu w wyjątkach ApiException.
public enum ErrorCode {
  // Błędy związane z czasem wydarzeń
  EXIST_LATER_EVENTS, // Istnieją późniejsze wydarzenia
  EXIST_LATER_EVENTS_ON_THREAD_X, // Istnieją późniejsze wydarzenia na wątku X

  // Błędy związane z wydarzeniami
  EVENT_NOT_DELETABLE, // Wydarzenie nie może zostać usunięte

  // Błędy związane z rozgałęzieniami
  THREAD_ALREADY_BRANCHED, // Wątek został już rozgałęziony
  TRIED_TO_FORK_GLOBAL_THREAD, // Próba rozgałęzienia wątku globalnego
  TRIED_TO_JOIN_GLOBAL_THREAD, // Próba połączenia z wątkiem globalnym

  // Błędy związane z wątkami
  THREAD_WAS_BRANCHED_BEFORE, // Wątek był już wcześniej rozgałęziony
  TRIED_TO_CREATE_OBJECT_ON_THREAD_WITHOUT_START_EVENT, // Próba utworzenia obiektu w wątku bez eventu START

  // Błędy związane z atrybutami
  WRONG_VALUE_FORMAT, // Nieprawidłowy format wartości

  // Błędy związane z obiektami
  //
  DUPLICATED_OBJECTS_IN_TRANSFER, // Zduplikowane obiekty w transferze
  NOT_ALL_OBJECTS_WERE_TRANSFERRED, // Nie wszystkie obiekty zostały przeniesione
  TRIED_TO_ADD_GLOBAL_TYPE_TO_NOT_GLOBAL_OBJECT, // Próba dodania typu globalnego do obiektu nie-globalnego

  // Błędy związane z typami obiektów
  INCOMPATIBLE_TYPES, // Niezgodne typy
  EXIST_CHILD_OBJECT_TYPE, // Istnieje typ potomny
  CANNOT_DELETE_BASIC_OBJECT_TYPE, // Nie można usunąć podstawowego typu obiektu

  // Błędy konfiguracji
  WRONG_COLUMN_NAME, // Nieprawidłowa nazwa kolumny
  WRONG_ASSOCIATIONS, // Nieprawidłowe asocjacje

  // Błędy z fazami scenariusza
  PHASE_OVERLAP,

  // Błędy ogólne
  DOES_NOT_EXIST, // Obiekt nie istnieje
  NULL_VALUE, // Wartość null
  CANNOT_DELETE_FORKED_THREAD, // Nie można usunąć rozgałęzionego wątku
  TOO_LITTLE_OFFSPRINGS, // Za mało potomków
  WRONG_ENDPOINT, // Nieprawidłowy endpoint

  // Błędy związane z obiektami globalnymi
  MANY_OBJECT_CHANGES_AT_THE_SAME_TIME, // Wiele zmian obiektu w tym samym czasie
  CANNOT_USE_OBJECTS_IN_THREAD, // Nie można użyć obiektów w wątku
  CANNOT_USE_ATTRIBUTES_IN_THREAD, // Nie można użyć atrybutów w wątku
  GLOBAL_OBJECT_CHANGED_IN_ANOTHER_THREAD, // Obiekt globalny zmieniony w innym wątku
  MULTIPLE_SAME_ASSOCIATION_CHANGE_DEFINITIONS, // Wielokrotne definicje tej samej zmiany asocjacji

  // Błędy związane ze scenariuszem
  CANNOT_ADD_SUCH_OBJECT_IN_SCENARIO, // Nie można dodać takiego obiektu w scenariuszu
  INCOMPATIBLE_TEMPLATE_WITH_OBJECT, // Niezgodny szablon z obiektem
}
