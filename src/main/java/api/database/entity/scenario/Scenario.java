package api.database.entity.scenario;

import api.database.entity.object.ObjectInstance;
import api.database.entity.thread.Thread;
import api.database.entity.user.Permission;
import api.database.model.request.save.ScenarioSaveRequest;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.hibernate.annotations.UpdateTimestamp;

/// Reprezentuje scenariusz - centralny element systemu organizujący
/// wydarzenia, wątki i obiekty w określonych ramach czasowych.
///
/// # Główne cechy
/// - Ramy czasowe (startDate, endDate)
/// - Długość jednostki czasu (eventDuration)
/// - Metadane (tytuł, opis, kontekst, cel)
/// - Automatyczne znaczniki czasowe (creationDate, lastModificationDate)
///
/// # Elementy scenariusza
/// Scenariusz zawiera lub jest powiązany z:
/// - Obiekty lokalne i globalne
/// - Wątki (w tym wątek globalny)
/// - Wydarzenia w wątkach
/// - Fazy czasowe
/// - Uprawnienia użytkowników
///
/// # Czas w scenariuszu
/// - startDate/endDate określają ramy czasowe
/// - eventDuration definiuje długość pojedynczej jednostki czasu
/// - Fazy mogą dzielić scenariusz na logiczne okresy
///
/// # Powiązania
/// - {@link ObjectInstance} - obiekty lokalne i globalne w scenariuszu
/// - {@link Thread} - sekwencje wydarzeń
/// - {@link ScenarioPhase} - logiczne podziały czasu
/// - {@link Permission} - kontrola dostępu użytkowników
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_scenario")
public class Scenario {

  /// Unikalny identyfikator scenariusza
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_scenario_id_gen"
  )
  @SequenceGenerator(
    name = "qds_scenario_id_gen",
    sequenceName = "qds_scenario_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Tytuł scenariusza
  @Column(name = "title", nullable = false, columnDefinition = "TEXT")
  private String title;

  /// Szczegółowy opis scenariusza
  @Column(name = "description", nullable = false, columnDefinition = "TEXT")
  private String description;

  /// Dodatkowy kontekst
  @Column(name = "context", nullable = false, columnDefinition = "TEXT")
  private String context;

  /// Cel/misja scenariusza
  @Column(name = "purpose", nullable = false, columnDefinition = "TEXT")
  private String purpose;

  /// Data rozpoczęcia scenariusza
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
  @Column(name = "start_date", nullable = false)
  private OffsetDateTime startDate;

  /// Data zakończenia scenariusza
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
  @Column(name = "end_date", nullable = false)
  private OffsetDateTime endDate;

  /// Długość pojedynczej akcji
  @Column(name = "event_duration", nullable = false)
  private Integer eventDuration;

  @Column(name = "event_unit", nullable = false)
  private String eventUnit;

  /// Data utworzenia scenariusza
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
  @CreationTimestamp(source = SourceType.DB)
  @Column(name = "creation_date")
  private OffsetDateTime creationDate;

  /// Data ostatniej modyfikacji

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
  @UpdateTimestamp(source = SourceType.DB)
  @Column(name = "last_modification_date")
  private OffsetDateTime lastModificationDate;

  //-------------------------Funkcje statyczne
  public static Scenario create(ScenarioSaveRequest request) {
    return new Scenario(
      null,
      request.title(),
      request.description(),
      request.context(),
      request.purpose(),
      request.startDate(),
      request.endDate(),
      request.eventDuration(),
      request.eventUnit(),
      null,
      null
    );
  }
}
