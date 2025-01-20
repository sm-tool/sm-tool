/// Główny pakiet zawierający repozytoria do zarządzania dostępem do danych w systemie.
/// Implementuje warstwę persystencji wykorzystując Spring Data JPA oraz natywne zapytania SQL
/// do PostgreSQL.
///
/// ## Bazowy interfejs i implementacja
/// Pakiet definiuje podstawową infrastrukturę dla repozytoriów:
///
/// - {@link api.database.repository.RefreshableRepository} - bazowy interfejs rozszerzający JpaRepository o metodę
///   saveAndRefresh, zapewniającą odświeżenie stanu encji po zapisie
/// - {@link api.database.repository.RefreshableRepositoryImpl} - implementacja bazowego interfejsu zapewniająca:
///   - Automatyczne odświeżanie encji po zapisie
///   - Zarządzanie stanem detached dla encji pobieranych przez findById
///   - Właściwą obsługę transakcji dla operacji modyfikujących
///
/// ## Organizacja pakietu
/// Pakiet jest podzielony na wyspecjalizowane pod-pakiety:
///
/// - `association` - zarządzanie relacjami między obiektami i ich historią zmian
/// - `attribute` - obsługa atrybutów obiektów i ich szablonów
/// - `branching` - zarządzanie rozgałęzieniami (FORK/JOIN) między wątkami
/// - `configuration` - przechowywanie konfiguracji użytkowników i scenariuszy
/// - `event` - obsługa wydarzeń w wątkach scenariusza
/// - `object` - zarządzanie obiektami, ich szablonami i typami
/// - `scenario` - operacje na scenariuszach i ich fazach czasowych
/// - `special` - wyspecjalizowane repozytoria do złożonych operacji
/// - `thread` - zarządzanie wątkami i ich hierarchią
/// - `user` - obsługa użytkowników i ich uprawnień
///
/// ## Główne cechy implementacyjne
/// - Wykorzystanie Spring Data JPA dla standardowych operacji CRUD
/// - Natywne zapytania SQL z CTE dla złożonych operacji
/// - Optymalizacja wydajności poprzez indeksy i złączenia
/// - Transakcyjność operacji modyfikujących dane
/// - Walidacja integralności danych i ograniczeń biznesowych
/// - Kaskadowe usuwanie powiązanych rekordów
/// - Automatyczne odświeżanie stanu encji przez RefreshableRepository
///
/// ## Kluczowe aspekty
/// - Spójna implementacja wzorca Repository
/// - Izolacja logiki dostępu do danych
/// - Optymalizacja zapytań dla dużych zbiorów danych
/// - Obsługa złożonych relacji między encjami
/// - Wsparcie dla hierarchicznych struktur danych
/// - Zarządzanie historią zmian encji w czasie
/// - Właściwe zarządzanie cyklem życia encji
///
/// ## Powiązane komponenty
/// - `api.database.entity` - encje reprezentujące model danych
/// - `api.database.model` - modele pomocnicze i projekcje
/// - `api.service` - warstwa serwisów wykorzystująca repozytoria
///
/// ## Przykład użycia
/// ```java
/// @Autowired
/// private ScenarioRepository scenarioRepository; // rozszerza RefreshableRepository
///
/// // Zapisanie i automatyczne odświeżenie scenariusza
/// Scenario savedScenario = scenarioRepository.saveAndRefresh(scenario);
///
/// // Pobranie odłączonej encji
/// Optional<Scenario> detachedScenario = scenarioRepository.findById(id);
/// ```
package api.database.repository;
