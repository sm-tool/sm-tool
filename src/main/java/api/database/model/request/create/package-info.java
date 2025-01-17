/// Pakiet ten zawiera rekordy, które umożliwiają bezpośrednie wstawienie encji.
///
/// Zawiera struktury danych wykorzystywane podczas tworzenia nowych elementów w bazie danych.
/// Każdy rekord reprezentuje minimalny zestaw danych wymagany do utworzenia danej encji.
/// Takie które nie potrzebują dodatkowych informacji dla powiązanych encji.
///
/// ## Dostępne klasy:
/// - {@link api.database.model.request.create.AssociationTypeCreateRequest} - definiowanie typów powiązań
/// - {@link api.database.model.request.create.AttributeTemplateCreateRequest} - szablony atrybutów obiektów
/// - {@link api.database.model.request.create.ObjectTemplateCreateRequest} - szablony dla nowych obiektów
/// - {@link api.database.model.request.create.ObjectInstanceCreateRequest} - definicje instancji/samego obiektu
package api.database.model.request.create;
