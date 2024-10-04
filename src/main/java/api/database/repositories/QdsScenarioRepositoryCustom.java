package api.database.repositories;

import api.database.classes.QdsScenarioDetails;
import java.util.List;

//Jeszcze trochę i wszystko zrobię na templatkach...
//Po co komu encje bazunia i tak robi brrrrrr...
//A java umiera... nie no i tak te encje jedyne co teoretycznie dają to automatyczne mapowanie i że sam
//wygeneruje się insert albo update... a do listy nie potrzebny bo to tylko select więc meh
public interface QdsScenarioRepositoryCustom {
  List<QdsScenarioDetails> findScenarioList(Integer userId);
}
