package api.database.model.domain.attribute;

import api.database.entity.object.Attribute;
import api.database.entity.object.AttributeTemplate;
import api.database.model.constant.AttributeType;
import api.database.repository.attribute.AttributeRepository;

/// Projekcja JPA reprezentująca podzbiór danych atrybutu i jego typu.
/// Używana w zapytaniach bazodanowych do zoptymalizowanego pobierania
/// tylko wymaganych pól atrybutu bez ładowania całej encji.
///
/// # Projekcja pól z {@link Attribute}
/// - id - identyfikator atrybutu
/// - attributeTemplateId - identyfikator szablonu atrybutu
/// - objectId - identyfikator obiektu właściciela
/// - type - typ atrybutu pobierany przez złączenie z {@link AttributeTemplate}
///
/// # Wykorzystanie
/// - Używana w {@link AttributeRepository} do wydajnego pobierania danych
/// - Pozwala uniknąć ładowania pełnych encji gdy potrzebne są tylko podstawowe pola
/// - Optymalizuje zapytania przez bezpośrednie mapowanie wyników na interfejs
public interface InternalAttributeWithType {
  Integer getId();
  Integer getAttributeTemplateId();
  Integer getObjectId();
  AttributeType getType();
}
