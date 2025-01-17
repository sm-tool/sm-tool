package utils.builders;

import api.database.model.request.composite.create.ThreadCreateRequest;

public class QdsAddThreadBuilder {

  private String title = "Default Title";
  private String description = "Default Description";
  private Integer time = 10;

  public QdsAddThreadBuilder setTitle(String title) {
    this.title = title;
    return this;
  }

  public QdsAddThreadBuilder setDescription(String description) {
    this.description = description;
    return this;
  }

  public QdsAddThreadBuilder setTime(Integer time) {
    this.time = time;
    return this;
  }

  public ThreadCreateRequest build() {
    return new ThreadCreateRequest(title, description, time);
  }
}
