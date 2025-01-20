package api.database.security;

import api.database.entity.user.Permission;
import api.database.entity.user.User;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.constant.PermissionType;
import api.database.model.exception.ApiException;
import api.database.repository.user.PermissionRepository;
import api.database.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {

  private final PermissionRepository permissionRepository;
  private final UserRepository userRepository;

  private final Environment env;

  @Autowired
  public PermissionService(
    PermissionRepository permissionRepository,
    UserRepository userRepository,
    Environment env
  ) {
    this.permissionRepository = permissionRepository;
    this.userRepository = userRepository;
    this.env = env;
  }

  public void addAuthor(Integer scenarioId) {
    if (env.acceptsProfiles(Profiles.of("dev"))) return;
    Authentication authentication = SecurityContextHolder.getContext()
      .getAuthentication();
    Jwt jwt = (Jwt) authentication.getPrincipal();
    permissionRepository.save(
      new Permission(
        null,
        PermissionType.AUTHOR,
        scenarioId,
        jwt.getSubject(),
        null,
        null
      )
    );
  }

  public void addPermission(
    String email,
    Integer scenarioId,
    PermissionType permissionType
  ) {
    if (env.acceptsProfiles(Profiles.of("dev"))) return;
    String userId = userRepository.findByEmail(email).getId();

    permissionRepository.save(
      new Permission(null, permissionType, scenarioId, userId, null, null)
    );
  }

  public void removePermission(
    String email,
    Integer scenarioId,
    PermissionType permissionType
  ) {
    if (env.acceptsProfiles(Profiles.of("dev"))) return;
    String userId = userRepository.findByEmail(email).getId();

    permissionRepository.deleteByUserIdAndScenarioId(userId, scenarioId);
  }

  public void checkPermission(String method, Integer scenarioId) {
    if (env.acceptsProfiles(Profiles.of("dev"))) return;
    Authentication authentication = SecurityContextHolder.getContext()
      .getAuthentication();
    Jwt jwt = (Jwt) authentication.getPrincipal();
    Permission permission = permissionRepository.findByUserIdAndScenarioId(
      jwt.getSubject(),
      scenarioId
    );
    if (permission == null) throw new ApiException(
      ErrorCode.LACK_OF_PERMISSIONS,
      ErrorGroup.PERMISSION,
      HttpStatus.FORBIDDEN
    );
    if (
      permission.getType() == PermissionType.VIEW &&
      method.matches("(POST|PUT|DELETE)")
    ) throw new ApiException(
      ErrorCode.LACK_OF_PERMISSIONS,
      ErrorGroup.PERMISSION,
      HttpStatus.FORBIDDEN
    );
  }

  public void checkIfAuthor(Integer scenarioId) {
    if (env.acceptsProfiles(Profiles.of("dev"))) return;
    Authentication authentication = SecurityContextHolder.getContext()
      .getAuthentication();
    Jwt jwt = (Jwt) authentication.getPrincipal();
    Permission permission = permissionRepository.findByUserIdAndScenarioId(
      jwt.getSubject(),
      scenarioId
    );
    if (
      permission == null || permission.getType() != PermissionType.AUTHOR
    ) throw new ApiException(
      ErrorCode.LACK_OF_PERMISSIONS,
      ErrorGroup.PERMISSION,
      HttpStatus.FORBIDDEN
    );
  }

  public String getUser() {
    if (env.acceptsProfiles(Profiles.of("dev"))) return null;
    Authentication authentication = SecurityContextHolder.getContext()
      .getAuthentication();
    Jwt jwt = (Jwt) authentication.getPrincipal();
    return userRepository
      .findById(jwt.getSubject())
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.USER,
          HttpStatus.FORBIDDEN
        )
      )
      .getId();
  }
}
