/// Pakiet zawierający wewnętrzne modele domenowe związane z asocjacjami (powiązaniami między obiektami).
/// Składa się z projekcji JPA i rekordów pomocniczych używanych przy zarządzaniu asocjacjami.
///
/// # Projekcje JPA
/// | Interfejs | Zastosowanie |
/// |-----------|--------------|
/// | {@link api.database.model.domain.association.InternalAssociationIdWithObjectTypes} | Asocjacja z typami obiektów |
/// | {@link api.database.model.domain.association.InternalAssociationKeyWithId} | Klucz asocjacji z jej id |
/// | {@link api.database.model.domain.association.InternalEventAssociationChange} | Zmiana asocjacji w wydarzeniu |
/// | {@link api.database.model.domain.association.InternalLastAssociationChange} | Ostatnia zmiana asocjacji |
/// | {@link api.database.model.domain.association.InternalLastAssociationOperation} | Ostatnia operacja na asocjacji |
///
/// # Rekordy pomocnicze
/// | Rekord | Zastosowanie |
/// |--------|--------------|
/// | {@link api.database.model.domain.association.InternalAssociationKey} | Klucz identyfikujący asocjację |
/// | {@link api.database.model.domain.association.InternalAssociationObjectTypes} | Typy obiektów w asocjacji |
///
/// # Zastosowanie
/// - Walidacja powiązań między obiektami
/// - Śledzenie historii zmian asocjacji
/// - Zarządzanie operacjami na asocjacjach
/// - Weryfikacja zgodności typów obiektów
package api.database.model.domain.association;
