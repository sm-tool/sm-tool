package api.database.entity.thread;

import api.database.entity.object.ObjectInstance;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje przypisanie obiektu do wątku w danym czasie.
/// Zarządza dostępnością obiektów w wątkach i uczestniczy w transferze
/// obiektów podczas operacji FORK/JOIN.
///
/// # Ważne zasady
/// - Para (threadId, objectId) musi być unikalna
/// - Obiekt lokalny może być tylko w jednym wątku w danym czasie
/// - Obiekt globalny (z wątku globalnego) przypisany jest zawsze tylko i wyłącznie do wątku globalnego
/// - Usuwana kaskadowo z wątkiem lub obiektem
///
/// # Transfery obiektów
/// - Przy FORK obiekty są rozdzielane między wątki potomne
/// - Przy JOIN obiekty z łączonych wątków przechodzą do wątku wynikowego
/// - Obiekty globalne nie podlegają transferom
///
/// # Powiązania
/// - {@link Thread} - wątek zawierający obiekt
/// - {@link ObjectInstance} - przypisany obiekt
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_thread_to_object",
  indexes = { @Index(columnList = "thread_id,object_id", unique = true) }
)
public class ThreadToObject {

  /// Unikalny identyfikator przypisania
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_thread_to_object_id_gen"
  )
  @SequenceGenerator(
    name = "qds_thread_to_object_id_gen",
    sequenceName = "qds_thread_to_object_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator obiektu
  @Column(name = "object_id", nullable = false)
  private Integer objectId;

  /// Identyfikator wątku
  @Column(name = "thread_id", nullable = false)
  private Integer threadId;

  /// Referencja do obiektu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private ObjectInstance object;

  /// Referencja do wątku
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "thread_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private Thread thread;
}
