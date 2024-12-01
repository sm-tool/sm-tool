package api.database.entity.user;

import api.database.entity.scenario.QdsScenario;
import api.database.model.constant.QdsPermissionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
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
/// {@link QdsScenario} - scenariusz, którego dotyczy uprawnienie
/// {@link QdsUser} - użytkownik posiadający uprawnienie
/// {@link QdsPermissionType} - poziom dostępu
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
public class QdsPermission {

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
  private QdsPermissionType type;

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
  private QdsScenario scenario;

  /// Referencja do użytkownika
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "user_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsUser user;
}
