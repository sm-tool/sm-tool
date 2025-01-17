package api.database.service.event.processor;

import api.database.entity.object.AttributeChange;
import api.database.model.constant.AttributeType;
import api.database.model.data.AttributeChangeData;
import api.database.model.domain.attribute.InternalAttributeIdWithType;
import api.database.model.exception.ApiException;
import api.database.repository.attribute.AttributeChangeRepository;
import api.database.repository.attribute.AttributeRepository;
import api.database.service.event.validator.AttributeValidator;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

/// Wykonawca zmian atrybutów w ramach wydarzeń.
/// Odpowiada za:
/// - Walidację wartości atrybutów przed zmianą
/// - Koordynację dodawania, aktualizacji i usuwania zmian
/// - Zarządzanie zapisem zmian w bazie danych
@Component
public class AttributeChangeExecutor {

  private final AttributeChangeRepository attributeChangeRepository;
  private final AttributeRepository attributeRepository;
  private final AttributeValidator attributeValidator;

  public AttributeChangeExecutor(
    AttributeChangeRepository attributeChangeRepository,
    AttributeRepository attributeRepository,
    AttributeValidator attributeValidator
  ) {
    this.attributeChangeRepository = attributeChangeRepository;
    this.attributeRepository = attributeRepository;
    this.attributeValidator = attributeValidator;
  }

  /// Wykonuje zestaw zmian atrybutów dla wydarzenia.
  /// Proces zmian:
  /// 1. Waliduje wszystkie dodawane i aktualizowane wartości
  /// 2. Usuwa wskazane zmiany
  /// 3. Aktualizuje istniejące zmiany
  /// 4. Dodaje nowe zmiany
  ///
  /// @param eventId id eventu zawierającego zmiany
  /// @param toAdd zbiór zmian do dodania
  /// @param toUpdate zbiór zmian do aktualizacji
  /// @param toDelete zbiór zmian do usunięcia
  public void executeChanges(
    Integer eventId,
    Set<AttributeChangeData> toAdd,
    Set<AttributeChangeData> toUpdate,
    Set<AttributeChangeData> toDelete
  ) {
    // Zwaliduj wszystkie zmiany za jednym razem
    validateAttributeChanges(
      Stream.concat(toAdd.stream(), toUpdate.stream()).collect(
        Collectors.toSet()
      )
    );

    if (!toDelete.isEmpty()) {
      attributeChangeRepository.deleteByEventIdAndAttributeIds(
        eventId,
        toDelete
          .stream()
          .map(AttributeChangeData::attributeId)
          .toArray(Integer[]::new)
      );
    }

    if (!toUpdate.isEmpty()) {
      for (var change : toUpdate) {
        attributeChangeRepository.updateByEventIdAndAttributeId(
          eventId,
          change.attributeId(),
          change.value()
        );
      }
    }

    if (!toAdd.isEmpty()) {
      attributeChangeRepository.saveAllAndFlush(
        toAdd.stream().map(a -> AttributeChange.from(a, eventId)).toList()
      );
    }
  }

  /// Waliduje zmiany atrybutów pod kątem zgodności wartości z typem.
  /// Proces walidacji:
  /// 1. Pobiera typy wszystkich modyfikowanych atrybutów
  /// 2. Weryfikuje każdą wartość względem typu atrybutu
  ///
  /// @param changes zbiór zmian do walidacji
  /// @throws ApiException gdy wartość nie jest zgodna z typem atrybutu
  private void validateAttributeChanges(Set<AttributeChangeData> changes) {
    Map<Integer, AttributeType> attributeTypes = attributeRepository
      .getAttributeTypes(
        changes
          .stream()
          .map(AttributeChangeData::attributeId)
          .toArray(Integer[]::new)
      )
      .stream()
      .collect(
        Collectors.toMap(
          InternalAttributeIdWithType::getId,
          InternalAttributeIdWithType::getType
        )
      );

    for (var change : changes) {
      AttributeType type = attributeTypes.get(change.attributeId());
      attributeValidator.checkAttributeValue(type, change.value());
    }
  }
}
