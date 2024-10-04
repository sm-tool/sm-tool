package api.database.classes;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * Typ danych scenariusza wykorzystywany na liście wszystkich dostępnych
 *
 * <p>Zawiera tytuł, autora oraz datę ostatniej modyfikacji</p>
 */
public record QdsScenarioDetails(
  String title,
  String ownerFirstName,
  String ownerLastName,
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime lastModified
) {}
