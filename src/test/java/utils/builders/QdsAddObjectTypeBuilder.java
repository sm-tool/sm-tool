package utils.builders;

import api.database.model.request.save.ObjectTypeSaveRequest;

public class QdsAddObjectTypeBuilder {

  private String title = "Default Title";
  private String description = "Default Description";
  private String color = "#FFFFFF";
  private Boolean isOnlyGlobal = false;
  private Boolean canBeUser = false;
  private Integer parentId = null;

  public QdsAddObjectTypeBuilder withTitle(String title) {
    this.title = title;
    return this;
  }

  public QdsAddObjectTypeBuilder withDescription(String description) {
    this.description = description;
    return this;
  }

  public QdsAddObjectTypeBuilder withColor(String color) {
    this.color = color;
    return this;
  }

  public QdsAddObjectTypeBuilder withIsOnlyGlobal(Boolean isOnlyGlobal) {
    this.isOnlyGlobal = isOnlyGlobal;
    return this;
  }

  public QdsAddObjectTypeBuilder withCanBeUser(Boolean canBeUser) {
    this.canBeUser = canBeUser;
    return this;
  }

  public QdsAddObjectTypeBuilder withParentId(Integer parentId) {
    this.parentId = parentId;
    return this;
  }

  public ObjectTypeSaveRequest build() {
    return new ObjectTypeSaveRequest(
      title,
      description,
      color,
      isOnlyGlobal,
      canBeUser,
      parentId
    );
  }
}
