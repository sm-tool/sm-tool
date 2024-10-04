package api.database.entities;

import api.database.classes.threads.response.QdsThread;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;
//import java.util.LinkedHashSet;
//import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Reprezentuje scenariusz, który integruje wszystkie kluczowe elementy i wydarzenia.
 *
 * <p>Scenariusz jest centralnym elementem, który organizuje różne
 * zasoby, role, obiekty, wątki oraz ich interakcje w określonych przedziałach czasowych.</p>
 *
 * <p>Każdy scenariusz posiada:</p>
 * <ul>
 *   <li><b>Tytuł</b> - krótka nazwa scenariusza.</li>
 *   <li><b>Opis</b> - opcjonalny, szczegółowy opis scenariusza,
 *       który może zawierać dodatkowe informacje kontekstowe.</li>
 *   <li><b>Kontekst</b> - opcjonalny kontekst, który może zawierać
 *       informacje lub metadane specyficzne dla scenariusza.</li>
 *   <li><b>StartDate</b> i <b>EndDate</b> - czas rozpoczęcia i zakończenia
 *       scenariusza, który definiuje jego okres aktywności.</li>
 *   <li><b>ActionLength</b> - długość akcji scenariusza.</li>
 *   <li><b>Cel (Purpose)</b> - każdy scenariusz jest powiązany z określonym celem
 *       ({@link QdsPurpose}), który definiuje jego ogólną misję lub zadanie.</li>
 * </ul>
 *
 * <p>Scenariusz jest powiązany z wieloma kluczowymi elementami:</p>
 * <ul>
 *   <li>{@link QdsAssociationType} - Typy asocjacji definiujące relacje pomiędzy obiektami.</li>
 *   <li>{@link QdsObject} - Obiekty, które są częścią scenariusza i mogą wchodzić
 *       w różne interakcje.</li>
 *   <li>{@link QdsObjectTemplate} - Szablony obiektów, które definiują atrybuty wspólne
 *       dla grupy obiektów w scenariuszu.</li>
 *   <li>{@link QdsObjectType} - Typy przypisane do obiektów w scenariuszu, które ułatwiają ich klasyfikację.</li>
 *   <li>{@link QdsPermission} - Uprawnienia, które definiują dostęp użytkowników
 *       do scenariusza i jego zasobów.</li>
 *   <li>{@link QdsObserver} - Role obserwatorów, które mogą monitorować wątki w scenariuszu.</li>
 *   <li>{@link QdsScenarioHistory} - Historia zmian w scenariuszu, przechowująca informacje o modyfikacjach.</li>
 *   <li>{@link QdsScenarioPhase} - Fazy scenariusza, które dzielą go na mniejsze etapy.</li>
 *   <li>{@link QdsThread} - Wątki na których istnieją wydarzenia.</li>
 * </ul>
 *
 * <p>Usuwa WSZYSTKO dotyczące jego samego, poza celami (których usunięcie z kolei uniemożliwia).</p>
 *
 * @see QdsPurpose
 * @see QdsAssociationType
 * @see QdsObject
 * @see QdsObjectTemplate
 * @see QdsObjectType
 * @see QdsPermission
 * @see QdsObserver
 * @see QdsScenarioHistory
 * @see QdsScenarioPhase
 * @see QdsThread
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_scenario")
public class QdsScenario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ColumnDefault("nextval('qds_scenario_id_seq'::regclass)")
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "context", columnDefinition = "TEXT")
  private String context;

  @Column(name = "start_date", nullable = false)
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime startDate;

  @Column(name = "end_date", nullable = false)
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime endDate;

  @Column(name = "action_duration")
  private Integer actionDuration;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @JoinColumn(name = "purpose_title", nullable = false)
  private QdsPurpose purposeTitle;
  //  @OneToMany(fetch = FetchType.EAGER) albo Hibernate.initialize(qdsScenario.getQdsAssociationTypes());
  //  do zbadania
  //  private Set<QdsAssociationType> qdsAssociationTypes = new LinkedHashSet<>();
  //
  //  private Set<QdsObject> qdsObjects = new LinkedHashSet<>();
  //
  //  private Set<QdsObjectTemplate> qdsObjectTemplates = new LinkedHashSet<>();
  //
  //  private Set<QdsObjectType> qdsObjectTypes = new LinkedHashSet<>();
  //
  //  private Set<QdsPermission> qdsPermissions = new LinkedHashSet<>();
  //
  //  private Set<QdsObserver> qdsObservers = new LinkedHashSet<>();
  //
  //  private Set<QdsScenarioHistory> qdsScenarioHistory = new LinkedHashSet<>();
  //
  //  private Set<QdsScenarioPhase> qdsScenarioPhases = new LinkedHashSet<>();

}
