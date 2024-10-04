package api.database.entities;

import api.database.classes.enums.QdsPermissionType;
import api.database.classes.user.QdsUserInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje uprawnienie użytkownika do określonego scenariusza.
 *
 * <p>Każde uprawnienie jest przypisane do użytkownika ({@link QdsUserInfo}) oraz
 * scenariusza ({@link QdsScenario}), a jego rodzaj jest określony przez typ
 * uprawnienia ({@link QdsPermissionType}). Uprawnienie jest unikalne w ramach
 * kombinacji użytkownika i scenariusza.</p>
 *
 * <p>Usuwana wraz ze scenariuszem lub użytkownikiem.</p>
 *
 * @see QdsScenario
 * @see QdsPermissionType
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_permission",
  indexes = {
    @Index(
      name = "qds_permission_user_email_scenario_id_uindex",
      columnList = "user_email, scenario_id",
      unique = true
    ),
  }
)
public class QdsPermission {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_permission_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(
    name = "type",
    nullable = false,
    columnDefinition = "qds_permission_type"
  )
  private QdsPermissionType type;

  @Column(name = "user_id", nullable = false)
  private Integer userId;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", nullable = false)
  private QdsScenario scenario;
}
