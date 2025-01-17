package api.database.model.request.create;

import jakarta.validation.constraints.NotNull;

/// Reprezentuje dane požądane podczas tworzenia nowej instancji obiektu w scenariuszu.
///
/// # Cel
/// Definiuje minimalne wymagane informacje do utworzenia obiektu
/// w kontekście konkretnego wątku i scenariusza.
///
/// # Główne składowe
/// - Identyfikacja wątku pochodzenia
/// - Nazwa obiektu
/// - Szablon obiektu
/// - Typ obiektu
///
/// # Pola
/// - `originThreadId`: Identyfikator wątku, w którym obiekt zostaje utworzony
///   - `0` dla wątku globalnego
///   - Faktyczny identyfikator wątku dla wątków lokalnych
/// - `name`: Unikalna nazwa obiektu w scenariuszu
/// - `templateId`: Identyfikator szablonu, zgodnie z którym obiekt zostanie utworzony
/// - `objectTypeId`: Identyfikator typu obiektu
///
/// # Walidacja
/// - Wszystkie pola są wymagane
/// - Nazwa obiektu musi być unikalna w scenariuszu
/// - Szablon i typ obiektu muszą być zgodne
/// - Wątek musi być poprawny dla danego scenariusza
///
/// # Ograniczenia
/// - Nie można utworzyć obiektu w nieistniejącym wątku
/// - Typ obiektu musi być dostępny w scenariuszu
/// - Szablon obiektu musi być przypisany do scenariusza
public record ObjectInstanceCreateRequest(
  /// Wątek z którego pochodzi obiekt
  @NotNull(message = "NULL_VALUE;OBJECT;originThreadId") Integer originThreadId,
  /// Nazwa obiektu
  @NotNull(message = "NULL_VALUE;OBJECT;name") String name,
  /// Szablon obiektu
  @NotNull(message = "NULL_VALUE;OBJECT;templateId") Integer templateId,
  /// Typ obiektu
  @NotNull(message = "NULL_VALUE;OBJECT;objectTypeId") Integer objectTypeId
) {}
