/// Główny pakiet zawierający wewnętrzne modele domenowe używane w logice biznesowej aplikacji.
/// Zgrupowane w podpakiety odpowiadające głównym obszarom funkcjonalnym.
///
/// # Struktura pakietu
/// | Podpakiet | Opis |
/// |-----------|------|
/// | {@link api.database.model.domain.association} | Modele związane z asocjacjami między obiektami |
/// | {@link api.database.model.domain.attribute} | Modele atrybutów obiektów i ich zmian |
/// | {@link api.database.model.domain.event} | Modele wydarzeń i ich stanów |
/// | {@link api.database.model.domain.object} | Modele instancji obiektów i ich metadanych |
/// | {@link api.database.model.domain.thread} | Modele wątków i ich rozgałęzień |
/// | {@link api.database.model.domain.transfer} | Modele transferu obiektów między wątkami |
///
/// # Charakterystyka
/// - Zawiera wewnętrzne struktury danych używane przez warstwę serwisową
/// - Większość to rekordy i projekcje JPA
/// - Skupia się na reprezentacji wewnętrznych operacji systemu
/// - Nie jest bezpośrednio eksponowany przez API
package api.database.model.domain;
