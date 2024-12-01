package api.database.entity.scenario;

import api.database.entity.object.QdsObjectTemplate;
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

/// Definiuje powiązanie między scenariuszem a szablonem obiektu.
/// Określa, które szablony obiektów są dostępne w danym scenariuszu
/// do tworzenia nowych obiektów.
///
/// # Ważne zasady
/// - Para (scenarioId, templateId) musi być unikalna
/// - Usuwana kaskadowo ze scenariuszem lub szablonem
/// - Obiekt w scenariuszu może używać tylko szablonów powiązanych z tym scenariuszem
///
/// # Powiązania
/// {@link QdsScenario} - scenariusz zawierający szablon
/// {@link QdsObjectTemplate} - szablon dostępny w scenariuszu
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_scenario_to_object_template",
  indexes = { @Index(columnList = "scenario_id, template_id", unique = true) }
)
public class QdsScenarioToObjectTemplate {

  /// Unikalny identyfikator powiązania
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_scenario_to_object_template_id_gen"
  )
  @SequenceGenerator(
    name = "qds_scenario_to_object_template_id_gen",
    sequenceName = "qds_scenario_to_object_template_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator scenariusza
  @Column(name = "scenario_id", nullable = false)
  private Integer scenarioId;

  /// Identyfikator szablonu
  @Column(name = "template_id", nullable = false)
  private Integer templateId;

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

  /// Referencja do szablonu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "template_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsObjectTemplate template;
}
