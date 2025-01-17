/// Pakiet zawierający modele danych współdzielone między backendem a API wewnętrznym.
/// W przeciwieństwie do modeli w [api.database.model.domain], te struktury
/// są widoczne i używane przez inne usługi poprzez API.
///
/// # Główne typy danych
/// | Kategoria | Klasy |
/// |-----------|--------|
/// | Zmiany | [AssociationChangeData], [AttributeChangeData] |
/// | Rozgałęzienia | [BranchingData], [OffspringData], [OffspringObjectTransferData] |
/// | Projekcje | [EventAssociationsStateData] |
///
/// # Zastosowanie
/// - Wymiana danych poprzez API wewnętrzne
/// - Przechowywanie i przetwarzanie zmian w wydarzeniach
/// - Zarządzanie transferami obiektów w rozgałęzieniach
/// - Mapowanie wyników zapytań przez projekcje JPA
/// - Walidacja poprawności danych przez adnotacje Bean Validation
package api.database.model.data;
