package api.database.entity.user;

import api.database.entity.scenario.Scenario;
import api.database.model.constant.PermissionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje uprawnienie użytkownika do scenariusza.
/// Określa poziom dostępu (EDIT/VIEW/AUTHOR) użytkownika
/// do konkretnego scenariusza.
///
/// # Ważne zasady
/// - Kombinacja (userId, scenarioId, type) musi być unikalna
/// - Usuwana kaskadowo ze scenariuszem lub użytkownikiem
/// - Każdy scenariusz musi mieć dokładnie jednego właściciela (AUTHOR)
/// - Uprawnienia określają możliwość:
///   - VIEW: przeglądania scenariusza
///   - EDIT: modyfikacji scenariusza
///   - AUTHOR: zarządzania uprawnieniami i scenariuszem
///
/// # Powiązania
/// {@link Scenario} - scenariusz, którego dotyczy uprawnienie
/// {@link User} - użytkownik posiadający uprawnienie
/// {@link PermissionType} - poziom dostępu
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_permission",
  indexes = {
    @Index(
      name = "qds_permission_uindex",
      columnList = "user_id, scenario_id, type",
      unique = true
    ),
  }
)
public class Permission {

  /// Unikalny identyfikator uprawnienia
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_permission_id_gen"
  )
  @SequenceGenerator(
    name = "qds_permission_id_gen",
    sequenceName = "qds_permission_id_seq",
    allocationSize = 1
  )
  private Integer id;

  /// Typ uprawnienia (VIEW/EDIT/AUTHOR)
  @Column(name = "type", nullable = false, columnDefinition = "TEXT")
  @Enumerated(EnumType.STRING)
  private PermissionType type;

  /// Identyfikator scenariusza
  @Column(name = "scenario_id", nullable = false)
  private Integer scenarioId;

  /// Identyfikator użytkownika
  @Column(name = "user_id", nullable = false)
  private String userId;

  /// Referencja do scenariusza
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "scenario_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private Scenario scenario;

  /// Referencja do użytkownika
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "user_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private User user;
}
