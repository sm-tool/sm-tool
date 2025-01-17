package api.database.repository.user;

import api.database.entity.user.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
  Permission findByUserIdAndScenarioId(String userId, Integer scenarioId);

  void deleteByUserIdAndScenarioId(String userId, Integer scenarioId);
}
