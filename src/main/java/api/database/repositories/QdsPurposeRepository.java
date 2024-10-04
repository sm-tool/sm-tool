package api.database.repositories;

import api.database.entities.QdsPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsPurposeRepository extends JpaRepository<QdsPurpose, Long> {}
