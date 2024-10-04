package api.database.websocket.model;

public class PrioritizedMessage implements Comparable<PrioritizedMessage> {

  private String scenarioId;
  private Object message;
  private MessageType type;
  private int priority;
  private long timestamp;

  public PrioritizedMessage(
    String scenarioId,
    Object message,
    MessageType type,
    int priority
  ) {
    this.scenarioId = scenarioId;
    this.message = message;
    this.type = type;
    this.priority = priority;
    this.timestamp = System.currentTimeMillis();
  }

  public String getScenarioId() {
    return scenarioId;
  }

  public Object getMessage() {
    return message;
  }

  public MessageType getType() {
    return type;
  }

  public int getPriority() {
    return priority;
  }

  public long getTimestamp() {
    return timestamp;
  }

  @Override
  public int compareTo(PrioritizedMessage other) {
    int priorityComparison = Integer.compare(other.priority, this.priority);
    if (priorityComparison != 0) {
      return priorityComparison;
    }
    return Long.compare(this.timestamp, other.timestamp);
  }
}
