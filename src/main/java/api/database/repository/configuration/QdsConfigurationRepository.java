package api.database.repository.configuration;

import api.database.entity.configuration.QdsConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsConfigurationRepository
  extends
    JpaRepository<QdsConfiguration, Integer>, QdsConfigurationRepositoryCustom {
  @Query(
    value = "SELECT * FROM qds_configuration WHERE id = :configId",
    nativeQuery = true
  )
  QdsConfiguration getConfiguration(@Param("configId") Integer configId);
}
