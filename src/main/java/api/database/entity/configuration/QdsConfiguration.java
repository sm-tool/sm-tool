package api.database.entity.configuration;

import api.database.entity.object.QdsObjectType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Przechowuje globalne ustawienia konfiguracyjne systemu.
/// Zawiera domyślne wartości i parametry wpływające na działanie całego systemu.
///
/// # Struktura konfiguracji
/// - Podstawowe typy obiektów, które są nieusuwalne
/// - Domyślne czasy trwania wydarzeń
/// - Typy obiektów dla obserwatorów i aktorów
/// - Klucz prywatny do autoryzacji (opcjonalny)
///
/// # Powiązania
/// {@link QdsObjectType} - typy dla obserwatorów i aktorów
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_configuration")
public class QdsConfiguration {

  /// Stały identyfikator konfiguracji (zawsze 0)
  @JsonIgnore
  @Id
  @Column(name = "id", nullable = false)
  private Integer id = 0;

  /// Klucz prywatny do autoryzacji
  @JsonIgnore
  @Column(name = "private_key", columnDefinition = "TEXT")
  private String privateKey;

  /// Domyślny czas trwania wydarzenia w minutach
  @Column(name = "default_event_duration", columnDefinition = "TEXT")
  private String defaultEventDuration = "10";

  /// Typ obiektu reprezentujący obserwatora
  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "observer_type_id")
  @OnDelete(action = OnDeleteAction.RESTRICT)
  private QdsObjectType observerType;

  /// Typ obiektu reprezentujący aktora
  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "actor_type_id")
  @OnDelete(action = OnDeleteAction.RESTRICT)
  private QdsObjectType actorType;

  /// Lista identyfikatorów podstawowych typów obiektów
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(
    name = "qds_configuration_basic_types_ids",
    joinColumns = @JoinColumn(name = "configuration_id")
  )
  @Column(name = "type_id")
  private List<Integer> typeIds;
}
