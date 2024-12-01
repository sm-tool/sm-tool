package api.database.repository.configuration;

import api.database.model.configuration.QdsInfoSetting;
import java.util.List;

public interface QdsConfigurationRepositoryCustom {
  /**
   * <p>Inicjalizacja konfiguracji</p>
   * <p>Dodaje wpis konfiguracji</p>
   * <p>Gdy wpis konfiguracji istnieje nie robi nic,
   * w innym wypadku dodaje także podstawowe typy</p>
   */
  void initializeConfigurationIfNeeded();
  String getSetting(String columnName);
  void updateSetting(QdsInfoSetting newSetting);
  List<Integer> getTypeIds();
}
