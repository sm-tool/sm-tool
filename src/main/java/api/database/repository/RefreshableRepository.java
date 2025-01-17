package api.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface RefreshableRepository<T, ID> extends JpaRepository<T, ID> {
  <S extends T> S saveAndRefresh(S entity);
}
