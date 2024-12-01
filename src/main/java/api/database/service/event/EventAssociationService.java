package api.database.service.event;

import api.database.entity.association.QdsAssociation;
import api.database.entity.association.QdsAssociationChange;
import api.database.model.association.QdsInfoAssociationChange;
import api.database.model.internal.association.QdsInternalAssociationChangeEvent;
import api.database.repository.association.QdsAssociationChangeRepository;
import api.database.repository.association.QdsAssociationRepository;
import api.database.service.core.AssociationOperations;
import java.util.List;
import org.springframework.stereotype.Service;

/// Serwis zarządzający asocjacjami i ich zmianami w czasie.
/// Odpowiada za tworzenie, modyfikację i usuwanie asocjacji między obiektami,
/// z uwzględnieniem ich typów i zmian w kontekście eventów.
@Service
public class EventAssociationService {

  private final QdsAssociationRepository qdsAssociationRepository;
  private final QdsAssociationChangeRepository qdsAssociationChangeRepository;
  private final AssociationOperations associationOperations;
  private final EventAssociationTypeValidation eventAssociationTypeValidation;

  public EventAssociationService(
    QdsAssociationRepository qdsAssociationRepository,
    QdsAssociationChangeRepository qdsAssociationChangeRepository,
    AssociationOperations associationOperations,
    EventAssociationTypeValidation eventAssociationTypeValidation
  ) {
    this.qdsAssociationRepository = qdsAssociationRepository;
    this.qdsAssociationChangeRepository = qdsAssociationChangeRepository;
    this.associationOperations = associationOperations;
    this.eventAssociationTypeValidation = eventAssociationTypeValidation;
  }

  /// Pobiera zmiany asocjacji dla podanych eventów.
  ///
  /// @param eventIds lista identyfikatorów eventów
  /// @return lista zmian asocjacji wraz z kontekstem eventu
  public List<QdsInternalAssociationChangeEvent> getAssociationChangesForEvents(
    List<Integer> eventIds
  ) {
    return qdsAssociationChangeRepository.getAssociationChanges(eventIds);
  }

  //TODO - zastanowić się na jakiej podstawie uruchamiać te 2 funkcje - w zmienianiu eventów będzie problem
  //--------------------------------------------------Dodawanie------------------------------------------------------------

  //TODO weryfikacja
  /// Dodaje nową zmianę asocjacji, tworząc samą asocjację, jeśli nie istnieje.
  /// Weryfikuje zgodność typów obiektów z typem asocjacji.
  /// Ignoruje dodanie, jeśli ostatnia operacja jest tego samego typu.
  ///
  /// @param info informacje o zmianie asocjacji
  /// @param eventId identyfikator eventu
  /// @apiNote Operacja wykonywana w ramach transakcji "nadrzędnej" dla dodania i zmiany akcji
  public void addAssociationChange(
    QdsInfoAssociationChange info,
    Integer eventId
  ) {
    //Pobranie asocjacji
    Integer associationId = qdsAssociationRepository.getAssociation(
      info.associationTypeId(),
      info.object1Id(),
      info.object2Id()
    );
    //Dodanie asocjacji - Może się wydarzyć tylko dla pierwszego INSERT
    if (associationId == null) {
      eventAssociationTypeValidation.checkTypeCompatibility(
        info.object1Id(),
        info.object2Id(),
        info.associationTypeId()
      );
      associationId = qdsAssociationRepository
        .save(
          new QdsAssociation(
            null,
            info.associationTypeId(),
            info.object1Id(),
            info.object2Id(),
            null,
            null,
            null
          )
        )
        .getId();
    }
    //Sprawdzenie ostatniego zdarzenia i zignorowanie dodania gdy typ operacji się powtarza
    if (
      qdsAssociationChangeRepository.getLastChangeOperationBeforeEvent(
        associationId,
        eventId
      ) ==
      info.associationOperation()
    ) return;
    //Dodanie nowej operacji
    qdsAssociationChangeRepository.save(
      new QdsAssociationChange(
        null,
        eventId,
        associationId,
        info.associationOperation(),
        null,
        null
      )
    );
  }

  //--------------------------------------------------Usuwanie---------------------------------------------------------

  //TODO sprawdzić
  /// Usuwa zmianę asocjacji oraz samą asocjację, jeśli nie ma już żadnych zmian.
  /// Usuwa również kolejny event zmiany dla danej asocjacji, jeśli istnieje (gdyż musiałby zwierać tę samą operację co poprzedni).
  ///
  /// @param info informacje o zmianie asocjacji do usunięcia
  /// @param eventId identyfikator eventu
  /// @apiNote Operacja wykonywana w ramach transakcji "nadrzędnej" dla usunięcia i zmiany akcji
  public void deleteAssociationChange(
    QdsInfoAssociationChange info,
    Integer eventId
  ) {
    //Pobranie asocjacji
    Integer associationId = qdsAssociationRepository.getAssociation(
      info.associationTypeId(),
      info.object1Id(),
      info.object2Id()
    );
    qdsAssociationChangeRepository.deleteAssociationChange(
      eventId,
      associationId
    );
    //usunięcie kolejnego eventu jeśli istnieje
    Integer nextEventId =
      qdsAssociationChangeRepository.getFirstChangeOperationAfterEvent(
        associationId,
        eventId
      );
    if (nextEventId != null) {
      qdsAssociationChangeRepository.deleteAssociationChange(
        associationId,
        nextEventId
      );
    }
    associationOperations.deleteNotUsedAssociations();
  }
}
