package api.database.entities;

import api.database.classes.threads.response.QdsEvent;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje zmianę wartości atrybutu powiązaną z obiektem w bazie w określonym wydarzeniu.
 *
 * <p>Klasa ta jest używana do przechowywania zmian wartości atrybutów
 * (reprezentowanych przez {@link QdsAttribute}) w różnych wydarzeniach
 * w trakcie trwania scenariusza.</p>
 *
 * <p>Klasa tworzona, zmieniana i modyfikowana wraz z {@link QdsEvent}
 * jej bezpośrednia zmiana po za wydarzeniem nie powinna mieć miejsca</p>
 *
 * <p>Każda zmiana atrybutu jest przypisana do konkretnego atrybutu.</p>
 *
 * <p>Klasa ta współpracuje z {@link QdsAttribute}, który definiuje atrybut,
 * do którego ta wartość się odnosi, oraz z {@link QdsObject} (nie bezpośrednio), który
 * reprezentuje obiekt posiadający ten atrybut.</p>
 *
 * <p>Usuwana wraz z atrybutem a przez niego także z obiektem</p>
 *
 * @see QdsAttribute
 * @see QdsObject
 * @see QdsEvent
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_attribute_change",
  indexes = {
    @Index(
      name = "qds_attribute_value_attribute_id_index",
      columnList = "attribute_id"
    ),
  },
  uniqueConstraints = {
    @UniqueConstraint(
      name = "qds_attribute_change_event_id_attribute_id_key",
      columnNames = { "event_id", "attribute_id" }
    ),
  }
)
public class QdsAttributeChange {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_attribute_change_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "value", nullable = false, columnDefinition = "TEXT")
  private String value;

  //    @ManyToOne(fetch = FetchType.LAZY, optional = false)
  //    @OnDelete(action = OnDeleteAction.CASCADE)
  //    @JoinColumn(name = "event_id", nullable = false)
  //    private QdsEvent event;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "attribute_id", nullable = false)
  private QdsAttribute attribute;
}
