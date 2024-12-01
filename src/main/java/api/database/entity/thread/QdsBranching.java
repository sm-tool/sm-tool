package api.database.entity.thread;

import api.database.entity.scenario.QdsScenario;
import api.database.model.constant.QdsBranchingType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

/// Reprezentuje operację rozgałęzienia wątków (FORK/JOIN) w scenariuszu.
/// Definiuje punkt w czasie, w którym następuje podział jednego wątku na wiele (FORK)
/// lub połączenie wielu wątków w jeden (JOIN).
///
/// # Ważne zasady
/// - Rozgałęzienie zawsze zachodzi w konkretnym czasie
/// - Typ rozgałęzienia (FORK/JOIN) określa także sposób transferu obiektów:
///   - FORK: jeden wątek dzieli się na wiele, obiekty są rozdzielane
///   - JOIN: wiele wątków łączy się w jeden, obiekty są łączone
/// - Dla typu FORK flaga isCorrect wskazuje na poprawność transferu obiektów
///
/// # Walidacja FORK
/// - isCorrect=false oznacza konieczność ponownego przydzielenia obiektów
/// - Ustawiany na false gdy:
///   - Dodano nowe obiekty do wątku źródłowego
///   - Zmieniono asocjacje obiektów przed FORK
///   - Usunięto wątek występujący po rozgałęzieniu
///
/// # Powiązania
/// - {@link QdsScenario} - scenariusz zawierający rozgałęzienie
/// - {@link QdsThread} - wątki uczestniczące w rozgałęzieniu
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_branching")
public class QdsBranching {

  /// Unikalny identyfikator rozgałęzienia
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_branching_id_gen"
  )
  @SequenceGenerator(
    name = "qds_branching_id_gen",
    sequenceName = "qds_branching_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator scenariusza
  @Column(name = "scenario_id", nullable = false)
  private Integer scenarioId;

  /// Czas rozgałęzienia
  @Column(name = "branching_time", nullable = false)
  private Integer branchingTime;

  /// Tytuł rozgałęzienia
  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  /// Opis rozgałęzienia
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  /// Typ rozgałęzienia (FORK/JOIN)
  @Column(name = "branching_type", nullable = false, columnDefinition = "TEXT")
  @Enumerated(EnumType.STRING)
  private QdsBranchingType branchingType;

  /// Flaga poprawności transferu obiektów (tylko dla FORK)
  @Column(name = "is_correct")
  private Boolean isCorrect;

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
