package api.database.entity.object;

import api.database.entity.association.Association;
import api.database.entity.scenario.Scenario;
import api.database.model.request.create.ObjectInstanceCreateRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje obiekt w scenariuszu, który może być modyfikowany przez wydarzenia.
/// Obiekt jest globalny jeśli został utworzony w wątku globalnym, w przeciwnym
/// razie jest lokalny i przypisany do konkretnego wątku.
///
/// # Ważne zasady
/// - Obiekt musi być przypisany do scenariusza
/// - Nazwa obiektu musi być unikalna w scenariuszu
/// - Typ i szablon określają dostępne atrybuty i możliwe asocjacje
/// - Obiekty lokalne mogą być tylko w jednym wątku w danym czasie
/// - Obiekty globalne (z wątku globalnego) są dostępne we wszystkich wątkach
///
/// # Transfery obiektów
/// - Obiekty lokalne mogą być przenoszone między wątkami tylko przy FORK/JOIN
/// - Obiekty globalne są zawsze dostępne i nie podlegają transferom
///
/// # Powiązania
/// - {@link Scenario} - kontekst istnienia obiektu
/// - {@link ObjectType} - określa możliwe asocjacje
/// - {@link ObjectTemplate} - określa wymagane atrybuty
/// - {@link Attribute} - atrybuty obiektu
/// - {@link Association} - relacje z innymi obiektami
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_object")
public class ObjectInstance {

  /// Unikalny identyfikator obiektu
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_object_id_gen"
  )
  @SequenceGenerator(
    name = "qds_object_id_gen",
    sequenceName = "qds_object_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator scenariusza
  @Column(name = "scenario_id", nullable = false)
  private Integer scenarioId;

  /// Identyfikator szablonu
  @Column(name = "template_id", nullable = false)
  private Integer templateId;

  /// Identyfikator typu obiektu
  @Column(name = "object_type_id", nullable = false)
  private Integer objectTypeId;

  /// Identyfikator wątku w którym został zdefiniowany obiekt
  ///
  /// Taki sam jak na froncie
  /// - 0 dla globalnego
  /// - faktyczne id wątku dla pozostałych
  @Column(name = "origin_thread_id", nullable = false)
  private Integer originThreadId;

  /// Nazwa obiektu (unikalna w scenariuszu)
  @Column(name = "name", nullable = false, columnDefinition = "TEXT")
  private String name;

  /// Referencja do scenariusza
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(
    name = "scenario_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private Scenario scenario;

  /// Referencja do szablonu
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(name = "template_id", insertable = false, updatable = false)
  private ObjectTemplate template;

  /// Referencja do typu obiektu
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(name = "object_type_id", insertable = false, updatable = false)
  private ObjectType objectType;

  //-------------------------Funkcje statyczne
  public static ObjectInstance create(
    ObjectInstanceCreateRequest request,
    Integer scenarioId
  ) {
    return new ObjectInstance(
      null,
      scenarioId,
      request.templateId(),
      request.objectTypeId(),
      request.originThreadId(), //0 dla globalnych
      request.name(),
      null,
      null,
      null
    );
  }
}
