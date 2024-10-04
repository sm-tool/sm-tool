package api.database.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje fazę scenariusza, określającą kluczowy etap w jego przebiegu.
 *
 * <p>Każda faza scenariusza zawiera opis, czas rozpoczęcia oraz czas zakończenia,
 * definiując istotny odcinek czasu w ramach scenariusza ({@link QdsScenario}).
 * Fazy pomagają strukturyzować scenariusz na mniejsze części.</p>
 *
 * <p>Usuwane wraz ze scenariuszem.</p>
 *
 * @see QdsScenario
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_scenario_phase")
public class QdsScenarioPhase {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_scenario_phase_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  @Column(name = "start_time", nullable = false)
  private Integer startTime;

  @Column(name = "end_time", nullable = false)
  private Integer endTime;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", nullable = false)
  private QdsScenario scenario;
}
