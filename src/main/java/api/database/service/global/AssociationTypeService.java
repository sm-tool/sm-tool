package api.database.service.global;

import api.database.entity.association.AssociationType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.create.AssociationTypeCreateRequest;
import api.database.model.request.update.AssociationTypeUpdateRequest;
import api.database.repository.association.AssociationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/// Serwis zarządzający typami asocjacji w systemie.
/// Odpowiada za:
/// - Pobieranie typów asocjacji z uwzględnieniem hierarchii typów obiektów
/// - Tworzenie nowych typów asocjacji
/// - Usuwanie typów asocjacji
/// - Walidację typów obiektów w asocjacjach
@Service
public class AssociationTypeService {

  private final AssociationTypeRepository associationTypeRepository;

  @Autowired
  public AssociationTypeService(
    AssociationTypeRepository associationTypeRepository
  ) {
    this.associationTypeRepository = associationTypeRepository;
  }

  //--------------------------------------------------Dodanie typów asocjacji---------------------------------------------------------

  /// Tworzy nowy typ asocjacji.
  ///
  /// @param associationInfo dane nowego typu asocjacji
  /// @return utworzony typ asocjacji
  @Transactional
  public AssociationType addAssociationType(
    AssociationTypeCreateRequest associationInfo
  ) {
    return associationTypeRepository.save(
      AssociationType.create(associationInfo)
    );
  }

  //--------------------------------------------------Usuwanie typów asocjacji---------------------------------------------------------
  /// Usuwa typ asocjacji.
  ///
  /// @param id identyfikator typu do usunięcia
  @Transactional
  public void deleteById(Integer id) {
    associationTypeRepository.deleteById(id);
  }

  //-------------------------------------------------Aktualizacja description-----------------------------------------------------------
  /// Aktualizuje opis istniejącego typu asocjacji na podstawie jego ID.
  ///
  /// @param id identyfikator typu asocjacji do zaktualizowania
  /// @param updatedAssociationType obiekt zawierający zaktualizowane dane (tylko opis)
  /// @return zaktualizowany obiekt AssociationType
  @Transactional
  public AssociationType updateAssociationType(
    Integer id,
    AssociationTypeUpdateRequest updatedAssociationType
  ) {
    AssociationType existingAssociationType = associationTypeRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.ASSOCIATION_TYPE,
          HttpStatus.NOT_FOUND
        )
      );
    existingAssociationType.setDescription(
      updatedAssociationType.description()
    );
    return associationTypeRepository.save(existingAssociationType);
  }
}
