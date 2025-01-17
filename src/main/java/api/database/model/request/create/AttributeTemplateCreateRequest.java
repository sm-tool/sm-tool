package api.database.model.request.create;

import api.database.model.constant.AttributeType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/// Reprezentuje dane požądane podczas tworzenia nowego szablonu atrybutu obiektu.
///
/// # Cel
/// Definiuje strukturę i własności szablonu atrybutu, który będzie używany
/// do określenia charakterystyki atrybutów we wszystkich obiektach
/// utworzonych na bazie danego szablonu obiektu.
///
/// # Główne składowe
/// - Powiązanie z szablonem obiektu
/// - Nazwa i domyślna wartość atrybutu
/// - Typ danych atrybutu
/// - Opcjonalna jednostka miary
///
/// # Pola
/// - `objectTemplateId`: Identyfikator szablonu obiektu, do którego należy atrybut
/// - `name`: Unikalna nazwa atrybutu w ramach szablonu
/// - `defaultValue`: Początkowa wartość atrybutu
/// - `unit`: Opcjonalna jednostka miary
/// - `type`: Typ danych atrybutu (np. INT, STRING, DATE, BOOL)
///
/// # Walidacja
/// - Wszystkie pola wymagane z wyjątkiem `unit`
/// - Nazwa atrybutu musi być unikalna w ramach szablonu
/// - Wartość domyślna musi być zgodna z typem
///
/// @see AttributeType Typy atrybutów wspierane w systemie
public record AttributeTemplateCreateRequest(
  /// Identyfikator szablonu obiektu
  @NotNull(message = "NULL_VALUE;ATTRIBUTE_TEMPLATE;objectTemplateId")
  Integer objectTemplateId,
  /// Nazwa atrybutu (unikalna w ramach szablonu)
  @NotNull(message = "NULL_VALUE;ATTRIBUTE_TEMPLATE;name") String name,
  /// Wartość domyślna
  @NotNull(message = "NULL_VALUE;ATTRIBUTE_TEMPLATE;defaultValue")
  String defaultValue,
  /// Jednostka
  String unit,
  /// Typ danych atrybutu
  @NotNull(message = "NULL_VALUE;ATTRIBUTE_TEMPLATE;type") AttributeType type
) {}
