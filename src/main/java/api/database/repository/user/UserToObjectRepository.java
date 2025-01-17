package api.database.repository.user;

import api.database.entity.user.UserToObject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserToObjectRepository
  extends JpaRepository<UserToObject, Integer> {
  void deleteByUserIdAndObjectId(String userId, Integer objectId);
}
