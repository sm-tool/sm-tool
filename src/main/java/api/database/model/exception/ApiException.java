package api.database.model.exception;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/// Wyjątek używany do obsługi błędów biznesowych w API.
/// Zawiera szczegółowe informacje o błędzie, umożliwiające
/// precyzyjne określenie przyczyny i kontekstu wystąpienia problemu.
///
/// # Właściwości
/// - errorCode - Szczegółowy kod błędu
/// - errorGroup - Grupa błędu wskazująca obszar wystąpienia
/// - values - Opcjonalna lista wartości kontekstowych
/// - htmlCode - Kod HTTP odpowiedzi
///
/// # Przykład użycia
/// ```java
/// throw new ApiException(
///     ErrorCode.OBJECT_NOT_FOUND,
///     List.of(objectId.toString()),
///     ErrorGroup.OBJECT,
///     HttpStatus.NOT_FOUND
/// );
/// ```
@Getter
@JsonIgnoreProperties(
  { "cause", "stackTrace", "localizedMessage", "suppressed", "message" }
)
public class ApiException extends RuntimeException {

  /// Kod HTTP odpowiedzi zwracanej do klienta
  @JsonIgnore
  private final HttpStatus htmlCode;

  /// Szczegółowy kod błędu biznesowego
  private final ErrorCode errorCode;
  /// Grupa funkcjonalna błędu
  private final ErrorGroup errorGroup;

  /// Opcjonalna lista wartości kontekstowych błędu
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final List<String> values;

  /// Tworzy wyjątek z pełnymi informacjami o błędzie
  ///
  /// @param errorCode kod błędu
  /// @param values lista wartości kontekstowych
  /// @param errorGroup grupa błędu
  /// @param htmlCode kod HTTP
  public ApiException(
    ErrorCode errorCode,
    List<String> values,
    ErrorGroup errorGroup,
    HttpStatus htmlCode
  ) {
    this.htmlCode = htmlCode;
    this.errorCode = errorCode;
    this.values = values;
    this.errorGroup = errorGroup;
  }

  /// Tworzy wyjątek bez wartości kontekstowych
  ///
  /// @param errorCode kod błędu
  /// @param errorGroup grupa błędu
  /// @param htmlCode kod HTTP
  public ApiException(
    ErrorCode errorCode,
    ErrorGroup errorGroup,
    HttpStatus htmlCode
  ) {
    this.htmlCode = htmlCode;
    this.errorCode = errorCode;
    this.values = null;
    this.errorGroup = errorGroup;
  }
}
