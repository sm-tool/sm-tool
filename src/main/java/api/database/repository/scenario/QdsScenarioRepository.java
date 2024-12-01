package api.database.repository.scenario;

import api.database.entity.scenario.QdsScenario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

@RepositoryRestResource(path = "scenario")
public interface QdsScenarioRepository
  extends JpaRepository<QdsScenario, Integer> {
  QdsScenario findQdsScenarioById(Integer id);

  @RestResource(path = "list", rel = "list")
  Page<QdsScenario> findAllBy(Pageable pageable);

  @RestResource(path = "findByTitle", rel = "findByTitle")
  Page<QdsScenario> findByTitleContaining(
    @Param("title") String title,
    Pageable pageable
  );

  @RestResource(path = "findByDescription", rel = "findByDescription")
  Page<QdsScenario> findByDescriptionContaining(
    @Param("description") String description,
    Pageable pageable
  );
}
