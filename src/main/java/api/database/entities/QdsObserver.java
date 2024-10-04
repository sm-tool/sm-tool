package api.database.entities;

import api.database.classes.threads.response.QdsThread;
import jakarta.persistence.*;
//import java.util.LinkedHashSet;
//import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje rolę obserwatora w ramach konkretnego scenariusza.
 *
 * <p>Każda rola obserwatora ({@code name}) jest unikalna w ramach scenariusza
 * ({@link QdsScenario}) i może być powiązana z wieloma wątkami
 * ({@link QdsThread}) w tym scenariuszu.</p>
 *
 * <p>Jest to perspektywa za pomocą której można oglądać scenariusz, w danej perspektywie będą
 * widoczne wyłącznie wątki które są powiązane z daną rolą</p>
 *
 * <p>Usuwane wraz ze scenariuszem</p>
 *
 * @see QdsScenario
 * @see QdsThread
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_observer",
  indexes = {
    @Index(
      name = "qds_observer_scenario_id_title_uindex",
      columnList = "scenario_id, title",
      unique = true
    ),
  }
)
public class QdsObserver {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_role_observer_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "name", nullable = false, columnDefinition = "TEXT")
  private String name;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", nullable = false)
  private QdsScenario scenario;
  //  @ManyToMany
  //  @JoinTable(
  //    name = "_qds_observer_to_thread",
  //    joinColumns = @JoinColumn(name = "observer_id"),
  //    inverseJoinColumns = @JoinColumn(name = "thread_id")
  //  )
  //  private Set<QdsThreadInfo> qdsThreadInfos = new LinkedHashSet<>();
}
