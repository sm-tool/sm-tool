package api.database.websocket.model;

public class CachedMessage {

  private Object message;
  private MessageType type;
  private final long timestamp;

  public CachedMessage(Object message, MessageType type, long timestamp) {
    this.message = message;
    this.type = type;
    this.timestamp = timestamp;
  }

  public Object getMessage() {
    return message;
  }

  public MessageType getType() {
    return type;
  }

  public Long getTimestamp() {
    return timestamp;
  }
}
