package api.database.service.core.provider;

import api.database.entity.object.AttributeTemplate;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.attribute.AttributeTemplateRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class AttributeTemplateProvider {

  private final AttributeTemplateRepository attributeTemplateRepository;

  @Autowired
  public AttributeTemplateProvider(
    AttributeTemplateRepository attributeTemplateRepository
  ) {
    this.attributeTemplateRepository = attributeTemplateRepository;
  }

  /// Pobiera szablon atrybutu po id.
  ///
  /// @param templateAttributeId id szablonu atrybutu
  /// @return szablon atrybutu
  /// @throws ApiException gdy szablon nie istnieje
  public AttributeTemplate getOneAttributeTemplate(
    Integer templateAttributeId
  ) {
    return attributeTemplateRepository
      .findById(templateAttributeId)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.ATTRIBUTE_TEMPLATE,
          HttpStatus.BAD_REQUEST
        )
      );
  }

  /// Pobiera wszystkie szablony atrybutów dla szablonu obiektu.
  ///
  /// @param templateId id szablonu obiektu
  /// @return lista szablonów atrybutów
  public List<AttributeTemplate> getAttributeTemplates(Integer templateId) {
    return attributeTemplateRepository.findAllByTemplateId(templateId);
  }
}
