package api.database.entities;

import api.database.classes.enums.QdsAssociationOperation;
import api.database.classes.threads.response.QdsEvent;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje operację na danej asocjacji w danym wydarzeniu.
 *
 * <p>Encja ta jest encją pomocniczą tworzoną i zarządzaną w ramach {@link QdsEvent}.</p>
 *
 *
 * <p>Określa (przy pomocy {@link QdsAssociationOperation} działanie na danej asocjacji w danym wydarzeniu)</p>
 *
 * @see QdsEvent
 * @see QdsAssociationOperation
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_association_change")
public class QdsAssociationChange {

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_association_change_id_gen"
  )
  @SequenceGenerator(
    name = "qds_association_change_id_gen",
    sequenceName = "qds_association_change_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  //    @ManyToOne(fetch = FetchType.LAZY, optional = false)
  //    @OnDelete(action = OnDeleteAction.CASCADE)
  //    @JoinColumn(name = "event_id", nullable = false)
  //    private QdsEvent event;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "association_id", nullable = false)
  private QdsAssociation association;

  @Column(
    name = "association_operation",
    nullable = false,
    columnDefinition = "qds_association_operation"
  )
  private QdsAssociationOperation associationOperation;
}
