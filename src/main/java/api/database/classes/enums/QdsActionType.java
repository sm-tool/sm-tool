package api.database.classes.enums;

import api.database.classes.threads.response.QdsEvent;

/**
 * Reprezentuje typy wydarzeń w wątku.
 *
 * <p>Występuje na {@link QdsEvent}.
 * Określa możliwe operacje do wykonania w danym zdarzeniu.</p>
 *
 * <p>Możliwe wartości:
 * <ul>
 *    <li>GLOBAL</li>
 *    <li>NORMAL</li>
 *    <li>START</li>
 *    <li>END</li>
 *    <li>IDLE</li>
 *    <li>JOIN_OUT</li>
 *    <li>JOIN_IN</li>
 *    <li>FORK_OUT</li>
 *    <li>FORK_IN</li>
 * </ul>
 *
 * @see QdsEvent
 */
public enum QdsActionType {
  GLOBAL,
  NORMAL,
  START,
  END,
  IDLE,
  JOIN_OUT,
  JOIN_IN,
  FORK_OUT,
  FORK_IN,
}
