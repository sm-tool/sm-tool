package api.database.entity.object;

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

/// Definiuje typ obiektu w systemie, określając jego podstawowe właściwości
/// i ograniczenia. Typy mogą tworzyć hierarchię (dziedziczenie) i definiować
/// zasady globalności obiektów.
///
/// # Ważne zasady
/// - Tytuł typu musi być unikalny w systemie
/// - Typ może dziedziczyć po innym typie (parentId)
/// - Może wymuszać tworzenie obiektów tylko w wątku globalnym (isOnlyGlobal)
/// - Nie można usunąć typu używanego przez obiekty lub szablony
///
/// # Hierarchia typów
/// - Typy mogą tworzyć strukturę drzewiastą przez parentId
/// - Typ potomny może być użyty w asocjacjach wszędzie gdzie dozwolony jest jego przodek
/// - Usunięcie typu jest możliwe tylko gdy nie ma typów potomnych
///
/// # Wizualizacja
/// - color - opcjonalny kolor dla obiektów tego typu
/// - Typy podstawowe mają predefiniowane kolory
/// - Typy rozszerzone mogą definiować własne kolory
///
/// # Powiązania
/// {@link QdsObject Obiekt} - obiekty tego typu
/// {@link QdsObjectTemplate Szablon} - szablony dla tego typu
/// {@link QdsScenario Scenariusz} - kontekst istnienia typu
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_object_type",
  indexes = {
    @Index(
      name = "qds_object_type_title_uindex",
      columnList = "title",
      unique = true
    ),
    @Index(name = "qds_object_type_parent_id_index", columnList = "parent_id"),
  }
)
public class QdsObjectType {

  /// Unikalny identyfikator typu
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_object_type_id_gen"
  )
  @SequenceGenerator(
    name = "qds_object_type_id_gen",
    sequenceName = "qds_object_type_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Unikalny tytuł typu
  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  /// Opis typu
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  /// Kolor dla obiektów tego typu
  @Column(name = "color", columnDefinition = "TEXT")
  private String color;

  /// Czy obiekty tego typu mogą istnieć tylko w wątku globalnym
  @Column(name = "is_only_global")
  private Boolean isOnlyGlobal;

  /// Identyfikator typu nadrzędnego
  @Column(name = "parent_id")
  private Integer parentId;

  /// Referencja do typu nadrzędnego
  @JsonIgnore
  @ManyToOne(fetch = FetchType.EAGER)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "parent_id", insertable = false, updatable = false)
  private QdsObjectType parent;
}