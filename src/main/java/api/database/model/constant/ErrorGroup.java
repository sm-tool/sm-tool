package api.database.model.constant;

/// Grupuje błędy według kontekstu lub tabeli, której dotyczą.
///
/// # Główne kategorie
/// ## Obiekty i szablony
/// - `OBJECT` - błędy związane z obiektami
/// - `OBJECT_TEMPLATE` - błędy szablonów obiektów
/// - `OBJECT_TYPE` - błędy typów obiektów
///
/// ## Atrybuty i asocjacje
/// - `ATTRIBUTE` - błędy atrybutów
/// - `ASSOCIATION` - błędy asocjacji
/// - `ATTRIBUTE_TEMPLATE` - błędy szablonów atrybutów
///
/// ## Wątki i wydarzenia
/// - `THREAD` - błędy wątków
/// - `EVENT` - błędy wydarzeń
/// - `BRANCHING` - błędy rozgałęzień
///
/// ## Scenariusze
/// - `SCENARIO` - błędy scenariuszy
/// - `SCENARIO_PHASE` - błędy faz scenariusza
///
/// ## Uprawnienia i użytkownicy
/// - `PERMISSION` - błędy uprawnień
/// - `USER` - błędy użytkowników
///
/// # Przykład użycia
/// ```java
/// throw new ApiException(
///     ErrorCode.DOES_NOT_EXIST,
///     ErrorGroup.OBJECT_TYPE,
///     HttpStatus.NOT_FOUND
/// );
/// ```
///
/// @see api.database.model.exception.ApiException wyjątek API
public enum ErrorGroup {
  // Obiekty
  /// Transfer obiektów między wątkami
  OBJECT_TRANSFER,

  // Asocjacje
  /// Podstawowe operacje na asocjacjach
  ASSOCIATION,
  /// Zmiany asocjacji
  ASSOCIATION_CHANGE,
  /// Typy asocjacji
  ASSOCIATION_TYPE,

  // Atrybuty
  /// Atrybuty obiektów
  ATTRIBUTE,
  /// Zmiany atrybutów
  ATTRIBUTE_CHANGE,
  /// Szablony atrybutów
  ATTRIBUTE_TEMPLATE,

  // Wątki i rozgałęzienia
  /// Operacje na rozgałęzieniach
  BRANCHING,
  /// Konfiguracja
  CONFIGURATION,
  /// Wydarzenia w scenariuszu
  EVENT,

  // Obiekty
  /// Obiekty w scenariuszu
  OBJECT,
  /// Szablony obiektów
  OBJECT_TEMPLATE,
  /// Typy obiektów
  OBJECT_TYPE,

  // Uprawnienia i użytkownicy
  /// Uprawnienia użytkowników
  PERMISSION,
  /// Scenariusze
  SCENARIO,
  /// Fazy scenariusza
  SCENARIO_PHASE,
  /// Wątki
  THREAD,
  /// Użytkownicy
  USER,

  // Systemy techniczne
  /// Błędy serwera
  SERVER,
  /// Błędy websocket
  WEBSOCKET,
  /// Powiązania wątków z obiektami
  THREAD_TO_OBJECT,
}
