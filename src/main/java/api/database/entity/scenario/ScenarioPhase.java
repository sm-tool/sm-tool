package api.database.entity.scenario;

import api.database.model.request.save.ScenarioPhaseSaveRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje logiczną fazę czasową w scenariuszu.
/// Fazy pozwalają na podział scenariusza na mniejsze, znaczące okresy,
/// ułatwiając organizację i wizualizację wydarzeń.
///
/// # Ważne zasady
/// - Czas końca musi być większy niż czas początku (CHECK constraint)
/// - Fazy nie mogą się nakładać
/// - Usuwana kaskadowo ze scenariuszem
///
/// # Wizualizacja
/// - color - kolor używany do wyświetlania fazy na osi czasu
/// - title/description - identyfikacja i opis fazy
///
/// # Powiązania
/// - {@link Scenario} - scenariusz zawierający fazę
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_scenario_phase")
@Check(
  name = "qds_scenario_phase_end_time_greater",
  constraints = "(end_time>start_time)"
)
public class ScenarioPhase {

  /// Unikalny identyfikator fazy
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_scenario_phase_id_gen"
  )
  @SequenceGenerator(
    name = "qds_scenario_phase_id_gen",
    sequenceName = "qds_scenario_phase_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Tytuł fazy
  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  /// Opis fazy
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  /// Kolor do wizualizacji fazy
  @Column(name = "color", columnDefinition = "TEXT")
  private String color;

  /// Czas rozpoczęcia fazy
  @Column(name = "start_time", nullable = false)
  private Integer startTime;

  /// Czas zakończenia fazy
  @Column(name = "end_time", nullable = false)
  private Integer endTime;

  /// Identyfikator scenariusza
  @Column(name = "scenario_id", nullable = false)
  private Integer scenarioId;

  /// Referencja do scenariusza
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "scenario_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private Scenario scenario;

  //-------------------------Funkcje statyczne
  public static ScenarioPhase create(
    ScenarioPhaseSaveRequest request,
    Integer scenarioId
  ) {
    return new ScenarioPhase(
      null,
      request.title(),
      request.description(),
      request.color(),
      request.startTime(),
      request.endTime(),
      scenarioId,
      null
    );
  }
}
