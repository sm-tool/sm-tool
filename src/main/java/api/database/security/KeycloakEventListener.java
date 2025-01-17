package api.database.security;

import api.database.entity.user.User;
import api.database.model.constant.PermissionType;
import api.database.model.security.KeycloakEvent;
import api.database.repository.scenario.ScenarioRepository;
import api.database.repository.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KeycloakEventListener {

  private final UserRepository userRepository;
  private final ScenarioRepository scenarioRepository;
  private final PermissionService permissionService;

  @Transactional
  @EventListener
  public void handleKeycloakEvent(KeycloakEvent event) {
    switch (event.type()) {
      case "REGISTER", "CREATE_USER" -> createUser(event);
      case "UPDATE_PROFILE", "UPDATE_USER" -> updateUser(event);
      case "DELETE_USER" -> deleteUser(event.userId());
    }
  }

  private void createUser(KeycloakEvent event) {
    userRepository.save(User.create(event));
    if (scenarioRepository.findById(1).isPresent()) {
      permissionService.addPermission(
        event.details().get("email"),
        1,
        PermissionType.EDIT
      );
    }
  }

  public void updateUser(KeycloakEvent event) {
    userRepository
      .findById(event.userId())
      .ifPresent(user -> {
        user.setEmail(event.details().get("email"));
        user.setFirstName(event.details().get("first_name"));
        user.setLastName(event.details().get("last_name"));
        userRepository.saveAndFlush(user);
      });
  }

  @EventListener
  public void deleteUser(String userId) {
    userRepository.deleteById(userId);
  }
}
