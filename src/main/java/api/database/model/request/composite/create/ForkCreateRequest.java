package api.database.model.request.composite.create;

import api.database.model.data.OffspringData;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ForkCreateRequest(
  @NotNull(message = "NULL_VALUE;BRANCHING;forkedThreadId")
  Integer forkedThreadId,
  @NotNull(message = "NULL_VALUE;BRANCHING;forkTime")
  @Min(value = 1, message = "NEGATIVE_TIME;BRANCHING;forkTime")
  Integer forkTime,
  @NotNull(message = "NULL_VALUE;BRANCHING;title") String title,
  @NotNull(message = "NULL_VALUE;BRANCHING;description") String description,
  @Size(min = 1, message = "TOO_LITTLE_THREADS;BRANCHING;1;0")
  @Valid
  List<OffspringData> offsprings
) {}
