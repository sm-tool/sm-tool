package api.database.service.core.provider;

import api.database.entity.object.AttributeChange;
import api.database.model.data.EventAssociationsStateData;
import api.database.model.domain.association.InternalEventAssociationChange;
import api.database.model.domain.association.InternalLastAssociationChange;
import api.database.model.domain.attribute.InternalLastAttributeChange;
import api.database.model.response.EventAttributesStateResponse;
import api.database.repository.association.AssociationChangeRepository;
import api.database.repository.attribute.AttributeChangeRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EventStateProvider {

  private final AttributeChangeRepository attributeChangeRepository;
  private final AssociationChangeRepository associationChangeRepository;

  @Autowired
  public EventStateProvider(
    AttributeChangeRepository attributeChangeRepository,
    AssociationChangeRepository associationChangeRepository
  ) {
    this.attributeChangeRepository = attributeChangeRepository;
    this.associationChangeRepository = associationChangeRepository;
  }

  /// Pobiera historię zmian atrybutów dla wskazanych eventów.
  ///
  /// @param eventIds lista identyfikatorów eventów
  /// @return lista zmian atrybutów
  public List<AttributeChange> getAttributeChangesForEvents(
    List<Integer> eventIds
  ) {
    return attributeChangeRepository.getEventsAttributeChanges(
      eventIds.toArray(new Integer[0])
    );
  }

  /// Pobiera ostatnie znane wartości dla eventów w scenariuszu
  public List<InternalLastAttributeChange> getLastAttributeChanges(
    List<Integer> eventIds
  ) {
    return attributeChangeRepository.getLastAttributeChanges(
      eventIds.toArray(new Integer[0])
    );
  }

  public List<EventAttributesStateResponse> getEventAttributeState(
    Integer eventId,
    Integer scenarioId
  ) {
    return attributeChangeRepository.getAttributesStateForEvent(
      eventId,
      scenarioId
    );
  }

  /// Pobiera zmiany asocjacji dla podanych eventów.
  ///
  /// @param eventIds lista identyfikatorów eventów
  /// @return lista zmian asocjacji wraz z kontekstem eventu
  public List<InternalEventAssociationChange> getAssociationChangesForEvents(
    List<Integer> eventIds
  ) {
    return associationChangeRepository.getAssociationChanges(
      eventIds.toArray(new Integer[0])
    );
  }

  public List<InternalLastAssociationChange> getLastAssociationChanges(
    List<Integer> eventIds
  ) {
    return associationChangeRepository.getLastAssociationChanges(
      eventIds.toArray(new Integer[0])
    );
  }

  public List<EventAssociationsStateData> getEventAssociationState(
    Integer eventId,
    Integer scenarioId
  ) {
    return associationChangeRepository.getAssociationsStateForEvent(
      eventId,
      scenarioId
    );
  }

  public List<EventAssociationsStateData> getEventPreviousAssociationState(
    Integer eventId,
    Integer scenarioId
  ) {
    return associationChangeRepository.getAssociationsPreviousStateForEvent(
      eventId,
      scenarioId
    );
  }

  public List<EventAttributesStateResponse> getEventPreviousAttributeState(
    Integer eventId,
    Integer scenarioId
  ) {
    return attributeChangeRepository.getAttributesPreviousStateForEvent(
      eventId,
      scenarioId
    );
  }
}
