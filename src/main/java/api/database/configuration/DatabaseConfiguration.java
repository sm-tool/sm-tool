package api.database.configuration;

import api.database.repository.RefreshableRepositoryImpl;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
  basePackages = { "api.database.repository" },
  enableDefaultTransactions = false,
  repositoryBaseClass = RefreshableRepositoryImpl.class
)
class DatabaseConfiguration {}
