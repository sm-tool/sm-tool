package api.database.model.request.create;

import jakarta.validation.constraints.NotNull;

/// Reprezentuje dane potrzebne podczas tworzenia nowego szablonu obiektu w systemie.
///
/// # Cel
/// Definiuje strukturę i charakterystykę szablonu obiektu,
/// który będzie używany do tworzenia instancji obiektów o spójnych właściwościach.
///
/// # Pola
/// - `title`: Unikalna nazwa szablonu w systemie
/// - `description`: Szczegółowy opis przeznaczenia i charakterystyki szablonu
/// - `color`: Kolor używany do wizualnej reprezentacji obiektów tego szablonu
/// - `objectTypeId`: Identyfikator typu obiektu, do którego szablon należy
///
/// # Walidacja
/// - Wszystkie pola są wymagane
/// - Tytuł musi być unikalny
/// - Typ obiektu musi istnieć w systemie
///
/// # Ograniczenia
/// - Nie można utworzyć szablonu dla nieistniejącego typu obiektu
/// - Kolor powinien być w formacie akceptowalnym przez system
public record ObjectTemplateCreateRequest(
  /// Unikalny tytuł szablonu
  @NotNull(message = "NULL_VALUE;OBJECT_TEMPLATE;title") String title,
  /// Opis szablonu
  @NotNull(message = "NULL_VALUE;OBJECT_TEMPLATE;description")
  String description,
  /// Kolor tego szablonu
  @NotNull(message = "NULL_VALUE;OBJECT_TEMPLATE;color") String color,
  /// Identyfikator typu obiektu
  @NotNull(message = "NULL_VALUE;OBJECT_TEMPLATE;objectTypeId")
  Integer objectTypeId
) {}
