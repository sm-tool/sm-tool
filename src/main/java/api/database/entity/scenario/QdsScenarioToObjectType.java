package api.database.entity.scenario;

import api.database.entity.object.QdsObjectType;
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

/// Definiuje powiązanie między scenariuszem a typem obiektu.
/// Określa, które typy obiektów są dostępne w danym scenariuszu
/// do tworzenia nowych obiektów i szablonów.
///
/// # Ważne zasady
/// - Para (scenarioId, objectTypeId) musi być unikalna
/// - Usuwana kaskadowo ze scenariuszem lub typem obiektu
/// - Obiekty i szablony w scenariuszu mogą używać tylko typów powiązanych z tym scenariuszem
/// - Typy dziedziczące są dostępne jeśli dostępny jest ich przodek
///
/// # Powiązania
/// {@link QdsScenario} - scenariusz zawierający typ
/// {@link QdsObjectType} - typ dostępny w scenariuszu
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_scenario_to_object_type",
  indexes = {
    @Index(columnList = "scenario_id, object_type_id", unique = true),
  }
)
public class QdsScenarioToObjectType {

  /// Unikalny identyfikator powiązania
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_scenario_to_object_type_id_gen"
  )
  @SequenceGenerator(
    name = "qds_scenario_to_object_type_id_gen",
    sequenceName = "qds_scenario_to_object_type_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator scenariusza
  @Column(name = "scenario_id", nullable = false)
  private Integer scenarioId;

  /// Identyfikator typu obiektu
  @Column(name = "object_type_id", nullable = false)
  private Integer objectTypeId;

  /// Referencja do scenariusza
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "scenario_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsScenario scenario;

  /// Referencja do typu obiektu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object_type_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsObjectType objectType;
}
