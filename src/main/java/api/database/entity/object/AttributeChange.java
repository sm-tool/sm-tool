package api.database.entity.object;

import api.database.entity.event.Event;
import api.database.model.data.AttributeChangeData;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// AttributeChange
///
/// Reprezentuje zmianę wartości atrybutu w kontekście wydarzenia.
/// Jest częścią historii zmian atrybutów, gdzie każda zmiana jest powiązana
/// z konkretnym wydarzeniem (Event) określającym kiedy nastąpiła.
///
/// # Ważne zasady
/// - Para (event_id, attribute_id) musi być unikalna
/// - Zmiany mogą być wprowadzane tylko w kontekście wydarzenia
/// - Format wartości musi być zgodny z szablonem atrybutu
/// - Usuwana kaskadowo wraz z eventem lub atrybutem
///
/// # Priorytety zmian
/// - Tylko atrybuty obiektów globalnych mogą mieć konfliktujące zmiany
/// - Dla obiektów globalnych:
///   1. Zmiany w wydarzeniach GLOBAL mają najwyższy priorytet
///   2. Zmiany w wydarzeniach NORMAL są nadpisywane przez GLOBAL
///   3. W ramach tego samego typu liczy się czas wydarzenia
/// - Obiekty lokalne mogą być modyfikowane tylko w swoim wątku
///
/// # Powiązania
/// - {@link Event} - kontekst czasowy zmiany i typ (GLOBAL/NORMAL)
/// - {@link Attribute} - modyfikowany atrybut
/// - {@link ObjectInstance} - pośrednio przez atrybut
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_attribute_change",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = { "event_id", "attribute_id" }),
  }
)
public class AttributeChange {

  /// Unikalny identyfikator zmiany
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_attribute_change_id_gen"
  )
  @SequenceGenerator(
    name = "qds_attribute_change_id_gen",
    sequenceName = "qds_attribute_change_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator modyfikowanego atrybutu
  @Column(name = "attribute_id", nullable = false)
  private Integer attributeId;

  /// Identyfikator wydarzenia wprowadzającego zmianę
  @Column(name = "event_id", nullable = false)
  private Integer eventId;

  /// Nowa wartość atrybutu
  @Column(name = "value", nullable = false, columnDefinition = "TEXT")
  private String value;

  /// Referencja do wydarzenia
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "event_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private Event event;

  /// Referencja do atrybutu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "attribute_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private Attribute attribute;

  //-------------------------Funkcje statyczne
  public static AttributeChange createWithDefault(
    Integer attributeId,
    Integer eventId,
    String value
  ) {
    return new AttributeChange(null, attributeId, eventId, value, null, null);
  }

  public static AttributeChange from(
    AttributeChangeData data,
    Integer eventId
  ) {
    return new AttributeChange(
      null,
      data.attributeId(),
      eventId,
      data.value(),
      null,
      null
    );
  }
}
