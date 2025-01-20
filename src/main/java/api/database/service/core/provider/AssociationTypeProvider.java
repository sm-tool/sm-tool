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
import java.util.Arrays;
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

  public List<PossibleAssociationResponse> getAvailableAssociationTypes(
    Integer selectedObjectTypeId,
    Integer[] availableObjectTypes,
    Integer[] availableObjects
  ) {
    System.out.println(selectedObjectTypeId);
    System.out.println(Arrays.toString(availableObjectTypes));
    System.out.println(Arrays.toString(availableObjects));
    return associationTypeRepository.getAvailableAssociationTypesWithObjects(
      selectedObjectTypeId,
      availableObjectTypes,
      availableObjects
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

  public Page<AssociationType> findByDescriptionContaining(
    String description,
    Pageable pageable,
    Integer scenarioId
  ) {
    return scenarioId == null
      ? associationTypeRepository.findByDescriptionContaining(
        description,
        pageable
      )
      : associationTypeRepository.findByDescriptionContainingAndScenarioId(
        description,
        scenarioId,
        pageable
      );
  }

  public Page<AssociationType> findByFirstObjectTypeId(
    Integer typeId,
    Pageable pageable,
    Integer scenarioId
  ) {
    return scenarioId == null
      ? associationTypeRepository.findByFirstObjectTypeId(typeId, pageable)
      : associationTypeRepository.findByFirstObjectTypeIdAndScenarioId(
        typeId,
        scenarioId,
        pageable
      );
  }

  public Page<AssociationType> findBySecondObjectTypeId(
    Integer typeId,
    Pageable pageable,
    Integer scenarioId
  ) {
    return scenarioId == null
      ? associationTypeRepository.findBySecondObjectTypeId(typeId, pageable)
      : associationTypeRepository.findBySecondObjectTypeIdAndScenarioId(
        typeId,
        scenarioId,
        pageable
      );
  }

  public Page<AssociationType> findAll(Pageable pageable, Integer scenarioId) {
    return scenarioId == null
      ? associationTypeRepository.findAll(pageable)
      : associationTypeRepository.findAllByScenarioId(scenarioId, pageable);
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
