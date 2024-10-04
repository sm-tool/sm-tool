package api.database.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje zapis historii zmian w scenariuszu.
 *
 * <p>Każdy wpis w historii dokumentuje istotne zmiany dokonane w scenariuszu
 * ({@link QdsScenario}), obejmujące tytuł zmiany, autora oraz datę jej
 * wprowadzenia. Dzięki temu możliwe jest śledzenie ewolucji scenariusza
 * w czasie.</p>
 *
 * <p>Historia zmian jest powiązana z konkretnym scenariuszem, a jej wpisy
 * są automatycznie usuwane w przypadku usunięcia tego scenariusza.</p>
 *
 * @see QdsScenario
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_scenario_history")
public class QdsScenarioHistory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_scenario_history_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  @Column(name = "author", nullable = false, columnDefinition = "TEXT")
  private String author;

  @Column(name = "date", nullable = false)
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime date;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", nullable = false)
  private QdsScenario scenario;
}
