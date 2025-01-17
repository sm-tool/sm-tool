package api.database.model.data;

import jakarta.validation.constraints.NotNull;
import java.util.List;

/// Reprezentuje transfer obiektów do wątku potomnego w operacji FORK.
/// Przechowuje:
/// - Id wątku docelowego (null dla nowego wątku)
/// - Listę identyfikatorów obiektów do przeniesienia
///
/// Używane do:
/// - Definiowania przydziału obiektów do wątków potomnych
/// - Walidacji spójności podziału obiektów w FORK
/// - Weryfikacji kompletności transferu (czy wszystkie obiekty lokalne są przekazane)
/// - Sprawdzania czy obiekty połączone asocjacją są przenoszone razem
///
/// @apiNote Jeśli id jest null, oznacza to że wątek docelowy jeszcze nie istnieje
/// i zostanie utworzony podczas operacji FORK
public record OffspringObjectTransferData(
  Integer id,
  @NotNull(message = "NULL_VALUE;OBJECT_TRANSFER;objectIds")
  List<Integer> objectIds
) {}
