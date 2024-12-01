package api.database.entity.user;

import api.database.model.constant.QdsUserRoleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/// Reprezentuje użytkownika systemu. Przechowuje podstawowe
/// informacje o użytkowniku oraz jego rolę systemową.
/// # Powiązania
/// - {@link QdsPermission} - uprawnienia użytkownika do scenariuszy
/// - {@link QdsUserRoleType} - rola systemowa użytkownika
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_user")
public class QdsUser {

  /// Unikalny identyfikator użytkownika
  @Id
  @Column(name = "id", nullable = false)
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

  /// Rola systemowa (domyślnie USER)
  @Column(name = "role", nullable = false, columnDefinition = "TEXT")
  @Enumerated(EnumType.STRING)
  private QdsUserRoleType role = QdsUserRoleType.USER;
}
