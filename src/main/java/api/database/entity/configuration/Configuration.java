package api.database.entity.configuration;

import api.database.entity.scenario.Scenario;
import api.database.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_configuration")
public class Configuration {

  /// Unikalny identyfikator wpisu konfiguracji
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_configuration_id_gen"
  )
  @SequenceGenerator(
    name = "qds_configuration_id_gen",
    sequenceName = "qds_configuration_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  // Nazwa ustawień - unikalna dla użytkownika i scenariusza
  @Column(name = "name", nullable = false, columnDefinition = "TEXT")
  private String name;

  // Użytkownik
  @Column(name = "user_id", columnDefinition = "TEXT")
  private String userId;

  // Scenariusz
  @Column(name = "scenario_id")
  private Integer scenarioId;

  //Ustawienia (json)
  @Column(name = "conf", nullable = false, columnDefinition = "TEXT")
  private String conf;

  // Referencja do scenario
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "scenario_id", updatable = false, insertable = false)
  private Scenario scenario;

  // Referencja do użytkownika
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(name = "user_id", updatable = false, insertable = false)
  private User user;
}
