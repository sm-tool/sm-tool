package api.database.service.object;

import api.database.entity.object.QdsAttribute;
import api.database.entity.object.QdsAttributeChange;
import api.database.model.constant.QdsAttributeType;
import api.database.model.event.QdsInfoAttributeChange;
import api.database.model.object.QdsDataAttribute;
import api.database.repository.attribute.QdsAttributeChangeRepository;
import api.database.repository.attribute.QdsAttributeRepository;
import api.database.service.template.AttributeTemplateService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/// Serwis zarządzający atrybutami obiektów i ich zmianami. Odpowiada za:
/// - Dodawanie nowych atrybutów do obiektów
/// - Zarządzanie zmianami wartości atrybutów w czasie
/// - Walidację typów i wartości atrybutów
@Service
public class AttributeService {

  private final QdsAttributeRepository qdsAttributeRepository;
  private final QdsAttributeChangeRepository qdsAttributeChangeRepository;
  private final AttributeTemplateService attributeTemplateService;

  @Autowired
  public AttributeService(
    QdsAttributeRepository qdsAttributeRepository,
    QdsAttributeChangeRepository qdsAttributeChangeRepository,
    AttributeTemplateService attributeTemplateService
  ) {
    this.qdsAttributeRepository = qdsAttributeRepository;
    this.qdsAttributeChangeRepository = qdsAttributeChangeRepository;
    this.attributeTemplateService = attributeTemplateService;
  }

  /// Pobiera historię zmian atrybutów dla wskazanych eventów.
  ///
  /// @param eventIds lista identyfikatorów eventów
  /// @return lista zmian atrybutów
  public List<QdsAttributeChange> getAttributeChangesForEvents(
    List<Integer> eventIds
  ) {
    return qdsAttributeChangeRepository.getEventsAttributeChanges(eventIds);
  }

  //--------------------------------------------------Dodawanie atrybutów---------------------------------------------------------

  //TODO sprawdzić
  /// Dodaje nowe atrybuty do obiektu.
  /// Weryfikuje poprawność wartości początkowych względem typu atrybutu.
  ///
  /// @param objectId identyfikator obiektu
  /// @param attributesData lista danych atrybutów do dodania
  /// @apiNote Operacja dołączana do transakcji nadrzędnej, jeśli istnieje,
  ///          w przeciwnym razie wykonywana w ramach własnej transakcji
  @Transactional
  public void addAttributes(
    Integer objectId,
    List<QdsDataAttribute> attributesData
  ) {
    for (QdsDataAttribute attributeData : attributesData) {
      QdsAttributeType type = qdsAttributeRepository.getAttributeType(
        attributeData.attributeTemplateId()
      );
      attributeTemplateService.checkAttributeValue(
        type,
        attributeData.initialValue()
      );
      QdsAttribute attribute = new QdsAttribute(
        null,
        objectId,
        attributeData.attributeTemplateId(),
        attributeData.initialValue(),
        null,
        null
      );
      qdsAttributeRepository.save(attribute);
    }
  }

  //--------------------------------------------------Dodawanie zmian atrubutów------------------------------------------------------

  //TODO sprawdzić
  /// Dodaje zmianę wartości atrybutu w kontekście eventu.
  /// Weryfikuje zgodność nowej wartości z typem atrybutu.
  ///
  /// @param attributeChange dane zmiany atrybutu
  /// @param eventId identyfikator eventu
  /// @apiNote Operacja wykonywana w ramach transakcji nadrzędnej - dodawaniu akcji
  public void addAttributeChange(
    QdsInfoAttributeChange attributeChange,
    Integer eventId
  ) {
    QdsAttributeType type = qdsAttributeRepository.getAttributeType(
      attributeChange.attributeId()
    );
    attributeTemplateService.checkAttributeValue(type, attributeChange.value());
    qdsAttributeChangeRepository.save(
      new QdsAttributeChange(
        null,
        attributeChange.attributeId(),
        eventId,
        attributeChange.value(),
        null,
        null
      )
    );
  }
}
