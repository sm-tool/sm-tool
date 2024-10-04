package api.database.classes.threads.response;

import api.database.entities.QdsObject;
import api.database.entities.QdsObserver;
import api.database.entities.QdsScenario;

//import java.util.List;

//Raczej nie będzie to entity
//Eventy... możliwe?

/**
 * Reprezentuje wątek w ramach scenariusza.
 *
 * <p>Klasa ta zawiera informacje o wątku (takie jak tytuł, opis oraz czas trwania),
 * który jest częścią konkretnego scenariusza reprezentowanego przez {@link QdsScenario}.</p>
 *
 * <p>Każdy scenariusz posiada jeden wątek globalny,określony polem {@code isGlobal}.</p>
 *
 * <p>Wątki mogą zawierać wiele obiektów {@link QdsObject} oraz być widoczne dla wielu ról obserwatorów
 * {@link QdsObserver}. Zachodzą w nim wydarzenia (w ramach {@link QdsThreadAction}).</p>
 *
 * @see QdsScenario
 * @see QdsObject
 * @see QdsObserver
 * @see QdsThreadAction
 */
public record QdsThread(
  Integer id,
  String title,
  String description
  //List<QdsThreadAction> actions //,
) {}
