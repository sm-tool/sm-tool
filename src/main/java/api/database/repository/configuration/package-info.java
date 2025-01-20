/// Pakiet zawiera repozytorium do zarządzania konfiguracjami w systemie.
/// Umożliwia przechowywanie i odczyt ustawień powiązanych z użytkownikami
/// i scenariuszami.
///
/// # Główne komponenty
/// - {@link api.database.repository.configuration.ConfigurationRepository} - repozytorium
///   konfiguracji umożliwiające podstawowe operacje CRUD oraz wyszukiwanie po:
///   - użytkowniku i nazwie
///   - scenariuszu i nazwie
///   - scenariuszu, użytkowniku i nazwie
///
/// # Struktura konfiguracji
/// - Każda konfiguracja ma unikalną nazwę w kontekście użytkownika i/lub scenariusza
/// - Przechowuje ustawienia w formacie JSON
/// - Może być powiązana z:
///   - konkretnym użytkownikiem
///   - konkretnym scenariuszem
///   - kombinacją użytkownika i scenariusza
///
/// # Powiązane encje
/// - {@link api.database.entity.configuration.Configuration} - encja reprezentująca
///   pojedynczy wpis konfiguracyjny
/// - {@link api.database.entity.scenario.Scenario} - scenariusz, którego może dotyczyć
///   konfiguracja
/// - {@link api.database.entity.user.User} - użytkownik, do którego może należeć
///   konfiguracja
///
/// # Zastosowanie
/// - Przechowywanie preferencji użytkownika
/// - Konfiguracja scenariuszy
/// - Zapisywanie stanu interfejsu użytkownika
/// - Zachowywanie ustawień pomiędzy sesjami
package api.database.repository.configuration;
