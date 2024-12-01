package api.database.entity.object;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje atrybut obiektu w systemie wraz z jego wartością początkową.
/// Jest podstawą do śledzenia zmian wartości atrybutu w czasie poprzez
/// wydarzenia (QdsEvent).
///
/// # Ważne zasady
/// - Każdy obiekt posiada dokładnie wszystkie atrybuty zdefiniowane przez typ obiektu
/// - Nazwa i format wartości określony przez szablon atrybutu
/// - Wartość początkowa wymagana przy tworzeniu
/// - Zmiany wartości w czasie rejestrowane przez QdsAttributeChange
/// - Usuwany kaskadowo z obiektem
///
/// # Powiązania
/// - {@link QdsObject} - obiekt posiadający atrybut
/// - {@link QdsAttributeTemplate} - definicja typu i formatu
/// - {@link QdsAttributeChange} - historia zmian wartości
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_attribute")
public class QdsAttribute {

  /// Unikalny identyfikator atrybutu
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_attribute_id_gen"
  )
  @SequenceGenerator(
    name = "qds_attribute_id_gen",
    sequenceName = "qds_attribute_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator obiektu właściciela
  @Column(name = "object_id", nullable = false)
  private Integer objectId;

  /// Identyfikator szablonu atrybutu
  @Column(name = "attribute_template_id", nullable = false)
  private Integer attributeTemplateId;

  /// Wartość początkowa atrybutu
  @Column(name = "initial_value", nullable = false, columnDefinition = "TEXT")
  private String initialValue;

  /// Referencja do obiektu właściciela
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsObject object;

  /// Referencja do szablonu atrybutu
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.NO_ACTION)
  @JoinColumn(
    name = "attribute_template_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsAttributeTemplate attributeTemplate;
}
