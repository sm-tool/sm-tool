package utils.builders;

import api.database.model.request.save.ScenarioPhaseSaveRequest;

public class ScenarioPhaseSaveRequestBuilder {

  private String title = "Default Title";
  private String description = "Default Description";
  private String color = "#FFFFFF";
  private Integer startTime = 0;
  private Integer endTime = 10;

  public ScenarioPhaseSaveRequestBuilder setTitle(String title) {
    this.title = title;
    return this;
  }

  public ScenarioPhaseSaveRequestBuilder setDescription(String description) {
    this.description = description;
    return this;
  }

  public ScenarioPhaseSaveRequestBuilder setColor(String color) {
    this.color = color;
    return this;
  }

  public ScenarioPhaseSaveRequestBuilder setStartTime(Integer startTime) {
    this.startTime = startTime;
    return this;
  }

  public ScenarioPhaseSaveRequestBuilder setEndTime(Integer endTime) {
    this.endTime = endTime;
    return this;
  }

  public ScenarioPhaseSaveRequest build() {
    return new ScenarioPhaseSaveRequest(
      title,
      description,
      color,
      startTime,
      endTime
    );
  }
}
