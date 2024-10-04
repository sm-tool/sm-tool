package api.database.services;

import api.database.classes.threads.body.QdsForkInfo;
import api.database.classes.threads.body.QdsThreadActionInfo;
import api.database.classes.threads.body.QdsThreadInfo;
//import api.database.classes.threads.dto.QdsThreadActionDTO;
//import api.database.classes.threads.response.QdsBranching;

import api.database.classes.threads.response.QdsEvent;
import api.database.classes.threads.response.QdsThread;
import api.database.classes.threads.response.QdsThreadAction;
import api.database.classes.threads.response.ThreadsAndBranching;
import api.database.repositories.QdsThreadRepository;
import jakarta.transaction.Transactional;
import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//triggerami nie poblokuję zmian bo rozwali to joiny i merge

@Service
public class ThreadService {

  private final QdsThreadRepository qdsThreadRepository;

  @Autowired
  public ThreadService(QdsThreadRepository qdsThreadRepository) {
    this.qdsThreadRepository = qdsThreadRepository;
  }

  public Integer insertThread(QdsThreadInfo qdsThreadInfo, Integer scenarioId) {
    return qdsThreadRepository.insertThread(qdsThreadInfo, scenarioId);
  }

  //Jeszcze przenoszenie obiektów
  public Integer[] forkThread(QdsForkInfo forkInfo, Integer scenarioId) {
    return qdsThreadRepository.forkThread(forkInfo, scenarioId);
  }

  //public Map<Integer, List<QdsThreadAction>> getActions(List<Integer> ids) {
  public List<QdsThreadAction> getActions(List<Integer> ids) {
    return qdsThreadRepository.getActions(ids);
    //      .stream()
    //      .collect(
    //        Collectors.groupingBy(
    //          QdsThreadActionDTO::threadId,
    //          Collectors.mapping(
    //            dto ->
    //              new QdsThreadAction(
    //                dto.id(),
    //                dto.time(),
    //                dto.actionType(),
    //                dto.event(),
    //                dto.branchingId()
    //              ),
    //            Collectors.toList()
    //          )
    //        )
    //      );
  }

  @Transactional
  public ThreadsAndBranching getAllThreads(Integer scenarioId) {
    List<QdsThread> threads = qdsThreadRepository.getThreads(scenarioId);

    List<Integer> ids = threads.stream().map(QdsThread::id).toList();

    return new ThreadsAndBranching(
      threads,
      getActions(ids),
      qdsThreadRepository.getBranching(scenarioId)
    );
    //    System.out.println(ids);
    //    Map<Integer, List<QdsThreadAction>> actionsByThreadId = getActions(ids);
    //
    //    List<QdsBranching> branchings = qdsThreadRepository.getBranching(
    //      scenarioId
    //    );
    //
    //    return new ThreadsAndBranching(
    //      threads
    //        .stream()
    //        .map(thread -> {
    //          List<QdsThreadAction> actions = actionsByThreadId.getOrDefault(
    //            thread.id(),
    //            List.of()
    //          );
    //          return new QdsThread(
    //            thread.id(),
    //            thread.title(),
    //            thread.description(),
    //            actions
    //          );
    //        })
    //        .collect(Collectors.toList()),
    //      branchings
    //    );
  }

  public Integer insertAction(QdsThreadActionInfo action, Integer scenarioId) {
    return qdsThreadRepository.insertAction(action, scenarioId);
  }

  //Obsługa obiektów (update/insert/delete attribute i association change)? Czy przypisane do akcji a nie eventu?
  public String changeEvent(QdsEvent event) {
    return qdsThreadRepository.changeEvent(event);
  }

  //Zmiana opisu/tytułu
  public String changeThread(QdsThread thread, Integer scenarioId) {
    return qdsThreadRepository.changeThread(thread, scenarioId);
  }
  //Przesunięcie threada / przesunięcie startu - to na thread actions

  //delete threada - usunięcie thread_actions + usunięcie eventów - blokada dla forków i merge?
  //albo pozbycie się wszystkigo po - prościej blokadę zrobić

  // sprawdzanie asocjacji i blokowanie przenoszenia do różnych wątków, przeniesieni obserwatorzy
  //zwraca całe thready? czy tylko id utworzonych

  //delete forka - usunięcie wszystkich wątków wywodzących się z niego? kiedy zablokować?
  // Jak to połączyć z delete threada żeby się tutaj nie blokowało?

  //update forka - zmiana czasu? - zmiana start - end time dla wątków - obejście blokowania threada - blokowanie triggerów?
  //albo wszystko funkcjami, zmiana wątków wychodzących - usuwanie niektórych i dodawanie? - prawdopodobnie prościej usunąć
  //cały i na nowo zrobić? albo blokowanie na eventach dla obiektów na innych wątkach? Zmiana przeniesień?

  //insert joina - event + idiki + informacje o wątku wychodzącym? obiekty przeniesione wszystkie z wchodzących
  //co zwracać

  //delete joina - albo blokada albo wywalenie wątków po

  //update joina - zmiana obiektów czasów? to samo co w forku

}
