package api.database.entity.user;

import api.database.model.security.KeycloakEvent;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/// Reprezentuje użytkownika systemu. Przechowuje podstawowe
/// informacje o użytkowniku oraz jego rolę systemową.
/// # Powiązania
/// - {@link Permission} - uprawnienia użytkownika do scenariuszy
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_user")
public class User {

  /// Unikalny identyfikator użytkownika
  @Id
  @Column(name = "id", nullable = false, columnDefinition = "TEXT")
  private String id;

  /// Adres email użytkownika
  @Column(name = "email", nullable = false, columnDefinition = "TEXT")
  private String email;

  /// Imię użytkownika
  @Column(name = "first_name", nullable = false, columnDefinition = "TEXT")
  private String firstName;

  /// Nazwisko użytkownika
  @Column(name = "last_name", nullable = false, columnDefinition = "TEXT")
  private String lastName;

  //-------------------------Funkcje statyczne
  public static User create(KeycloakEvent event) {
    return new User(
      event.userId(),
      event.details().get("email"),
      event.details().get("first_name"),
      event.details().get("last_name")
    );
  }
}
