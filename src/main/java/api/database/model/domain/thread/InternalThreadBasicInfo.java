package api.database.model.domain.thread;

import api.database.model.constant.BranchingType;
import api.database.model.data.OffspringData;
import api.database.model.request.composite.create.JoinCreateRequest;

/// Rekord przechowujący podstawowe informacje o wątku potrzebne przy tworzeniu
/// wątków potomnych (FORK) lub wynikowych (JOIN). Zawiera tylko niezbędne dane
/// opisowe oraz typ rozgałęzienia.
///
/// # Pola
/// - title - tytuł wątku
/// - description - opis wątku
/// - type - typ rozgałęzienia (FORK/JOIN)
///
/// # Metody fabryczne
/// - from(OffspringData) - tworzy instancję dla wątku potomnego (FORK)
/// - from(JoinCreateRequest) - tworzy instancję dla wątku wynikowego (JOIN)
///
/// # Zastosowanie
/// Używany jako pośrednia reprezentacja danych podczas tworzenia nowych wątków
/// w operacjach rozgałęziania, zapewniając spójny format niezależnie od źródła danych.
public record InternalThreadBasicInfo(
  String title,
  String description,
  BranchingType type
) {
  public static InternalThreadBasicInfo from(OffspringData offspringData) {
    return new InternalThreadBasicInfo(
      offspringData.title(),
      offspringData.description(),
      BranchingType.FORK
    );
  }

  public static InternalThreadBasicInfo from(JoinCreateRequest request) {
    return new InternalThreadBasicInfo(
      request.joinTitle(),
      request.joinDescription(),
      BranchingType.JOIN
    );
  }
}
