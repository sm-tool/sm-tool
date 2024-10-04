package api.database.classes.user;

/**
 * Informacje o użytkowniku wraz z id z bazy
 *
 * <p>Zawiera email, imię, nazwisko oraz avatar.</p>
 */
public record QdsUserInfo(
  String email,
  String firstName,
  String lastName,
  String avatar
) {}
