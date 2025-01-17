package api.database.entity.association;

import api.database.entity.event.Event;
import api.database.entity.object.ObjectInstance;
import api.database.model.data.AssociationChangeData;
import jakarta.persistence.*;
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
/// - Modyfikowana tylko w kontekście wydarzeń ({@link Event})
/// - Nie może łączyć obiektu z samym sobą (object1Id ≠ object2Id)
/// - Kombinacja (typ asocjacji, obiekt1, obiekt2) musi być unikalna
/// - Usuwana automatycznie gdy usuwany jest którykolwiek z obiektów
/// - Nie pozwala na usunięcie używanego typu asocjacji
///
/// # Powiązania
/// - {@link ObjectInstance} - obiekty połączone asocjacją
/// - {@link AssociationType} - typ/rodzaj asocjacji
/// - {@link AssociationChange} - historia zmian asocjacji
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
public class Association {

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
  private AssociationType associationType;

  /// Referencja do pierwszego obiektu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object1_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private ObjectInstance object1;

  /// Referencja do drugiego obiektu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object2_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private ObjectInstance object2;

  //-------------------------Funkcje statyczne
  public static Association from(AssociationChangeData data) {
    return new Association(
      null,
      data.associationTypeId(),
      data.object1Id(),
      data.object2Id(),
      null,
      null,
      null
    );
  }
}
