package api.database.entities;

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
 * Reprezentuje atrybut powiązany z obiektem w bazie.
 *
 * <p>Klasa ta jest używana do definiowania indywidualnych cech lub
 * właściwości obiektu (reprezentowanego przez {@link QdsObject}).
 * Obiekt może posidać tylko 1 atrybut o danej nazwie</p>
 *
 * <p>Każdy atrybut może mieć wiele wartości w czasie (reprezentowanych
 * przez {@link QdsAttributeChange}), co pozwala na śledzenie zmian wartości
 * atrybutu w trakcie trwania scenariusza.</p>
 *
 *
 * <p>Wartości atrybutów są przechowywane w tabeli powiązanej przez
 * klasę {@link QdsAttributeChange}, co umożliwia elastyczne i dokładne
 * modelowanie zmian w wartościach atrybutów w czasie.</p>
 *
 * <p> Usuwana wraz z obiektem.</p>
 *
 * @see QdsObject
 * @see QdsAttributeChange
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_attribute",
  indexes = {
    @Index(
      name = "qds_attribute_object_id_name_uindex",
      columnList = "object_id, name",
      unique = true
    ),
  }
)
public class QdsAttribute {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_attribute_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "name", nullable = false, columnDefinition = "TEXT")
  private String name;

  @Column(name = "default_value", nullable = false, columnDefinition = "TEXT")
  private String defaultValue;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "object_id", nullable = false)
  private QdsObject object;

  @OneToMany(mappedBy = "attribute")
  private Set<QdsAttributeChange> qdsAttributeValues = new LinkedHashSet<>();
}
