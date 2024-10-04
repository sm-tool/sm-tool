package api.database.entities;

import jakarta.persistence.*;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.*;

/**
 * Reprezentuje rodzaj asocjacji pomiędzy obiektami w ramach określonego scenariusza.
 *
 * <p>Klasa ta definiuje rodzaj relacji, który może istnieć pomiędzy dwoma
 * obiektami (reprezentowanymi przez {@link QdsObject}) w ramach konkretnego
 * scenariusza (zdefiniowanego przez {@link QdsScenario}). Typ asocjacji
 * opisany przez pole {@code type} pozwala na precyzyjne określenie natury
 * tej relacji.</p>
 *
 * <p>Asocjacje rodzaju zdefiniowanego przez tę klasę obejmuje konkretne
 * typy obiektów ({@link QdsObjectType}), określone przez pola {@code firstObjectType} i
 * {@code secondObjectType}.</p>
 *
 * <p>Każdy rodzaj asocjacji jest
 * unikalny w ramach jednego scenariusza.</p>
 *
 * <p>Ta klasa współpracuje z {@link QdsAssociation}, który reprezentuje
 * konkretne instancje asocjacji zdefiniowane przez ten rodzaj.</p>
 *
 * <p>Usuwany wraz ze scenariuszem.<br/>Usunięcie jego samego jest możliwe tylko gdy
 * nie istnieje żadna asocjacja danego rodzaju.</p>
 *
 * @see QdsObject
 * @see QdsScenario
 * @see QdsObjectType
 * @see QdsAssociation
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_association_type",
  indexes = {
    @Index(
      name = "qds_association_type_scenario_id_index",
      columnList = "scenario_id"
    ),
  },
  uniqueConstraints = {
    @UniqueConstraint(
      name = "qds_association_type_scenario_id_type_key",
      columnNames = { "scenario_id", "type" }
    ),
  }
)
public class QdsAssociationType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_association_type_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", nullable = false)
  private QdsScenario scenario;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "first_object_type_id", nullable = false)
  private QdsObjectType firstObjectType;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "second_object_type_id", nullable = false)
  private QdsObjectType secondObjectType;

  @OneToMany(mappedBy = "associationType")
  private Set<QdsAssociation> qdsAssociations = new LinkedHashSet<>();
}
