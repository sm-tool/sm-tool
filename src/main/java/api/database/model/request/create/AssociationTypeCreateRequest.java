package api.database.model.request.create;

import jakarta.validation.constraints.NotNull;

/// Reprezentuje dane požądane podczas tworzenia nowego typu asocjacji między obiektami.
///
/// # Opis
/// Rejestruje informacje niezbędne do zdefiniowania unikalnego typu powiązania
/// między obiektami w systemie, określając dozwolone typy obiektów.
///
/// # Pola
/// - `description`: Unikalna, opisowa nazwa typu asocjacji
/// - `firstObjectTypeId`: Identyfikator pierwszego dozwolonego typu obiektu
/// - `secondObjectTypeId`: Identyfikator drugiego dozwolonego typu obiektu
///
/// # Walidacja
/// Wszystkie pola są wymagane i podlegają walidacji:
/// - `description` - nie może być pusty
/// - `firstObjectTypeId` - musi być poprawnym identyfikatorem typu obiektu
/// - `secondObjectTypeId` - musi być poprawnym identyfikatorem typu obiektu
public record AssociationTypeCreateRequest(
  /// Unikalny opis typu asocjacji
  @NotNull(message = "NULL_VALUE;ASSOCIATION_TYPE;description")
  String description,
  /// Identyfikator pierwszego dozwolonego typu obiektu dla asocjacji
  @NotNull(message = "NULL_VALUE;ASSOCIATION_TYPE;firstObjectTypeId")
  Integer firstObjectTypeId,
  /// Identyfikator drugiego dozwolonego typu obiektu dla asocjacji
  @NotNull(message = "NULL_VALUE;ASSOCIATION_TYPE;secondObjectTypeId")
  Integer secondObjectTypeId
) {}
