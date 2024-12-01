package api.database.repository.user;

import api.database.entity.user.QdsUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsUserRepository extends JpaRepository<QdsUser, String> {
  @Query("SELECT user FROM QdsUser user WHERE user.email = :email")
  QdsUser findByEmail(@Param("email") String email);
}
