package api.database.repositories;

import api.database.entities.QdsScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsScenarioRepository
  extends JpaRepository<QdsScenario, Long>, QdsScenarioRepositoryCustom {
  QdsScenario findQdsScenarioById(Integer id);
}
