package api.database.model.constant;

/// Kody błędów występujących w systemie.
/// Używane do precyzyjnego określenia rodzaju błędu w wyjątkach ApiException.
///
/// # Grupy błędów
/// ## Błędy czasowe
/// - `EXIST_LATER_EVENTS` - istnieją późniejsze wydarzenia
///
/// ## Błędy wydarzeń
/// - `EVENT_NOT_DELETABLE` - wydarzenie nie może zostać usunięte
///
/// ## Błędy rozgałęzień
/// - `THREAD_ALREADY_BRANCHED` - wątek został już rozgałęziony
/// - `TRIED_TO_BRANCH_GLOBAL_THREAD` - próba rozgałęzienia wątku globalnego
///
/// ## Błędy wątków
/// - `TRIED_TO_CREATE_OBJECT_ON_THREAD_WITHOUT_START_EVENT` - próba utworzenia obiektu w wątku bez eventu START
///
/// ## Błędy obiektów i typów
/// - `DUPLICATED_OBJECTS_IN_TRANSFER` - zduplikowane obiekty w transferze
/// - `NOT_ALL_OBJECTS_WERE_TRANSFERRED` - niepełny transfer obiektów
/// - `TRIED_TO_ADD_GLOBAL_TYPE_TO_NOT_GLOBAL_OBJECT` - próba dodania typu globalnego do obiektu nie-globalnego
/// - `INCOMPATIBLE_TYPES` - niezgodne typy obiektów
/// - `EXIST_CHILD_OBJECT_TYPE` - istnieje typ potomny
/// - `CANNOT_DELETE_BASIC_OBJECT_TYPE` - próba usunięcia podstawowego typu
///
/// ## Błędy konfiguracji i walidacji
/// - `WRONG_COLUMN_NAME` - nieprawidłowa nazwa kolumny
/// - `WRONG_ASSOCIATIONS` - nieprawidłowe asocjacje
/// - `WRONG_VALUE_FORMAT` - nieprawidłowy format wartości
/// - `NULL_VALUE` - niedozwolona wartość null
/// - `WRONG_ENDPOINT` - nieprawidłowy endpoint
///
/// ## Błędy scenariusza
/// - `PHASE_OVERLAP` - nakładające się fazy
/// - `CANNOT_ADD_SUCH_OBJECT_IN_SCENARIO` - niedozwolony obiekt w scenariuszu
/// - `INCOMPATIBLE_TEMPLATE_WITH_OBJECT` - niezgodność szablonu z obiektem
/// - `WRONG_HIERARCHY` - nieprawidłowa hierarchia
/// - `END_BEFORE_START` - nieprawidłowa chronologia
///
/// # Przykład użycia
/// ```java
/// if (objectType == null) {
///     throw new ApiException(
///         ErrorCode.DOES_NOT_EXIST,
///         ErrorGroup.OBJECT_TYPE,
///         HttpStatus.NOT_FOUND
///     );
/// }
/// ```
///
/// @see api.database.model.exception.ApiException wyjątek API
public enum ErrorCode {
  // Błędy związane z wydarzeniami
  /// Wydarzenie nie może zostać usunięte
  EVENT_NOT_MODIFIABLE,

  // Błędy związane z rozgałęzieniami
  /// Wątek został już rozgałęziony
  THREAD_ALREADY_BRANCHED,

  /// Próba rozgałęzienia wątku globalnego
  TRIED_TO_BRANCH_GLOBAL_THREAD,

  // Błędy związane z wątkami
  /// Próba utworzenia obiektu w wątku bez eventu START
  TRIED_TO_CREATE_OBJECT_ON_THREAD_WITHOUT_START_EVENT,

  // Błędy związane z atrybutami
  /// Nieprawidłowy format wartości
  WRONG_VALUE_FORMAT,

  // Błędy związane z obiektami
  /// Zduplikowane obiekty w transferze
  DUPLICATED_OBJECTS_IN_TRANSFER,

  /// Nie wszystkie obiekty zostały przeniesione
  NOT_ALL_OBJECTS_WERE_TRANSFERRED,

  /// Próba dodania typu globalnego do obiektu nie-globalnego
  TRIED_TO_ADD_GLOBAL_TYPE_TO_NOT_GLOBAL_OBJECT,

  // Błędy związane z typami obiektów
  /// Niezgodne typy
  INCOMPATIBLE_TYPES,

  /// Istnieje typ potomny
  EXIST_CHILD_OBJECT_TYPE,

  /// Nie można usunąć podstawowego typu obiektu
  CANNOT_DELETE_BASIC_OBJECT_TYPE,

  /// Nieprawidłowe asocjacje
  WRONG_ASSOCIATIONS,

  // Błędy z fazami scenariusza
  /// Fazy nakładają się na siebie
  PHASE_OVERLAP,

  // Błędy ogólne
  /// Encja/obiekt nie istnieje
  DOES_NOT_EXIST,

  /// Wartość null w polu/kolumnie NotNull
  NULL_VALUE,

  /// Element w użyciu - naruszenie kluczy obcych
  ELEMENT_IN_USE,

  // Błędy związane z obiektami globalnymi
  /// Wiele zmian obiektu w tym samym czasie
  MANY_OBJECT_CHANGES_AT_THE_SAME_TIME,

  /// Nie można użyć obiektów w wątku
  CANNOT_USE_OBJECTS_IN_THREAD,

  /// Nie można użyć atrybutów w wątku
  CANNOT_USE_ATTRIBUTES_IN_THREAD,

  /// Wielokrotne definicje tej samej zmiany asocjacji
  MULTIPLE_SAME_ASSOCIATION_CHANGE_DEFINITIONS,

  // Błędy związane ze scenariuszem
  /// Nie można dodać takiego obiektu w scenariuszu
  CANNOT_ADD_SUCH_OBJECT_IN_SCENARIO,

  /// Zła hierarchia
  WRONG_HIERARCHY,

  /// Złe daty/czasy (końcowa przed początkową)
  END_BEFORE_START,

  /// Obiekt nie może być przypisany do użytkownika
  OBJECT_CANNOT_BE_USER,

  /// Inne scenario dla encji i w headerze
  CONFLICT_BETWEEN_SCENARIOS_IN_HEADER_AND_ENTITY,

  /// Brak scenarioId w nagłówku
  NO_SCENARIO_ID_IN_HEADER,

  /// Brak uprawnień
  LACK_OF_PERMISSIONS,

  /// Zły typ rozgałęzienia
  WRONG_BRANCHING_TYPE,

  /// Za mało wątków dla rozgałęzienia
  TOO_LITTLE_THREADS,

  /// Za wcześnie/ujemny czas
  NEGATIVE_TIME,
  /// Nie można usunąć zmiany atrybutu z eventu początkowego
  CANNOT_DELETE_OR_ADD_CHANGE_TO_START_EVENT,
  /// Nie można przesunąć eventów ze względu na blokadę na innych wydarzeniach
  CANNOT_MOVE_EVENTS,
  /// Dla branchingu już istnieje wydarzenie w danym czasie
  EXIST_EVENT_IN_TIME,
  /// Powtórzone id dla JOIN
  DUPLICATED_THREAD_IDS,
  /// Nie można wstawić JOIN w środku
  CANNOT_INSERT_JOIN,
  /// Nie można utworzyć asocajcji dla 2 obiektów globalnych w wątku nieglobalnym
  CANNOT_CREATE_ASSOCIATION_BETWEEN_GLOBAL_OBJECTS_IN_NOT_GLOBAL_THREAD,
}
