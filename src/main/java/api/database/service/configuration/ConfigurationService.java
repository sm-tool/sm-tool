package api.database.service.configuration;

import api.database.entity.configuration.Configuration;
import api.database.repository.configuration.ConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

/// Serwis zarządzający konfiguracjami w systemie.
/// Pozwala na pobranie konfiguracji w trzech kontekstach:
/// - Dla całego scenariusza
/// - Dla konkretnego użytkownika
/// - Dla kombinacji użytkownik-scenariusz
@Service
public class ConfigurationService {

  private final ConfigurationRepository configurationRepository;

  @Autowired
  public ConfigurationService(ConfigurationRepository configurationRepository) {
    this.configurationRepository = configurationRepository;
  }

  //--------------------------------------------------Pobieranie konfiguracji-------------------------------------------

  /// Pobiera konfigurację zdefiniowaną dla scenariusza.
  ///
  /// @param scenarioId id scenariusza
  /// @param name nazwa konfiguracji
  /// @return obiekt konfiguracji lub null jeśli nie znaleziono
  public Configuration getConfigurationForScenario(
    Integer scenarioId,
    String name
  ) {
    return configurationRepository.findByScenarioIdAndName(scenarioId, name);
  }

  /// Pobiera konfigurację przypisaną do użytkownika.
  /// Identyfikator użytkownika pobierany jest z tokena JWT.
  ///
  /// @param authentication obiekt uwierzytelnienia użytkownika
  /// @param name nazwa konfiguracji
  /// @return obiekt konfiguracji lub null jeśli nie znaleziono
  public Configuration getConfigurationForUser(
    Authentication authentication,
    String name
  ) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    return configurationRepository.findByUserIdAndName(jwt.getSubject(), name);
  }

  /// Pobiera konfigurację zdefiniowaną dla pary użytkownik-scenariusz.
  /// Identyfikator użytkownika pobierany jest z tokena JWT.
  ///
  /// @param authentication obiekt uwierzytelnienia użytkownika
  /// @param scenarioId id scenariusza
  /// @param name nazwa konfiguracji
  /// @return obiekt konfiguracji lub null jeśli nie znaleziono
  public Configuration getConfigurationForUserAndScenario(
    Authentication authentication,
    Integer scenarioId,
    String name
  ) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    return configurationRepository.findByScenarioIdAndUserIdAndName(
      scenarioId,
      jwt.getSubject(),
      name
    );
  }

  //---------------------------------------Wstawianie konfiguracji------------------------------------------------------

  /// Zapisuje konfigurację zdefiniowaną dla scenariusza.
  ///
  /// @param scenarioId id scenariusza
  /// @param name nazwa konfiguracji
  /// @return obiekt konfiguracji lub null jeśli nie znaleziono
  public Configuration saveConfigurationForScenario(
    Integer scenarioId,
    String name,
    String json
  ) {
    return configurationRepository.save(
      new Configuration(null, name, null, scenarioId, json, null, null)
    );
  }

  /// Zapisuje konfigurację przypisaną do użytkownika.
  /// Identyfikator użytkownika pobierany jest z tokena JWT.
  ///
  /// @param authentication obiekt uwierzytelnienia użytkownika
  /// @param name nazwa konfiguracji
  /// @return obiekt konfiguracji lub null jeśli nie znaleziono
  public Configuration saveConfigurationForUser(
    Authentication authentication,
    String name,
    String json
  ) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    return configurationRepository.save(
      new Configuration(null, name, jwt.getSubject(), null, json, null, null)
    );
  }

  /// Zapisuje konfigurację zdefiniowaną dla pary użytkownik-scenariusz.
  /// Identyfikator użytkownika pobierany jest z tokena JWT.
  ///
  /// @param authentication obiekt uwierzytelnienia użytkownika
  /// @param scenarioId id scenariusza
  /// @param name nazwa konfiguracji
  /// @return obiekt konfiguracji lub null jeśli nie znaleziono
  public Configuration saveConfigurationForUserAndScenario(
    Authentication authentication,
    Integer scenarioId,
    String name,
    String json
  ) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    return configurationRepository.save(
      new Configuration(
        null,
        name,
        jwt.getSubject(),
        scenarioId,
        json,
        null,
        null
      )
    );
  }
}
