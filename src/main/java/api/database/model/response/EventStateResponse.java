package api.database.model.response;

import api.database.model.data.EventAssociationsStateData;
import java.util.List;

/// Reprezentuje pełny stan atrybutów i asocjacji dla wydarzenia w danym momencie.
/// Używany do przedstawienia "migawki" stanu obiektów w kontekście wydarzenia.
///
/// # Przechowuje
/// - Stan atrybutów (aktualne wartości)
/// - Stan asocjacji (aktywne powiązania)
///
/// # Zastosowanie
/// - Prezentacja stanu systemu w określonym punkcie czasu
/// - Analiza wpływu wydarzenia na obiekty
/// - Odtwarzanie historycznego stanu obiektów
///
/// # Struktura rekordu
/// @param attributesState lista aktualnych stanów atrybutów
/// @param associationsState lista aktualnych stanów asocjacji
public record EventStateResponse(
  List<EventAttributesStateResponse> attributesState,
  List<EventAssociationsStateData> associationsState
) {}
