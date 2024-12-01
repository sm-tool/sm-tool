package api.database.entity.association;

import api.database.entity.object.QdsObject;
import api.database.entity.object.QdsObjectType;
import api.database.entity.scenario.QdsScenario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Definiuje typ/rodzaj asocjacji możliwy między obiektami w systemie.
/// Określa jakie typy obiektów mogą być połączone danym rodzajem asocjacji.
///
/// # Ważne zasady
/// - Opis typu asocjacji musi być unikalny
/// - Określa parę typów obiektów mogących tworzyć asocjację
/// - Usuwany kaskadowo ze scenariuszem
/// - Może być usunięty tylko gdy nie ma żadnych asocjacji tego typu
///
/// # Powiązania
/// - {@link QdsObjectType} - dozwolone typy obiektów
/// - {@link QdsAssociation} - konkretne wystąpienia asocjacji tego typu
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_association_type",
  indexes = {
    @Index(
      name = "qds_association_type_description_index",
      columnList = "description",
      unique = true
    ),
  }
)
public class QdsAssociationType {

  /// Unikalny identyfikator typu asocjacji
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_association_type_id_gen"
  )
  @SequenceGenerator(
    name = "qds_association_type_id_gen",
    sequenceName = "qds_association_type_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Unikalny opis typu asocjacji
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  /// Identyfikator pierwszego dozwolonego typu obiektu
  @Column(name = "first_object_type_id", nullable = false)
  private Integer firstObjectTypeId;

  /// Identyfikator drugiego dozwolonego typu obiektu
  @Column(name = "second_object_type_id", nullable = false)
  private Integer secondObjectTypeId;

  /// Referencja do typu pierwszego obiektu
  @JsonIgnore
  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "first_object_type_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsObjectType firstObjectType;

  /// Referencja do typu drugiego obiektu
  @JsonIgnore
  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "second_object_type_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsObjectType secondObjectType;
}
