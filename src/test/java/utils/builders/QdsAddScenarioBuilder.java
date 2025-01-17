package utils.builders;

import api.database.model.request.save.ScenarioSaveRequest;
import java.time.OffsetDateTime;

public class QdsAddScenarioBuilder {

  private String title = "Default Title";
  private String description = "Default Description";
  private String context = "Default Context";
  private String purpose = "Default Purpose";
  private OffsetDateTime startDate = OffsetDateTime.now();
  private OffsetDateTime endDate = OffsetDateTime.now().plusDays(7);
  private Integer eventDuration = 60;
  private String eventUnit = "min";

  public QdsAddScenarioBuilder withTitle(String title) {
    this.title = title;
    return this;
  }

  public QdsAddScenarioBuilder withDescription(String description) {
    this.description = description;
    return this;
  }

  public QdsAddScenarioBuilder withContext(String context) {
    this.context = context;
    return this;
  }

  public QdsAddScenarioBuilder withPurpose(String purpose) {
    this.purpose = purpose;
    return this;
  }

  public QdsAddScenarioBuilder withStartDate(OffsetDateTime startDate) {
    this.startDate = startDate;
    return this;
  }

  public QdsAddScenarioBuilder withEndDate(OffsetDateTime endDate) {
    this.endDate = endDate;
    return this;
  }

  public QdsAddScenarioBuilder withEventDuration(Integer eventDuration) {
    this.eventDuration = eventDuration;
    return this;
  }

  public QdsAddScenarioBuilder withEventUnit(String eventUnit) {
    this.eventUnit = eventUnit;
    return this;
  }

  public ScenarioSaveRequest build() {
    return new ScenarioSaveRequest(
      title,
      description,
      context,
      purpose,
      startDate,
      endDate,
      eventDuration,
      eventUnit
    );
  }
}
