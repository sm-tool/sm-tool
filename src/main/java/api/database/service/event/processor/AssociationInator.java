package api.database.service.event.processor;

import api.database.entity.association.Association;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.data.AssociationChangeData;
import api.database.model.domain.association.InternalAssociationKey;
import api.database.model.domain.association.InternalAssociationKeyWithId;
import api.database.model.domain.association.InternalAssociationObjectTypes;
import api.database.model.exception.ApiException;
import api.database.repository.association.AssociationRepository;
import api.database.service.core.ObjectTypeManager;
import api.database.service.core.provider.AssociationTypeProvider;
import api.database.service.core.provider.ObjectInstanceProvider;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Procesor asocjacji obiektów odpowiadający za:
/// - Pobieranie istniejących asocjacji na podstawie kluczy
/// - Tworzenie nowych asocjacji z walidacją typów
/// - Weryfikację zgodności typów obiektów w asocjacjach
@Component
public class AssociationInator {

  private final AssociationRepository associationRepository;
  private final ObjectInstanceProvider objectInstanceProvider;
  private final AssociationTypeProvider associationTypeProvider;
  private final ObjectTypeManager objectTypeManager;

  @Autowired
  public AssociationInator(
    AssociationRepository associationRepository,
    ObjectInstanceProvider objectInstanceProvider,
    AssociationTypeProvider associationTypeProvider,
    ObjectTypeManager objectTypeManager
  ) {
    this.associationRepository = associationRepository;
    this.objectInstanceProvider = objectInstanceProvider;
    this.associationTypeProvider = associationTypeProvider;
    this.objectTypeManager = objectTypeManager;
  }

  /// Pobiera istniejące asocjacje na podstawie zadanego zbioru zmian.
  /// Mapuje klucze asocjacji (typ + obiekty) na ich identyfikatory.
  ///
  /// @param toAdd zbiór zmian do sprawdzenia
  /// @return mapa kluczy asocjacji na ich identyfikatory
  Map<InternalAssociationKey, Integer> getExisting(
    Set<AssociationChangeData> toAdd
  ) {
    Set<InternalAssociationKey> keys = toAdd
      .stream()
      .map(InternalAssociationKey::from)
      .collect(Collectors.toSet());

    return associationRepository
      .getAssociationsByKeys(
        keys
          .stream()
          .map(InternalAssociationKey::associationTypeId)
          .toArray(Integer[]::new),
        keys
          .stream()
          .map(InternalAssociationKey::object1Id)
          .toArray(Integer[]::new),
        keys
          .stream()
          .map(InternalAssociationKey::object2Id)
          .toArray(Integer[]::new)
      )
      .stream()
      .collect(
        Collectors.toMap(
          InternalAssociationKey::from,
          InternalAssociationKeyWithId::getAssociationId
        )
      );
  }

  /// Tworzy nowe asocjacje dla zmian nieistniejących w systemie.
  /// Proces obejmuje:
  /// 1. Filtrację zmian do tych nieistniejących
  /// 2. Walidację zgodności typów obiektów
  /// 3. Zapis nowych asocjacji w bazie
  ///
  /// @param toAdd zbiór wszystkich zmian
  /// @param existing mapa istniejących asocjacji
  /// @return mapa nowo utworzonych asocjacji (klucz -> id)
  Map<InternalAssociationKey, Integer> createNew(
    Set<AssociationChangeData> toAdd,
    Map<InternalAssociationKey, Integer> existing
  ) {
    Set<AssociationChangeData> newOnes = toAdd
      .stream()
      .filter(change ->
        !existing.containsKey(InternalAssociationKey.from(change))
      )
      .collect(Collectors.toSet());

    if (newOnes.isEmpty()) {
      return Map.of();
    }

    checkTypeCompatibility(newOnes); // walidacja typów dla nowych

    return associationRepository
      .saveAllAndFlush(
        newOnes.stream().map(Association::from).collect(Collectors.toList())
      )
      .stream()
      .collect(
        Collectors.toMap(InternalAssociationKey::from, Association::getId)
      );
  }

  /// Weryfikuje zgodność typów obiektów z wymaganiami typu asocjacji.
  /// Sprawdza czy:
  /// - Typ pierwszego obiektu jest zgodny z pierwszym wymaganym typem
  /// - Typ drugiego obiektu jest zgodny z drugim wymaganym typem
  /// Uwzględnia hierarchię typów obiektów.
  ///
  /// @param newOnes zbiór nowych asocjacji do walidacji
  /// @throws ApiException gdy wykryto niezgodność typów
  void checkTypeCompatibility(Set<AssociationChangeData> newOnes) {
    // Pobierz typy dla wszystkich obiektów
    List<Integer> allObjectIds = new ArrayList<>();
    allObjectIds.addAll(
      newOnes.stream().map(AssociationChangeData::object1Id).toList()
    );
    allObjectIds.addAll(
      newOnes.stream().map(AssociationChangeData::object2Id).toList()
    );

    Map<Integer, Integer> objectTypes = objectInstanceProvider.getObjectTypes(
      allObjectIds
    );

    // Pobierz wymagane typy dla wszystkich typów asocjacji
    Map<Integer, InternalAssociationObjectTypes> associationTypes =
      associationTypeProvider.getAssociationTypesObjectTypes(
        newOnes.stream().map(AssociationChangeData::associationTypeId).toList()
      );

    // Zweryfikuj każdą parę obiektów z jej typem asocjacji
    for (AssociationChangeData one : newOnes) {
      Integer obj1Type = objectTypes.get(one.object1Id());
      Integer obj2Type = objectTypes.get(one.object2Id());
      InternalAssociationObjectTypes assocType = associationTypes.get(
        one.associationTypeId()
      );

      if (
        !objectTypeManager.checkIfTypesAreInHierarchy(
          assocType.firstObjectTypeId(),
          obj1Type
        ) ||
        !objectTypeManager.checkIfTypesAreInHierarchy(
          assocType.secondObjectTypeId(),
          obj2Type
        )
      ) {
        throw new ApiException(
          ErrorCode.INCOMPATIBLE_TYPES,
          ErrorGroup.ASSOCIATION_TYPE,
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }
}
