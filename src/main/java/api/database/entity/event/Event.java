package api.database.entity.event;

import api.database.entity.association.Association;
import api.database.entity.object.AttributeChange;
import api.database.entity.thread.Branching;
import api.database.entity.thread.Thread;
import api.database.model.constant.EventType;
import api.database.model.domain.event.InternalEvent;
import api.database.model.domain.event.InternalSpecialEvent;
import api.database.model.request.composite.update.EventUpdateRequest;
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
/// # Wydarzenia FORK/JOIN
/// - FORK_IN - ostatnie wydarzenie na wątku źródłowym wskazujące na podział wątku (FORK)
/// - FORK_OUT - pierwsze wydarzenie w wątku wychodzącym wskazujące na wątek powstały w wyniku podziału (FORK)
/// - JOIN_IN - ostatnie wydarzenie na jednym z wątków źródłowych wskazujące na połączenie wątków (JOIN)
/// - JOIN_OUT - pierwsze wydarzenie w wątku wychodzącym wskazujące na to iż powstało on w wyniku połączenia (JOIN)
/// - Każde wydarzenie FORK/JOIN MUSI być powiązane z Branching za pomocą branching_id
/// - Wszystkie wydarzenia dotyczące tego samego rozgałęzienia mają ten sam branching_id
/// - Dla każdego branchingu wymagany jest komplet odpowiednich eventów we wszystkich
///   powiązanych wątkach
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
/// - {@link Thread} - wątek zawierający wydarzenie
/// - {@link Branching} - powiązane rozgałęzienie (dla wydarzeń FORK/JOIN)
/// - {@link Association} - modyfikowane asocjacje
/// - {@link AttributeChange} - modyfikowane atrybuty
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_event")
@Check(
  constraints = "branching_id IS NULL AND event_type IN ('GLOBAL','NORMAL','IDLE','START','END') OR " +
  "branching_id IS NOT NULL AND event_type IN ('JOIN_IN','JOIN_OUT','FORK_IN','FORK_OUT')"
)
@Check(
  constraints = "title IS NULL AND description IS NULL AND event_type IN ('JOIN_IN','JOIN_OUT','FORK_IN','FORK_OUT','START','END') OR " +
  "title IS NOT NULL AND description IS NOT NULL AND event_type IN ('GLOBAL', 'NORMAL', 'IDLE')"
)
public class Event {

  //----------------------Definicja encji

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
  private EventType eventType;

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
  private Thread thread;

  /// Referencja do rozgałęzienia
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "branching_id", insertable = false, updatable = false)
  private Branching branching;

  //-------------------------Funkcje statyczne
  /// Tworzy wydarzenie na podstawie wewnętrznej reprezentacji i danych aktualizacji.
  /// Używane przy modyfikacji istniejących wydarzeń.
  ///
  /// @param internal wewnętrzna reprezentacja wydarzenia
  /// @param request dane aktualizacji od użytkownika
  /// @param eventType nowy typ wydarzenia
  ///
  /// @return Nowy obiekt {@code Event} z zaktualizowanymi danymi
  public static Event from(
    InternalEvent internal,
    EventUpdateRequest request,
    EventType eventType
  ) {
    return new Event(
      internal.id(),
      internal.threadId(),
      internal.time(),
      eventType,
      request.title(),
      request.description(),
      null,
      null,
      null
    );
  }

  /// Tworzy wydarzenie specjalne (START, END, FORK, JOIN).
  /// Wydarzenia te nie posiadają tytułu ani opisu.
  ///
  /// @param internal - dane wydarzenia specjalnego
  /// @return Nowy obiekt {@code Event} reprezentujący wydarzenie specjalne
  public static Event createSpecial(InternalSpecialEvent internal) {
    return new Event(
      null,
      internal.threadId(),
      internal.time(),
      internal.eventType(),
      null,
      null,
      internal.branchingId(),
      null,
      null
    );
  }

  /// Tworzy wydarzenie typu IDLE (puste) dla podanego czasu i wątku.
  /// Wydarzenie IDLE reprezentuje brak aktywności w danym momencie.
  ///
  /// @param time czas wydarzenia
  /// @param threadId identyfikator wątku
  /// @return Nowy obiekt {@code Event}typu IDLE
  public static Event createIdle(Integer time, Integer threadId) {
    return new Event(
      null, // id - generowany przez bazę
      threadId, // id wątku
      time, // czas wydarzenia
      EventType.IDLE, // typ wydarzenia
      "", // tytuł
      "", // opis
      null, // id branchingu
      null, // referencja do wątku
      null // referencja do branchingu
    );
  }
}
