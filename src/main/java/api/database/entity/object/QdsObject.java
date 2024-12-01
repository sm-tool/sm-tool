package api.database.entity.object;

import api.database.entity.association.QdsAssociation;
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
/// - {@link QdsScenario} - kontekst istnienia obiektu
/// - {@link QdsObjectType} - określa możliwe asocjacje
/// - {@link QdsObjectTemplate} - określa wymagane atrybuty
/// - {@link QdsAttribute} - atrybuty obiektu
/// - {@link QdsAssociation} - relacje z innymi obiektami
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_object")
public class QdsObject {

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
  private QdsScenario scenario;

  /// Referencja do szablonu
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(name = "template_id", insertable = false, updatable = false)
  private QdsObjectTemplate template;

  /// Referencja do typu obiektu
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(name = "object_type_id", insertable = false, updatable = false)
  private QdsObjectType objectType;
}
