package api.database.entities;

import api.database.classes.threads.response.QdsThread;
import jakarta.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje statyczny obiekt, który jest częścią konkretnego scenariusza.
 *
 * <p>Każdy obiekt jest przypisany do scenariusza ({@link QdsScenario}) .
 * Obiekty są kategoryzowane
 * według typu obiektu ({@link QdsObjectType}). Przy czym obiekt w szczególności może
 * posiadać wiele typów<br/>
 * Każdy typ umożliwia powiązanie obiektu z szablonem {@link QdsObjectTemplate} według jego wartości </p>
 *
 * <p>Obiekt przypisany jest do danego wątku {@link QdsThread} przy czym przy evencie fork
 * możliwe będzie dalsze jego przekazanie do wątku wychodzącego.</p>
 *
 * <p>Może także brać udział w
 * różnych asocjacjach ({@link QdsAssociation}) jako obiekt pierwszy
 * bądź drugi. Posiada również atrybuty
 * ({@link QdsAttribute}), które definiują jego właściwości.</p>
 *
 * <p>Usuwany wraz ze scenariuszem.<br/>
 * Jego wystąpienie uniemożliwia usunięcie roli aktora, typu obiektu oraz tagów.
 * </p>
 *
 * @see QdsScenario
 * @see QdsObjectType
 * @see QdsObjectTemplate
 * @see QdsThread
 * @see QdsAssociation
 * @see QdsAttribute
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_object",
  indexes = {
    @Index(
      name = "qds_object_scenario_id_name_uindex",
      columnList = "scenario_id, name",
      unique = true
    ),
  }
)
public class QdsObject {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_object_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", nullable = false)
  private QdsScenario scenario;

  @Column(name = "name", nullable = false, columnDefinition = "TEXT")
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(name = "template_id")
  private QdsObjectTemplate template;

  //  @ManyToMany
  //  @JoinTable(
  //    name = "_qds_object_to_thread",
  //    joinColumns = @JoinColumn(name = "object_id"),
  //    inverseJoinColumns = @JoinColumn(name = "thread_id")
  //  )
  //  private Set<QdsThreadInfo> qdsThreadInfos = new LinkedHashSet<>();

  @ManyToMany
  @JoinTable(
    name = "_qds_object_to_type",
    joinColumns = @JoinColumn(name = "object_id"),
    inverseJoinColumns = @JoinColumn(name = "type_id")
  )
  private Set<QdsObjectType> qdsObjectTypes = new LinkedHashSet<>();

  @OneToMany(mappedBy = "object2")
  private Set<QdsAssociation> qdsAssociations2 = new LinkedHashSet<>();

  @OneToMany(mappedBy = "object")
  private Set<QdsAttribute> qdsAttributes = new LinkedHashSet<>();
}
