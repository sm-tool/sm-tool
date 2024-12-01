package api.database.model.constant;

/**
 * Reprezentuje typy uprawnień dostępu do scenariusza.
 *
 * <p>Możliwe wartości
 * <ul>
 *     <li>AUTHOR</li>
 *     <li>EDIT</li>
 *     <li>VIEW</li>
 * </ul></p>
 * <p>
 * Typy te definiują, jakie operacje użytkownik
 * może wykonywać w ramach scenariusza.</p>
 */
public enum QdsPermissionType {
  AUTHOR,
  EDIT,
  VIEW,
}
