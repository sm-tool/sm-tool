package api.database.controller.configuration;

import api.database.entity.configuration.QdsConfiguration;
import api.database.model.configuration.QdsInfoSetting;
import api.database.service.configuration.ConfigurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuration")
public class ConfigurationController {

  private final ConfigurationService configurationService;

  @Autowired
  public ConfigurationController(ConfigurationService configurationService) {
    this.configurationService = configurationService;
  }

  @GetMapping("/all")
  public ResponseEntity<QdsConfiguration> getConfiguration() {
    return ResponseEntity.ok(configurationService.getConfiguration());
  }

  @GetMapping("/one")
  public ResponseEntity<QdsInfoSetting> getConfigurationOne(
    @RequestBody QdsInfoSetting setting
  ) {
    return ResponseEntity.ok(configurationService.getSetting(setting.name()));
  }

  @PostMapping("/one")
  public ResponseEntity<QdsInfoSetting> updateConfigurationOne(
    @RequestBody QdsInfoSetting newSetting
  ) {
    return ResponseEntity.ok(configurationService.updateOneSetting(newSetting));
  }
}
