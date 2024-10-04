package api.database.entities;

import api.database.classes.threads.response.QdsEvent;
import jakarta.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje asocjację pomiędzy dwoma obiektami w bazie.
 *
 * <p>Encja ta jest używana do modelowania relacji pomiędzy dwoma różnymi
 * obiektami (reprezentowanymi przez {@link QdsObject}).</p>
 *
 * <p>Klasa tworzona, zmieniana i modyfikowana wraz z {@link QdsEvent}
 * jej bezpośrednia zmiana po za wydarzeniem nie powinna mieć miejsca</p>
 *
 * <p>Asocjacja zawiera swój rodzaj
 * ({@link QdsAssociationType}), co pozwala
 * na określenie natury relacji między obiektami.</p>
 *
 * <p>Współpracuje z {@link QdsAssociationChange}, która określa jej zmiany w wydarzeniach.</p>
 *
 * <p>Uniemożliwia usunięcie rodzaju asocjacji.<br/>
 * Usuwana wraz z obiektami.</p>
 *
 * @see QdsObject
 * @see QdsEvent
 * @see QdsAssociationType
 * @see QdsAssociationChange
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_association",
  uniqueConstraints = {
    @UniqueConstraint(
      name = "qds_association_association_type_id_object1_id_object2_id_key",
      columnNames = { "association_type_id", "object1_id", "object2_id" }
    ),
  }
)
public class QdsAssociation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_association_id_seq')")
  @Column(name = "id", nullable = false)
  private Integer id;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(name = "association_type_id", nullable = false)
  private QdsAssociationType associationType;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "object1_id", nullable = false)
  private QdsObject object1;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "object2_id", nullable = false)
  private QdsObject object2;

  @OneToMany(mappedBy = "association")
  private Set<QdsAssociationChange> qdsAssociationChanges =
    new LinkedHashSet<>();
}
