package api.database.service.configuration;

import api.database.entity.configuration.QdsConfiguration;
import api.database.model.configuration.QdsInfoSetting;
import api.database.repository.configuration.QdsConfigurationRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfigurationService {

  private final QdsConfigurationRepository qdsConfigurationRepository;

  public static final Integer CONFIG_ID = 0;

  @Autowired
  public ConfigurationService(
    QdsConfigurationRepository qdsConfigurationRepository
  ) {
    this.qdsConfigurationRepository = qdsConfigurationRepository;
  }

  //--------------------------------------------------Inicjalizacja konfiguracji--------------------------------------------------
  /** Funkcja inicjalizująca konfigurację w przypadku gdy ta nie istnieje
   * @apiNote Wykonywana w ramach własnej transakcji
   */
  @Transactional
  @PostConstruct
  public void initializeConfigurationIfNeeded() {
    qdsConfigurationRepository.initializeConfigurationIfNeeded();
  }

  //--------------------------------------------------Pobieranie konfiguracji---------------------------------------------------------
  /** Funkcja pobierająca wszystkie ustawienia konfiguracji
   * @apiNote Wykonywana w ramach osobnej transakcji
   */
  @Transactional
  public QdsConfiguration getConfiguration() {
    return qdsConfigurationRepository.getConfiguration(CONFIG_ID);
  }

  /** Funkcja pobierająca jedno konkretne ustawienie z konfiguracji
   * @apiNote Wykonywana w ramach osobnej transakcji
   */
  @Transactional
  public QdsInfoSetting getSetting(String name) {
    System.out.println(name);
    if ("type_id".equals(name)) {
      return new QdsInfoSetting(
        name,
        qdsConfigurationRepository.getTypeIds().toString()
      );
    } else {
      return new QdsInfoSetting(
        name,
        qdsConfigurationRepository.getSetting(name)
      );
    }
  }

  //--------------------------------------------------Zmiana konfiguracji---------------------------------------------------------
  /** Funkcja aktualizująca jedno ustawienie z konfiguracji
   * @apiNote Wykonywana w ramach osobnej transakcji
   */
  public QdsInfoSetting updateOneSetting(QdsInfoSetting newSetting) {
    qdsConfigurationRepository.updateSetting(newSetting);
    return newSetting;
  }
}
