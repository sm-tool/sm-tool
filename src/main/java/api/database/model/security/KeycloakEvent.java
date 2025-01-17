package api.database.model.security;

import java.util.Map;

/// Record reprezentujący zdarzenie z systemu Keycloak przekazywane przez webhook.
/// Zawiera informacje o akcjach wykonanych na koncie użytkownika, takich jak
/// rejestracja, aktualizacja profilu czy usunięcie konta.
///
/// # Pola
/// - userId - identyfikator użytkownika w Keycloak
/// - type - typ zdarzenia
/// - details - mapa szczegółów zdarzenia zawierająca np. email, imię, nazwisko
///
/// # Obsługiwane typy zdarzeń
/// - REGISTER, CREATE_USER - utworzenie nowego użytkownika
/// - UPDATE_PROFILE, UPDATE_USER - aktualizacja danych użytkownika
/// - DELETE_USER - usunięcie użytkownika
///
public record KeycloakEvent(
  String userId,
  String type,
  Map<String, String> details
) {}
