package api.database.service.template;

import api.database.entity.object.QdsAttributeTemplate;
import api.database.entity.object.QdsObjectTemplate;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.QdsAttributeType;
import api.database.model.exception.ApiException;
import api.database.model.object.QdsInfoAddAttributeTemplate;
import api.database.repository.attribute.QdsAttributeTemplateRepository;
import api.database.repository.object.QdsObjectTemplateRepository;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

//TODO rozbić
@Service
public class AttributeTemplateService {

  private final QdsAttributeTemplateRepository qdsAttributeTemplateRepository;
  private final QdsObjectTemplateRepository qdsObjectTemplateRepository;

  @Autowired
  public AttributeTemplateService(
    QdsAttributeTemplateRepository qdsAttributeTemplateRepository,
    QdsObjectTemplateRepository qdsObjectTemplateRepository
  ) {
    this.qdsAttributeTemplateRepository = qdsAttributeTemplateRepository;
    this.qdsObjectTemplateRepository = qdsObjectTemplateRepository;
  }

  //---------------------------------------------------Weryfikacja warunków--------------------------------------------------------
  //TODO sprawdzić
  /** Funkcja weryfikująca zgodność wartości atrybutu z jej typem
   * @apiNote Wykonywana w ramach transakcji "nadrzędnej"
   */
  public void checkAttributeValue(QdsAttributeType type, String value) {
    if (type == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.ATTRIBUTE_TEMPLATE,
      HttpStatus.BAD_REQUEST
    );

    switch (type) {
      case STRING:
        break;
      case INT:
        try {
          Integer.parseInt(value);
        } catch (NumberFormatException e) {
          throw new ApiException(
            ErrorCode.WRONG_VALUE_FORMAT,
            List.of("INT"),
            ErrorGroup.ATTRIBUTE,
            HttpStatus.BAD_REQUEST
          );
        }
        break;
      case DATE:
        try {
          Instant.parse(value);
        } catch (DateTimeParseException e) {
          throw new ApiException(
            ErrorCode.WRONG_VALUE_FORMAT,
            List.of("DATE"),
            ErrorGroup.ATTRIBUTE,
            HttpStatus.BAD_REQUEST
          );
        }
        break;
    }
  }

  //---------------------------------------------------Dodawanie atrybutów szablonów--------------------------------------------------------

  @Transactional
  public Integer addAttributeTemplate(
    QdsInfoAddAttributeTemplate objectTemplateAttribute,
    Integer templateId
  ) {
    QdsObjectTemplate qdsObjectTemplate = qdsObjectTemplateRepository
      .findById(templateId)
      .orElseThrow(() ->
        new RuntimeException("Object template not found with id: " + templateId)
      );

    QdsAttributeTemplate qdsAttributeTemplate = new QdsAttributeTemplate(
      null,
      qdsObjectTemplate.getId(),
      objectTemplateAttribute.name(),
      objectTemplateAttribute.type(),
      null
    );

    QdsAttributeTemplate savedQdsObjectTemplate =
      qdsAttributeTemplateRepository.save(qdsAttributeTemplate);

    return savedQdsObjectTemplate.getId();
  }

  public QdsAttributeTemplate getOneAttributeTemplate(
    Integer templateAttributeId
  ) {
    return qdsAttributeTemplateRepository
      .findById(templateAttributeId)
      .orElseThrow(() ->
        new RuntimeException(
          "Template attribute not found with id: " + templateAttributeId
        )
      );
  }

  public List<QdsAttributeTemplate> getAllAttributeTemplates() {
    return qdsAttributeTemplateRepository.findAll();
  }

  public List<QdsAttributeTemplate> getAttributeTemplates(Integer templateId) {
    return qdsAttributeTemplateRepository.findAllByTemplateId(templateId);
  }

  public void deleteAttributeTemplates(Integer id) {
    qdsAttributeTemplateRepository.deleteById(id);
  }
}
