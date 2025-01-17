package utils.builders;

import api.database.model.constant.AttributeType;
import api.database.model.request.create.AttributeTemplateCreateRequest;

public class QdsAddAttributeTemplateBuilder {

  private Integer objectTemplateId = 1;
  private String name = "Default Name";
  private AttributeType type = AttributeType.STRING;
  private String defaultValue = "Default Value";
  private String unit = "Unit";

  public QdsAddAttributeTemplateBuilder withObjectTemplateId(
    Integer objectTemplateId
  ) {
    this.objectTemplateId = objectTemplateId;
    return this;
  }

  public QdsAddAttributeTemplateBuilder withName(String name) {
    this.name = name;
    return this;
  }

  public QdsAddAttributeTemplateBuilder withDefaultValue(AttributeType type) {
    this.type = type;
    return this;
  }

  public QdsAddAttributeTemplateBuilder withUnit(AttributeType type) {
    this.type = type;
    return this;
  }

  public QdsAddAttributeTemplateBuilder withType(AttributeType type) {
    this.type = type;
    return this;
  }

  public AttributeTemplateCreateRequest build() {
    return new AttributeTemplateCreateRequest(
      objectTemplateId,
      name,
      defaultValue,
      unit,
      type
    );
  }
}
