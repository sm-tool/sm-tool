package api.database.service.core.provider;

import api.database.entity.association.AssociationType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.domain.association.InternalAssociationIdWithObjectTypes;
import api.database.model.domain.association.InternalAssociationObjectTypes;
import api.database.model.exception.ApiException;
import api.database.model.response.PossibleAssociationResponse;
import api.database.repository.association.AssociationTypeRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AssociationTypeProvider {

  private final AssociationTypeRepository associationTypeRepository;
  private final ObjectTypeProvider objectTypeProvider;

  @Autowired
  public AssociationTypeProvider(
    AssociationTypeRepository associationTypeRepository,
    ObjectTypeProvider objectTypeProvider
  ) {
    this.associationTypeRepository = associationTypeRepository;
    this.objectTypeProvider = objectTypeProvider;
  }

  //--------------------------------------------------Pobieranie typów asocjacji---------------------------------------------------------

  public List<AssociationType> getByObjectType(Integer objectTypeId) {
    Integer[] types = prepareObjectTypeIdsForGet(objectTypeId, true);
    return associationTypeRepository.getByObjectTypes(types);
  }

  public List<PossibleAssociationResponse> getAvailableAssociationTypes(
    Integer selectedObjectTypeId,
    Integer[] availableObjectTypes,
    Integer[] availableObjects,
    Integer scenarioId
  ) {
    return associationTypeRepository.getAvailableAssociationTypesWithObjects(
      selectedObjectTypeId,
      availableObjectTypes,
      availableObjects,
      scenarioId
    );
  }

  /// Znajduje typ asocjacji po id.
  ///
  /// @param id identyfikator typu asocjacji
  /// @return optional z typem asocjacji
  public AssociationType findById(Integer id) {
    return associationTypeRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.ASSOCIATION_TYPE,
          HttpStatus.NOT_FOUND
        )
      );
  }

  /// Przygotowuje listę typów obiektów do weryfikacji asocjacji.
  /// Przy hierarchical=true dodaje też typy nadrzędne.
  ///
  /// @param objectTypeId typ obiektu (lub null)
  /// @param hierarchical czy uwzględniać hierarchię
  /// @return null lub tablica typów (z przodkami przy hierarchical=true)
  private Integer[] prepareObjectTypeIdsForGet(
    Integer objectTypeId,
    Boolean hierarchical
  ) {
    if (objectTypeId == null) {
      return null;
    }
    List<Integer> result = new ArrayList<>(List.of(objectTypeId));
    if (Boolean.TRUE.equals(hierarchical)) {
      result.addAll(objectTypeProvider.getTypeAncestors(objectTypeId));
    }
    return result.toArray(new Integer[0]);
  }

  /// Pobiera stronę z typami asocjacji spełniającymi kryteria.
  ///
  /// @param pageable parametry stronicowania
  /// @param scenarioId id scenariusza
  /// @param firstObjectTypeId typ pierwszego obiektu (lub null)
  /// @param secondObjectTypeId typ drugiego obiektu (lub null)
  /// @param hierarchical czy uwzględniać hierarchię typów
  /// @return strona z pasującymi typami asocjacji
  /// @throws ApiException gdy hierarchical=true a brak typów obiektów
  public Page<AssociationType> getAssociationTypes(
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

  public Page<AssociationType> findByDescriptionContaining(
    String description,
    Pageable pageable
  ) {
    return associationTypeRepository.findByDescriptionContaining(
      description,
      pageable
    );
  }

  public Page<AssociationType> findByFirstObjectTypeId(
    Integer typeId,
    Pageable pageable
  ) {
    return associationTypeRepository.findByFirstObjectTypeId(typeId, pageable);
  }

  public Page<AssociationType> findBySecondObjectTypeId(
    Integer typeId,
    Pageable pageable
  ) {
    return associationTypeRepository.findBySecondObjectTypeId(typeId, pageable);
  }

  public Page<AssociationType> findAll(Pageable pageable) {
    return associationTypeRepository.findAll(pageable);
  }

  public Map<
    Integer,
    InternalAssociationObjectTypes
  > getAssociationTypesObjectTypes(List<Integer> associationTypeIds) {
    return associationTypeRepository
      .getAssociationTypesObjectTypes(
        associationTypeIds.toArray(new Integer[0])
      )
      .stream()
      .collect(
        Collectors.toMap(
          InternalAssociationIdWithObjectTypes::getId,
          InternalAssociationObjectTypes::from
        )
      );
  }
}
