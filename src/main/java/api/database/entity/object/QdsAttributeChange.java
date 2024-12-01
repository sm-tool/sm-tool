package api.database.entity.object;

import api.database.entity.event.QdsEvent;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// QdsAttributeChange
///
/// Reprezentuje zmianę wartości atrybutu w kontekście wydarzenia.
/// Jest częścią historii zmian atrybutów, gdzie każda zmiana jest powiązana
/// z konkretnym wydarzeniem (QdsEvent) określającym kiedy nastąpiła.
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
/// - {@link QdsEvent} - kontekst czasowy zmiany i typ (GLOBAL/NORMAL)
/// - {@link QdsAttribute} - modyfikowany atrybut
/// - {@link QdsObject} - pośrednio przez atrybut
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
public class QdsAttributeChange {

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
  private QdsEvent event;

  /// Referencja do atrybutu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "attribute_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsAttribute attribute;
}
