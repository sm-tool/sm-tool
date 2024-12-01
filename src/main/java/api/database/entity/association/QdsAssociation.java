package api.database.entity.association;

import api.database.entity.event.QdsEvent;
import api.database.entity.object.QdsObject;
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
import org.hibernate.annotations.Check;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje asocjację (relację) między dwoma obiektami w systemie.
/// Przechowuje informacje o typie relacji i powiązanych obiektach.
///
/// # Ważne zasady
/// - Modyfikowana tylko w kontekście wydarzeń ({@link QdsEvent})
/// - Nie może łączyć obiektu z samym sobą (object1Id ≠ object2Id)
/// - Kombinacja (typ asocjacji, obiekt1, obiekt2) musi być unikalna
/// - Usuwana automatycznie gdy usuwany jest którykolwiek z obiektów
/// - Nie pozwala na usunięcie używanego typu asocjacji
///
/// # Powiązania
/// - {@link QdsObject} - obiekty połączone asocjacją
/// - {@link QdsAssociationType} - typ/rodzaj asocjacji
/// - {@link QdsAssociationChange} - historia zmian asocjacji
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
@Check(constraints = "( object1_id <> object2_id )")
public class QdsAssociation {

  /// Unikalny identyfikator asocjacji
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_association_id_gen"
  )
  @SequenceGenerator(
    name = "qds_association_id_gen",
    sequenceName = "qds_association_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator typu asocjacji
  @Column(name = "association_type_id", nullable = false)
  private Integer associationTypeId;

  /// Identyfikator pierwszego obiektu w relacji
  @Column(name = "object1_id", nullable = false)
  private Integer object1Id;

  /// Identyfikator drugiego obiektu w relacji
  @Column(name = "object2_id", nullable = false)
  private Integer object2Id;

  /// Referencja do typu asocjacji
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(
    name = "association_type_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsAssociationType associationType;

  /// Referencja do pierwszego obiektu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object1_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsObject object1;

  /// Referencja do drugiego obiektu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object2_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsObject object2;
}
