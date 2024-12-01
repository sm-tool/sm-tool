package api.database.repository.user;

import api.database.entity.user.QdsUserToObject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QdsUserToObjectRepository
  extends JpaRepository<QdsUserToObject, Integer> {}
