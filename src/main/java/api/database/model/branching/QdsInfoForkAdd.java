package api.database.model.branching;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.hibernate.validator.constraints.Length;

public record QdsInfoForkAdd(
  @NotNull(message = "threadId cannot be null")
  @Min(value = 1, message = "threadId cannot be equal to 0")
  Integer forkedThreadId,
  Integer forkTime,
  String title,
  String description,
  @Length(min = 2, message = "BRANCHING;TOO_LITTLE_OFFSPRINGS;2")
  List<QdsInfoForkOffspring> offsprings
) {}
