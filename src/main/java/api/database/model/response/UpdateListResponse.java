package api.database.model.response;

import java.util.List;

/// Lista encji które uległy zmianie i wymagają ponownego pobrania przez klienta.
/// Używana do informowania klienta o konieczności odświeżenia konkretnych danych.
///
/// # Zastosowanie
/// - Informowanie o zmianach wymagających odświeżenia po operacjach CRUD
/// - Optymalizacja odświeżania danych (tylko zmienione encje)
/// - Zachowanie spójności stanu po stronie klienta
///
/// # Struktura rekordu
/// @param entitiesToGet lista nazw encji do ponownego pobrania
public record UpdateListResponse(List<String> entitiesToGet) {}
