package api.database.entities;

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
 * Reprezentuje typ obiektu w ramach konkretnego scenariusza.
 *
 * <p>Każdy typ obiektu jest unikalny w ramach scenariusza ({@link QdsScenario}),
 * oraz tytułu. </p>
 *
 * <p>Rozróżniane są obiekty o typie podstawowym i rozszerzonym,
 * każdy podstawowy obiekt jest rozróżnialny przez swój kształt i kolor.
 * Typy podstawowe i rozszerzone nie posiadają żadnych specjalnych zależności poza domyślnym kształtem i kolorem.
 * Przy tworzeniu typu rozszerzonego użytkownik może podać własny kolor typu.</p>
 *
 * <p>Służy do kategoryzacji obiektów i szablonów oraz definiowania szablonu AKTORa jako roli</p>
 *
 * <p>Typ obiektu może być powiązany z wieloma obiektami ({@link QdsObject}) i
 * szablonami ({@link QdsObjectTemplate}).</p>
 *
 * <p><b>isOnlyGlobal</b> wskazuje na możliwość tworzenia obiektów danego typu po za kontekstem globalnym</p>
 *
 * <p>Usuwany wraz ze scenariuszem.<br/>Usunięcie jego samego jest możliwe tylko gdy
 * nie istnieje żaden obiekt bądź szablon danego typu.</p>
 *
 * @see QdsScenario
 * @see QdsObject
 * @see QdsObjectTemplate
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_object_type",
  indexes = {
    @Index(
      name = "qds_object_type_scenario_id_title_uindex",
      columnList = "scenario_id, title",
      unique = true
    ),
  }
)
public class QdsObjectType {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_object_type_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", nullable = false)
  private QdsScenario scenario;

  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  @Column(name = "color", columnDefinition = "TEXT")
  private String color;

  @Column(name = "is_only_global")
  private Boolean isOnlyGlobal;

  @ManyToMany
  @JoinTable(
    name = "_qds_object_to_type",
    joinColumns = @JoinColumn(name = "type_id"),
    inverseJoinColumns = @JoinColumn(name = "object_id")
  )
  private Set<QdsObject> qdsObjects = new LinkedHashSet<>();

  @ManyToMany
  @JoinTable(
    name = "_qds_object_type_to_template",
    joinColumns = @JoinColumn(name = "object_type_id"),
    inverseJoinColumns = @JoinColumn(name = "template_id")
  )
  private Set<QdsObjectTemplate> qdsObjectTemplates = new LinkedHashSet<>();

  @OneToMany(mappedBy = "firstObjectType")
  private Set<QdsAssociationType> qdsFirstAssociationType =
    new LinkedHashSet<>();

  @OneToMany(mappedBy = "secondObjectType")
  private Set<QdsAssociationType> qdsSecondAssociationType =
    new LinkedHashSet<>();
}
