package api.database.entity.association;

import api.database.entity.event.Event;
import api.database.model.constant.AssociationOperation;
import api.database.model.data.AssociationChangeData;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje zmianę stanu asocjacji (dodanie/usunięcie) w określonym momencie czasu.
/// Jest częścią historii zmian asocjacji, gdzie każda zmiana jest powiązana z konkretnym
/// wydarzeniem ({@link Event}) określającym kiedy i w jakim kontekście nastąpiła.
///
/// # Ważne zasady
/// - Zmiany mogą być wprowadzane tylko w kontekście wydarzenia ({@link Event})
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
public class AssociationChange {

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
  private AssociationOperation associationOperation;

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

  /// Referencja do asocjacji
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "association_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private Association association;

  //-------------------------Funkcje statyczne
  public static AssociationChange from(
    AssociationChangeData data,
    Integer associationId,
    Integer eventId
  ) {
    return new AssociationChange(
      null,
      eventId,
      associationId,
      data.associationOperation(),
      null,
      null
    );
  }
}
