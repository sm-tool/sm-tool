package api.database.entity.event;

import api.database.entity.association.QdsAssociation;
import api.database.entity.object.QdsAttributeChange;
import api.database.entity.thread.QdsBranching;
import api.database.entity.thread.QdsThread;
import api.database.model.constant.QdsEventType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje wydarzenie w scenariuszu zachodzące w określonym czasie i wątku.
/// Wydarzenia są podstawowym mechanizmem wprowadzania zmian w systemie,
/// odpowiadają za modyfikacje atrybutów obiektów i ich asocjacji.
///
/// # Ważne zasady
/// - Para (wątek, czas) musi być unikalna
/// - Typy wydarzeń dzielą się na:
///   - Standardowe (GLOBAL, NORMAL, IDLE) - wymagają tytułu i opisu
///   - Kontrolne (START, END) - bez tytułu i opisu
///   - Rozgałęzień (JOIN_IN/OUT, FORK_IN/OUT) - powiązane z branchingId, bez tytułu i opisu
/// - Wydarzenia standardowe są jedynym miejscem modyfikacji atrybutów i asocjacji
/// - Wydarzenia GLOBAL mają priorytet nad NORMAL
///
/// # Constraints
/// ```sql
/// -- Walidacja typu i powiązania z rozgałęzieniem
/// branching_id IS NULL AND event_type IN ('GLOBAL','NORMAL','IDLE','START','END') OR
/// branching_id IS NOT NULL AND event_type IN ('JOIN_IN','JOIN_OUT','FORK_IN','FORK_OUT')
///
/// -- Walidacja obecności tytułu/opisu w zależności od typu
/// title IS NULL AND description IS NULL AND event_type IN ('JOIN_IN','JOIN_OUT','FORK_IN','FORK_OUT','START','END') OR
/// title IS NOT NULL AND description IS NOT NULL AND event_type IN ('GLOBAL', 'NORMAL', 'IDLE')
/// ```
///
/// # Powiązania
/// - {@link QdsThread} - wątek zawierający wydarzenie
/// - {@link QdsBranching} - powiązane rozgałęzienie (dla wydarzeń FORK/JOIN)
/// - {@link QdsAssociation} - modyfikowane asocjacje
/// - {@link QdsAttributeChange} - modyfikowane atrybuty
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_event",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = { "thread_id", "event_time" }),
  }
)
@Check(
  constraints = "branching_id IS NULL AND event_type IN ('GLOBAL','NORMAL','IDLE','START','END') OR " +
  "branching_id IS NOT NULL AND event_type IN ('JOIN_IN','JOIN_OUT','FORK_IN','FORK_OUT')"
)
@Check(
  constraints = "title IS NULL AND description IS NULL AND event_type IN ('JOIN_IN','JOIN_OUT','FORK_IN','FORK_OUT','START','END') OR " +
  "title IS NOT NULL AND description IS NOT NULL AND event_type IN ('GLOBAL', 'NORMAL', 'IDLE')"
)
public class QdsEvent {

  /// Unikalny identyfikator wydarzenia
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_event_id_gen"
  )
  @SequenceGenerator(
    name = "qds_event_id_gen",
    sequenceName = "qds_event_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator wątku
  @Column(name = "thread_id", nullable = false)
  private Integer threadId;

  /// Czas wydarzenia
  @Column(name = "event_time", nullable = false)
  private Integer eventTime;

  /// Typ wydarzenia
  @Column(name = "event_type", columnDefinition = "TEXT")
  @Enumerated(EnumType.STRING)
  private QdsEventType eventType;

  /// Tytuł wydarzenia (tylko dla GLOBAL/NORMAL/IDLE)
  @Column(name = "title", columnDefinition = "TEXT")
  private String title;

  /// Opis wydarzenia (tylko dla GLOBAL/NORMAL/IDLE)
  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  /// Identyfikator powiązanego rozgałęzienia (tylko dla FORK/JOIN)
  @Column(name = "branching_id")
  private Integer branchingId;

  /// Referencja do wątku
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.NO_ACTION)
  @JoinColumn(
    name = "thread_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsThread thread;

  /// Referencja do rozgałęzienia
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.NO_ACTION)
  @JoinColumn(name = "branching_id", insertable = false, updatable = false)
  private QdsBranching branching;
}
