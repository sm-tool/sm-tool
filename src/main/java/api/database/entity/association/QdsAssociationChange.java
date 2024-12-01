package api.database.entity.association;

import api.database.entity.event.QdsEvent;
import api.database.model.constant.QdsAssociationOperation;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

/// Reprezentuje zmianę stanu asocjacji (dodanie/usunięcie) w określonym momencie czasu.
/// Jest częścią historii zmian asocjacji, gdzie każda zmiana jest powiązana z konkretnym
/// wydarzeniem ({@link QdsEvent}) określającym kiedy i w jakim kontekście nastąpiła.
///
/// # Ważne zasady
/// - Zmiany mogą być wprowadzane tylko w kontekście wydarzenia ({@link QdsEvent})
/// - Każda zmiana musi być unikalna dla pary (wydarzenie, asocjacja)
/// - Zmiany są usuwane kaskadowo wraz z wydarzeniem lub modyfikowaną asocjacją
/// - Typ operacji (INSERT/DELETE) określa charakter zmiany
///
/// # Wykorzystanie
/// - Śledzenie historii zmian asocjacji w czasie
/// - Odtwarzanie stanu asocjacji na dany moment
/// - Walidacja spójności zmian w wątkach
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_association_change",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = { "event_id", "association_id" }),
  }
)
public class QdsAssociationChange {

  /// Unikalny identyfikator zmiany
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

  /// Identyfikator wydarzenia
  @Column(name = "event_id", nullable = false)
  private Integer eventId;

  /// Identyfikator modyfikowanej asocjacji
  @Column(name = "association_id", nullable = false)
  private Integer associationId;

  /// Rodzaj operacji (INSERT/DELETE)
  @Column(
    name = "association_operation",
    nullable = false,
    columnDefinition = "TEXT"
  )
  @Enumerated(EnumType.STRING)
  private QdsAssociationOperation associationOperation;

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

  /// Referencja do asocjacji
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "association_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsAssociation association;
}
