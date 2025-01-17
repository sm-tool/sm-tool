package api.database.service.core;

import api.database.entity.object.Attribute;
import api.database.entity.object.AttributeChange;
import api.database.entity.object.AttributeTemplate;
import api.database.model.domain.object.InternalObjectInstance;
import api.database.repository.attribute.AttributeChangeRepository;
import api.database.repository.attribute.AttributeRepository;
import api.database.service.core.provider.AttributeTemplateProvider;
import api.database.service.core.provider.ObjectInstanceProvider;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AttributeAdder {

  private final ObjectInstanceProvider objectInstanceProvider;
  private final AttributeRepository attributeRepository;
  private final AttributeTemplateProvider attributeTemplateProvider;
  // Wymuszenie wprowadzenia zmian
  private final AttributeChangeRepository attributeChangeRepository;

  @Autowired
  public AttributeAdder(
    ObjectInstanceProvider objectInstanceProvider,
    AttributeRepository attributeRepository,
    AttributeTemplateProvider attributeTemplateProvider,
    AttributeChangeRepository attributeChangeRepository
  ) {
    this.objectInstanceProvider = objectInstanceProvider;
    this.attributeRepository = attributeRepository;
    this.attributeTemplateProvider = attributeTemplateProvider;
    this.attributeChangeRepository = attributeChangeRepository;
  }

  public void addDefaultAttributes(
    Integer objectId,
    Integer templateId,
    Integer eventId
  ) {
    List<AttributeTemplate> attributeTemplates =
      attributeTemplateProvider.getAttributeTemplates(templateId);

    List<Attribute> attributes = attributeTemplates
      .stream()
      .map(a -> Attribute.from(objectId, a.getId()))
      .toList();

    attributes = attributeRepository.saveAll(attributes);

    // Tworzenie mapy szablonów dla łatwego dostępu do defaultValue
    Map<Integer, String> templateDefaultValues = attributeTemplates
      .stream()
      .collect(
        Collectors.toMap(
          AttributeTemplate::getId,
          AttributeTemplate::getDefaultValue
        )
      );

    List<AttributeChange> changes = attributes
      .stream()
      .map(attribute ->
        AttributeChange.createWithDefault(
          attribute.getId(),
          eventId,
          templateDefaultValues.get(attribute.getAttributeTemplateId())
        )
      )
      .toList();

    attributeChangeRepository.saveAll(changes);
  }

  public void addAttributeToObjectsUsingTemplate(
    Integer attributeTemplateId,
    Integer objectTemplateId,
    String defaultValue
  ) {
    List<InternalObjectInstance> objects =
      objectInstanceProvider.getObjectsUsingTemplate(objectTemplateId);

    List<Attribute> attributes = objects
      .stream()
      .map(o -> Attribute.from(o.getId(), attributeTemplateId))
      .toList();

    attributes = attributeRepository.saveAll(attributes);

    attributeChangeRepository.addMultipleChanges(
      attributes.stream().map(Attribute::getObjectId).toArray(Integer[]::new),
      attributes.stream().map(Attribute::getId).toArray(Integer[]::new),
      defaultValue
    );
  }
}
