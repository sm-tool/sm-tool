package api.database.entity.thread;

import api.database.entity.event.QdsEvent;
import api.database.entity.scenario.QdsScenario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

/// Reprezentuje wątek w scenariuszu - sekwencję wydarzeń w czasie.
/// Wątki mogą być normalne (lokalne) lub globalne, mogą się łączyć (JOIN)
/// lub rozdzielać (FORK).
///
/// # Typy wątków
/// - Wątek globalny (isGlobal=true):
///   - Jeden na scenariusz
///   - Wydarzenia GLOBAL mają priorytet nad NORMAL
///   - Obiekty utworzone w nim są dostępne we wszystkich wątkach
/// - Wątek normalny (isGlobal=false):
///   - Może być wiele w scenariuszu
///   - Obiekty lokalne dla wątku
///   - Może uczestniczyć w FORK/JOIN
///
/// Uwaga! Poprzez API wątek globalny rozróżniany jest od lokalnego za pomocą id.
/// Wątek globalny ma je zawsze wysyłane i odbierane jako 0
/// # Wydarzenia w wątku
/// - START - początek wątku, możliwość dodania obiektów
/// - END - koniec wątku
/// - NORMAL/IDLE - standardowe wydarzenia
/// - GLOBAL - standardowe wydarzenie na wątku globalnym
/// - FORK_IN/FORK_OUT - podział wątku
/// - JOIN_IN/JOIN_OUT - łączenie wątków
///
/// # Powiązania
/// - {@link QdsScenario} - scenariusz zawierający wątek
/// - {@link QdsEvent} - wydarzenia w wątku
/// - {@link QdsBranching} - operacje FORK/JOIN
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_thread")
public class QdsThread {

  /// Unikalny identyfikator wątku
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_thread_id_gen"
  )
  @SequenceGenerator(
    name = "qds_thread_id_gen",
    sequenceName = "qds_thread_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator scenariusza
  @Column(name = "scenario_id", nullable = false)
  private Integer scenarioId;

  /// Tytuł wątku
  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  /// Opis wątku
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  /// Czy wątek jest globalny
  @ColumnDefault("false")
  @Column(name = "is_global")
  private Boolean isGlobal;

  /// Referencja do scenariusza
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(
    name = "scenario_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsScenario scenario;
}
