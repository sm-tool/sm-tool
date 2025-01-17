package api.database.entity.thread;

import api.database.entity.scenario.Scenario;
import api.database.model.constant.BranchingType;
import api.database.model.data.BranchingData;
import api.database.model.request.composite.create.ForkCreateRequest;
import api.database.model.request.composite.create.JoinCreateRequest;
import api.database.model.request.composite.update.ForkUpdateRequest;
import api.database.model.request.composite.update.JoinUpdateRequest;
import jakarta.persistence.*;
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
/// - Każdy branching MUSI mieć komplet powiązanych eventów:
///   - FORK: jeden FORK_IN w wątku źródłowym i FORK_OUT w każdym wątku docelowym
///   - JOIN: JOIN_IN w każdym wątku źródłowym i jeden JOIN_OUT w wątku docelowym
/// - Wszystkie eventy danego branchingu mają ten sam branching_id
///
/// # Walidacja FORK
/// - isCorrect=false oznacza konieczność ponownego przydzielenia obiektów
/// - Ustawiany na false gdy:
///   - Dodano nowe obiekty do wątku źródłowego
///   - Zmieniono asocjacje obiektów przed FORK
///   - Usunięto wątek występujący po rozgałęzieniu
///
/// # Powiązania
/// - {@link Scenario} - scenariusz zawierający rozgałęzienie
/// - {@link Thread} - wątki uczestniczące w rozgałęzieniu
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_branching")
public class Branching {

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
  private BranchingType branchingType;

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
  private Scenario scenario;

  //-------------------------Funkcje statyczne
  public static Branching createFork(
    ForkCreateRequest request,
    Integer scenarioId
  ) {
    return new Branching(
      null,
      scenarioId,
      request.forkTime(),
      request.title(),
      request.description(),
      BranchingType.FORK,
      true,
      null
    );
  }

  public static Branching from(
    ForkUpdateRequest request,
    BranchingData data,
    Integer scenarioId
  ) {
    return new Branching(
      data.id(),
      scenarioId,
      data.time(),
      request.title(),
      request.description(),
      BranchingType.FORK,
      true,
      null
    );
  }

  public static Branching createJoin(
    JoinCreateRequest request,
    Integer scenarioId
  ) {
    return new Branching(
      null,
      scenarioId,
      request.joinTime(),
      request.joinTitle(),
      request.joinDescription(),
      BranchingType.JOIN,
      true,
      null
    );
  }

  public static Branching from(
    JoinUpdateRequest request,
    BranchingData data,
    Integer scenarioId
  ) {
    return new Branching(
      data.id(),
      scenarioId,
      data.time(),
      request.joinTitle(),
      request.joinDescription(),
      BranchingType.FORK,
      true,
      null
    );
  }
}
