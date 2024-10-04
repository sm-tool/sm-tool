package api.database.interceptors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class HeaderInterceptor implements HandlerInterceptor {

  // Stałe dla nazw nagłówków
  private static final String SCENARIO_ID_HEADER = "scenarioId";
  private static final String SESSION_ID_HEADER = "SID";

  @Override
  public boolean preHandle(
    HttpServletRequest request,
    HttpServletResponse response,
    Object handler
  ) throws Exception {
    // Pobieranie nagłówków
    String scenarioId = request.getHeader(SCENARIO_ID_HEADER);
    String sessionId = request.getHeader(SESSION_ID_HEADER);

    // Logowanie nagłówków
    System.out.println(
      "Received Request with scenarioId: " +
      scenarioId +
      " and sessionId: " +
      sessionId
    );

    //    // Opcjonalnie: Sprawdzenie, czy nagłówki są obecne
    //    if (scenarioId == null || sessionId == null) {
    //      response.sendError(
    //        HttpServletResponse.SC_BAD_REQUEST,
    //        "Missing scenarioId or sessionId headers"
    //      );
    //      return false; // Zatrzymanie przetwarzania żądania
    //    }

    return true; // Kontynuowanie przetwarzania żądania
  }
}
