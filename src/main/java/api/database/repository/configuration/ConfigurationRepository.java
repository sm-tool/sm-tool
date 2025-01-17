package api.database.repository.configuration;

import api.database.entity.configuration.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfigurationRepository
  extends JpaRepository<Configuration, Integer> {
  Configuration findByUserIdAndName(String userId, String name);

  Configuration findByScenarioIdAndName(Integer scenarioId, String name);

  Configuration findByScenarioIdAndUserIdAndName(
    Integer scenarioId,
    String userId,
    String name
  );
}
