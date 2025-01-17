package api.database.repository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.Optional;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.lang.NonNull;

public class RefreshableRepositoryImpl<T, ID>
  extends SimpleJpaRepository<T, ID>
  implements RefreshableRepository<T, ID> {

  private final EntityManager em;

  public RefreshableRepositoryImpl(Class<T> domainClass, EntityManager em) {
    super(domainClass, em);
    this.em = em;
  }

  public RefreshableRepositoryImpl(
    JpaEntityInformation<T, ?> entityInformation,
    EntityManager em
  ) {
    super(entityInformation, em);
    this.em = em;
  }

  @Override
  @Transactional
  public <S extends T> S saveAndRefresh(S entity) {
    S saved = super.save(entity);
    em.flush();
    em.refresh(saved);
    return saved;
  }

  @Override
  @NonNull
  @Transactional
  public Optional<T> findById(@NonNull ID id) {
    Optional<T> entity = super.findById(id);
    entity.ifPresent(em::detach);
    return entity;
  }
}
