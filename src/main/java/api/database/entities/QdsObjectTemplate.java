package api.database.entities;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;

/**
 * Reprezentuje szablon obiektu w ramach konkretnego scenariusza.
 *
 * <p>Każdy szablon obiektu jest unikalny w ramach scenariusza ({@link QdsScenario}),
 * oraz tytułu. Szablon obiektu posiada zestaw
 * atrybutów opisujących jego właściwości, przechowywanych jako tablica
 * tekstowa.</p>
 *
 * <p>Szablon obiektu należy do określonego typu obiektu ({@link QdsObjectType}) w szczególności
 * więcej niż jednego i
 * można go przypisać tylko obiektom o tym samym typie</p>
 *
 * <p>Szablon obiektu może być powiązany z wieloma obiektami ({@link QdsObject}),
 * które dziedziczą jego atrybuty i są częścią scenariusza.</p>
 *
 * <p>Usuwany wraz ze scenariuszem.<br/>Usunięcie jego samego jest możliwe tylko gdy
 * nie istnieje żaden obiekt używający danego szablonu.</p>
 *
 * @see QdsScenario
 * @see QdsObjectType
 * @see QdsObject
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_object_template",
  uniqueConstraints = {
    @UniqueConstraint(
      name = "qds_object_template_scenario_id_title_key",
      columnNames = { "scenario_id", "title" }
    ),
  }
)
public class QdsObjectTemplate {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_object_template_id_seq')")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  @JdbcTypeCode(SqlTypes.ARRAY)
  @Column(name = "attributes", nullable = false, columnDefinition = "TEXT[]")
  private String[] attributes;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", nullable = false)
  private QdsScenario scenario;

  @ManyToMany
  @JoinTable(
    name = "_qds_object_type_to_template",
    joinColumns = @JoinColumn(name = "template_id"),
    inverseJoinColumns = @JoinColumn(name = "object_type_id")
  )
  private Set<QdsObjectType> qdsObjectTypes = new LinkedHashSet<>();

  @OneToMany(mappedBy = "template")
  private Set<QdsObject> qdsObjects = new LinkedHashSet<>();
}
