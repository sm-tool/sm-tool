package api.database.security;

import api.database.model.security.KeycloakEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/// Kontroler REST przetwarzający zdarzenia z Keycloak.
/// Przekazuje otrzymane wydarzenia do systemu zdarzeń Spring.
///
/// # Konfiguracja routingu
/// - Bazowa ścieżka: `/api/v1/keycloak-events`
/// - Obsługuje POST na ścieżkach `""` i `"/"`
///
/// # Powiązania
/// - {@link KeycloakEvent} - obiekt reprezentujący zdarzenie z Keycloak
@RestController
@RequestMapping("/v1/keycloak-events")
@RequiredArgsConstructor
public class KeycloakEventController {

  private final ApplicationEventPublisher eventPublisher;

  /// Obsługuje zdarzenia otrzymane z Keycloak.
  /// Przekazuje je do systemu zdarzeń Springa do dalszego przetworzenia.
  ///
  /// @param event zdarzenie z Keycloak zawierające typ i dane zdarzenia
  /// @return ResponseEntity z kodem 200 (OK)
  @PostMapping({ "", "/" }) //Wina plugina
  public ResponseEntity<Void> handleKeycloakEvent(
    @RequestBody KeycloakEvent event
  ) {
    // Publikowanie eventu do spring event system
    eventPublisher.publishEvent(event);
    return ResponseEntity.ok().build();
  }
}
