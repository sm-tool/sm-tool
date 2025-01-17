package api.database.entity.scenario;

import api.database.entity.object.ObjectTemplate;
import jakarta.persistence.*;
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
/// {@link Scenario} - scenariusz zawierający szablon
/// {@link ObjectTemplate} - szablon dostępny w scenariuszu
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_scenario_to_object_template",
  indexes = { @Index(columnList = "scenario_id, template_id", unique = true) }
)
public class ScenarioToObjectTemplate {

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
  private Scenario scenario;

  /// Referencja do szablonu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "template_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private ObjectTemplate template;

  //-------------------------Funkcje statyczne
  public static ScenarioToObjectTemplate create(
    Integer objectTemplateId,
    Integer scenarioId
  ) {
    return new ScenarioToObjectTemplate(
      null,
      scenarioId,
      objectTemplateId,
      null,
      null
    );
  }
}
