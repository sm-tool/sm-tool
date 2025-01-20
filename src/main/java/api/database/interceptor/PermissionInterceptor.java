package api.database.interceptor;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.security.PermissionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class PermissionInterceptor implements HandlerInterceptor {

  // Stałe dla nazw nagłówków
  private static final String SCENARIO_ID_HEADER = "scenarioId";
  private final PermissionService permissionService;

  @Autowired
  public PermissionInterceptor(PermissionService permissionService) {
    this.permissionService = permissionService;
  }

  @Override
  public boolean preHandle(
    HttpServletRequest request,
    HttpServletResponse response,
    Object handler
  ) {
    // Request
    String method = request.getMethod(); // GET, POST, etc.
    String[] resourceType = request.getServletPath().split("/"); // 0 - ""
    // Error + webhook
    if (resourceType.length < 3) {
      return true;
    }
    if (resourceType[2].equals("attribute-templates")) return true;
    // Scenario in header
    String scenarioId = request.getHeader(SCENARIO_ID_HEADER);
    if (
      resourceType[2].matches(
          "(scenario-phases|branchings|threads|objects|events)"
        ) ||
      (resourceType.length > 3 && resourceType[3].equals("scenario"))
    ) {
      if (scenarioId == null) throw new ApiException(
        ErrorCode.NO_SCENARIO_ID_IN_HEADER,
        ErrorGroup.PERMISSION,
        HttpStatus.FORBIDDEN
      );
      else permissionService.checkPermission(
        method,
        Integer.valueOf(scenarioId)
      );
    }

    return true;
  }
}
