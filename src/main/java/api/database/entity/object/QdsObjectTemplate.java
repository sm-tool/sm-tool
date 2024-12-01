package api.database.entity.object;

import api.database.entity.scenario.QdsScenario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje szablon obiektu określający jego strukturę atrybutów.
/// Definiuje jakie atrybuty i jakiego typu musi posiadać obiekt
/// stworzony na podstawie tego szablonu.
///
/// # Ważne zasady
/// - Tytuł szablonu musi być unikalny w systemie
/// - Szablon określa strukturę atrybutów poprzez QdsAttributeTemplate
/// - Można go przypisać tylko do obiektów zgodnego typu
/// - Nie można usunąć szablonu używanego przez obiekty
/// # Wizualizacja
/// - color - kolor używany do wyświetlania obiektów tego szablonu
///
/// # Powiązania
/// - {@link QdsObjectType} - określa dozwolone typy obiektów
/// - {@link QdsObject} - obiekty utworzone z tego szablonu
/// -{@link QdsAttributeTemplate} - definicje atrybutów
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_object_template",
  uniqueConstraints = {
    @UniqueConstraint(
      name = "qds_object_template_title_key",
      columnNames = { "title" }
    ),
  }
)
public class QdsObjectTemplate {

  /// Unikalny identyfikator szablonu
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_object_template_id_gen"
  )
  @SequenceGenerator(
    name = "qds_object_template_id_gen",
    sequenceName = "qds_object_template_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Unikalny tytuł szablonu
  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  /// Opis szablonu
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  /// Kolor dla obiektów tego szablonu
  @Column(name = "color", nullable = false, columnDefinition = "TEXT")
  private String color;

  /// Identyfikator typu obiektu
  @Column(name = "object_type_id")
  private Integer objectTypeId;

  /// Referencja do typu obiektu
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(name = "object_type_id", insertable = false, updatable = false)
  @JsonIgnore
  private QdsObjectType objectType;
}
