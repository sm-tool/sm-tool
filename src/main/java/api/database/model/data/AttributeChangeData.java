package api.database.model.data;

import api.database.entity.object.AttributeChange;
import jakarta.validation.constraints.NotNull;

/// Reprezentuje zmianę wartości atrybutu obiektu w wydarzeniu.
/// Przechowuje:
/// - Identyfikator atrybutu
/// - Nową wartość atrybutu (jako string, konwertowany zgodnie z typem)
///
/// Używane do:
/// - Przetwarzania zmian atrybutów w wydarzeniach
/// - Walidacji wartości względem typu atrybutu
/// - Śledzenia historii zmian atrybutów
/// - Mapowania stanu w odpowiedziach API
/// - Przesyłaniu zmian w żądaniu
public record AttributeChangeData(
  @NotNull(message = ";NULL_VALUE;ATTRIBUTE_CHANGE;attributeId")
  Integer attributeId,
  @NotNull(message = "NULL_VALUE;ATTRIBUTE_CHANGE;value") String value
) {
  /// Tworzy obiekt zmiany z encji zmiany atrybutu.
  ///
  /// @param change encja zmiany atrybutu
  /// @return zmapowany obiekt AttributeChangeData
  public static AttributeChangeData from(AttributeChange change) {
    return new AttributeChangeData(change.getAttributeId(), change.getValue());
  }
}
