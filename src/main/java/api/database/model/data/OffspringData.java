package api.database.model.data;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/// Reprezentuje dane nowego wątku potomnego powstałego z rozgałęzienia (FORK).
/// Agreguje:
/// - Metadane nowego wątku (tytuł, opis)
/// - Informacje o transferze obiektów do tego wątku
///
/// Używane do:
/// - Tworzenia nowych wątków potomnych w operacji FORK
/// - Definiowania sposobu podziału obiektów między wątki
/// - Walidacji poprawności transferów obiektów
/// - Przekazywania danych w żądaniach API
public record OffspringData(
  @NotNull(message = "NULL_VALUE;OBJECT_TRANSFER;title") String title,
  @NotNull(message = "NULL_VALUE;OBJECT_TRANSFER;description")
  String description,
  @Valid
  @NotNull(message = "NULL_VALUE;OBJECT_TRANSFER;transfer")
  OffspringObjectTransferData transfer
) {}
