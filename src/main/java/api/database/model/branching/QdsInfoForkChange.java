package api.database.model.branching;

import java.util.List;
import org.hibernate.validator.constraints.Length;

public record QdsInfoForkChange(
  Integer forkId,
  String title,
  String description,
  @Length(min = 2, message = "BRANCHING;TOO_LITTLE_OFFSPRINGS;2")
  List<QdsInfoForkOffspring> offsprings
) {}
