package api.database.service.core;

import api.database.entity.event.Event;
import api.database.model.constant.EventType;
import api.database.repository.special.IdleEventRepository;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.stereotype.Component;

@Component
public class IdleEventManager {

  private final IdleEventRepository idleEventRepository;

  public IdleEventManager(IdleEventRepository idleEventRepository) {
    this.idleEventRepository = idleEventRepository;
  }

  public void fillWithIdleEvents(
    Integer threadId,
    Integer timeFrom,
    Integer timeTo
  ) {
    List<Event> idleEvents = IntStream.range(timeFrom, timeTo)
      .mapToObj(time -> Event.createIdle(time, threadId))
      .collect(Collectors.toList());

    idleEventRepository.saveAll(idleEvents);
  }

  public Event getIdleEventInTimeAndThread(Integer time, Integer threadId) {
    return idleEventRepository.getIdleEventInTimeAndThread(time, threadId);
  }

  public void changeIdleToBranched(
    Event event,
    Integer branchingId,
    EventType eventType
  ) {
    event.setBranchingId(branchingId);
    event.setEventType(eventType);
    event.setDescription(null);
    event.setTitle(null);
    idleEventRepository.save(event);
  }

  public void cleanupIdleEvents(Integer scenarioId) {
    idleEventRepository.cleanupIdleEvents(scenarioId);
  }

  public void cleanIdleEvents(
    Integer threadId,
    Integer timeFrom,
    Integer timeTo
  ) {
    idleEventRepository.cleanIdleEvents(threadId, timeFrom, timeTo);
  }
}
