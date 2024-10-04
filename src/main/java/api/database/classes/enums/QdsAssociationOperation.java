package api.database.classes.enums;

import api.database.entities.QdsAssociationChange;

/**
 * Reprezentuje możliwe zmiany asocjacji.
 *
 * <p>Występuje na {@link QdsAssociationChange}.
 * Określa możliwe operacje do wykonania w danym zdarzeniu.</p>
 *
 * <p>Możliwe wartości:
 * <ul>
 *    <li>INSERT</li>
 *    <li>DELETE</li>
 * </ul>
 *
 * @see QdsAssociationChange
 */
public enum QdsAssociationOperation {
  INSERT,
  DELETE,
}
