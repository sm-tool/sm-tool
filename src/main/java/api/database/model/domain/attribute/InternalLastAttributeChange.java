package api.database.model.domain.attribute;

import api.database.entity.object.AttributeChange;
import api.database.repository.attribute.AttributeChangeRepository;

/// Projekcja JPA reprezentująca ostatnią zmianę wartości atrybutu przed konkretnym wydarzeniem.
/// Używana do śledzenia historii zmian atrybutów obiektów w scenariuszu.
///
/// # Pola
/// - attributeId - identyfikator zmienionego atrybutu
/// - value - poprzednia wartość atrybutu przed zmianą
/// - targetEventId - identyfikator wydarzenia dla którego sprawdzamy poprzedni stan
///
/// # Wykorzystanie
/// - W {@link AttributeChangeRepository} do wydajnego pobierania historii zmian
/// - Umożliwia odtworzenie stanu atrybutów w dowolnym momencie scenariusza
/// - Zoptymalizowane zapytanie unikające ładowania pełnych encji {@link AttributeChange}
public interface InternalLastAttributeChange {
  Integer getAttributeId();
  String getValue();
  Integer getTargetEventId();
}
