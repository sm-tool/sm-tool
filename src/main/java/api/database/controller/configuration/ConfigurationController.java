package api.database.controller.configuration;

import api.database.entity.configuration.Configuration;
import api.database.service.configuration.ConfigurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuration")
public class ConfigurationController {

  private final ConfigurationService configurationService;

  @Autowired
  public ConfigurationController(ConfigurationService configurationService) {
    this.configurationService = configurationService;
  }

  //--------------------------------------------------Endpointy GET---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/user")
  public Configuration getConfigurationForUser(
    @RequestParam String name,
    Authentication authentication
  ) {
    return configurationService.getConfigurationForUser(authentication, name);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/scenario")
  public Configuration getConfigurationForScenario(
    @RequestHeader Integer scenarioId,
    @RequestParam String name
  ) {
    return configurationService.getConfigurationForScenario(scenarioId, name);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/scenario/user")
  public Configuration getConfigurationForUserAndScenario(
    @RequestHeader Integer scenarioId,
    @RequestParam String name,
    Authentication authentication
  ) {
    return configurationService.getConfigurationForUserAndScenario(
      authentication,
      scenarioId,
      name
    );
  }
}
