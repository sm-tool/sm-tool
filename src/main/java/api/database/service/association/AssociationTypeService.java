package api.database.service.association;

import api.database.entity.association.QdsAssociationType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.association.QdsAssociationTypeRepository;
import api.database.service.core.ObjectTypeOperations;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssociationTypeService {

  private final QdsAssociationTypeRepository associationTypeRepository;
  private final ObjectTypeOperations objectTypeOperations;

  @Autowired
  public AssociationTypeService(
    QdsAssociationTypeRepository associationTypeRepository,
    ObjectTypeOperations objectTypeOperations
  ) {
    this.associationTypeRepository = associationTypeRepository;
    this.objectTypeOperations = objectTypeOperations;
  }

  //--------------------------------------------------Weryfikacja warunków---------------------------------------------------------

  //--------------------------------------------------Pobieranie typów asocjacji---------------------------------------------------------

  public Optional<QdsAssociationType> findById(Integer id) {
    return associationTypeRepository.findById(id);
  }

  //--------------------------------------------------Dodanie typów asocjacji---------------------------------------------------------

  @Transactional
  public QdsAssociationType createAssociationType(
    QdsAssociationType associationType
  ) {
    if (associationType.getId() != null) throw new ApiException(
      ErrorCode.WRONG_ENDPOINT,
      ErrorGroup.ASSOCIATION_TYPE,
      HttpStatus.BAD_REQUEST
    );
    return associationTypeRepository.save(associationType);
  }

  public void deleteById(Integer id) {
    associationTypeRepository.deleteById(id);
  }

  /**
   * Funkcja przygotowująca typy obiektów pod sprawdzenie typów asocjacji
   * @param objectTypeId typ obiektu (może być null)
   * @param hierarchical czy sprawdzanie hierarchiczne
   * @return {@code null} (dla null objectTypeId) lub {@code Integer[]} id typów obiektów,
   * zawierająca 1 element (dla wyłączonej hierarchizacji lub typu najwyższego poziomu) albo więcej
   */
  private Integer[] prepareObjectTypeIdsForGet(
    Integer objectTypeId,
    Boolean hierarchical
  ) {
    if (objectTypeId == null) {
      return null;
    }
    List<Integer> result = new ArrayList<>(List.of(objectTypeId));
    if (Boolean.TRUE.equals(hierarchical)) {
      result.addAll(objectTypeOperations.getTypeAncestors(objectTypeId));
    }
    return result.toArray(new Integer[0]);
  }

  /**
   * Funkcja zwracająca typy asocjacji w stronach
   * @param pageable informacje o stronie
   * @param scenarioId id scenariusza
   * @param firstObjectTypeId typ pierwszego obiektu (lub null)
   * @param secondObjectTypeId typ drugiego obiektu (lub null)
   * @param hierarchical informacja o przeszukiwaniu także typów asocjacji dla przodków
   *                     (lub null w przypadku braku firstObjectTypeId i secondObjectTypeId)
   * @return {@code Page<QdsAssociationType>}
   */
  public Page<QdsAssociationType> getAssociationTypes(
    Pageable pageable,
    Integer scenarioId,
    Integer firstObjectTypeId,
    Integer secondObjectTypeId,
    Boolean hierarchical
  ) {
    if (
      firstObjectTypeId == null &&
      secondObjectTypeId == null &&
      hierarchical != null
    ) throw new ApiException(
      ErrorCode.INCOMPATIBLE_TYPES,
      ErrorGroup.ASSOCIATION_TYPE,
      HttpStatus.BAD_REQUEST
    );
    Integer[] firstObjectTypesId = prepareObjectTypeIdsForGet(
      firstObjectTypeId,
      hierarchical
    );
    Integer[] secondObjectTypesId = prepareObjectTypeIdsForGet(
      secondObjectTypeId,
      hierarchical
    );
    return associationTypeRepository.findAssociationTypes(
      pageable,
      scenarioId,
      firstObjectTypesId,
      secondObjectTypesId
    );
  }
}
