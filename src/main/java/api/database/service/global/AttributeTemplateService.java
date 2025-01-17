package api.database.service.global;

import api.database.entity.object.AttributeTemplate;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.model.request.create.AttributeTemplateCreateRequest;
import api.database.model.request.update.AttributeTemplateUpdateRequest;
import api.database.repository.attribute.AttributeTemplateRepository;
import api.database.service.core.AttributeAdder;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/// Serwis zarządzający szablonami atrybutów obiektów.
/// Umożliwia tworzenie, modyfikację i usuwanie szablonów atrybutów,
/// oraz automatyczne dodawanie atrybutów do istniejących obiektów
/// przy rozszerzaniu szablonu.
@Service
public class AttributeTemplateService {

  private final AttributeTemplateRepository attributeTemplateRepository;
  private final AttributeAdder attributeAdder;

  @Autowired
  public AttributeTemplateService(
    AttributeTemplateRepository attributeTemplateRepository,
    AttributeAdder attributeAdder
  ) {
    this.attributeTemplateRepository = attributeTemplateRepository;
    this.attributeAdder = attributeAdder;
  }

  //---------------------------------------------------Dodawanie atrybutów szablonów--------------------------------------------------------
  /// Dodaje nowy szablon atrybutu i dodaje atrybuty
  /// dla obiektów bazujących na danym szablonie obiektu do którego należy
  /// szablon atrybutu.
  ///
  /// @param attributeTemplateInfo dane nowego szablonu atrybutu
  /// @return utworzony szablon atrybutu
  /// @apiNote Dodaje atrybut do wszystkich istniejących obiektów danego szablonu
  @Transactional
  public AttributeTemplate addAttributeTemplate(
    AttributeTemplateCreateRequest attributeTemplateInfo
  ) {
    AttributeTemplate attributeTemplate = attributeTemplateRepository.save(
      AttributeTemplate.create(attributeTemplateInfo)
    );

    attributeAdder.addAttributeToObjectsUsingTemplate(
      attributeTemplate.getId(),
      attributeTemplate.getObjectTemplateId(),
      attributeTemplate.getDefaultValue()
    );
    return attributeTemplate;
  }

  @Transactional
  public AttributeTemplate updateAttributeTemplate(
    Integer id,
    AttributeTemplateUpdateRequest attributeTemplateInfo
  ) {
    AttributeTemplate attributeTemplate = attributeTemplateRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          List.of(id.toString()),
          ErrorGroup.ATTRIBUTE_TEMPLATE,
          HttpStatus.NOT_FOUND
        )
      );
    attributeTemplate.setName(attributeTemplateInfo.name());
    attributeTemplate.setDefaultValue(attributeTemplateInfo.defaultValue());
    return attributeTemplateRepository.save(attributeTemplate);
  }

  /// Usuwa szablon atrybutu i powiązane atrybuty obiektów.
  ///
  /// @param id id szablonu atrybutu do usunięcia
  /// @apiNote Usuwa kaskadowo atrybuty ze wszystkich obiektów
  @Transactional
  public void deleteAttributeTemplate(Integer id) {
    attributeTemplateRepository.deleteById(id);
  }
}
