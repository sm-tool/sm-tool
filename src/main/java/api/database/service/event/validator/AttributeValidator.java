package api.database.service.event.validator;

import api.database.model.constant.AttributeType;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/// Walidator wartości atrybutów obiektów.
/// Weryfikuje zgodność wartości z zadeklarowanym typem atrybutu.
/// Obsługuje typy:
/// - STRING - brak walidacji
/// - INT - poprawna liczba całkowita
/// - DATE - poprawna data w formacie ISO-8601
/// - BOOL - "true" lub "false" (case-insensitive)
@Component
public class AttributeValidator {

  /// Sprawdza zgodność wartości atrybutu z jego typem.
  /// Pusty string jest dozwolony dla wszystkich typów.
  /// Rzuca wyjątek jeśli:
  /// - Typ atrybutu jest null
  /// - Wartość nie jest zgodna z formatem dla danego typu
  ///
  /// @param type typ atrybutu do walidacji
  /// @param value wartość atrybutu do walidacji
  /// @throws ApiException gdy wartość nie spełnia wymagań typu
  /// @apiNote Wykonywana w ramach transakcji nadrzędnej
  public void checkAttributeValue(AttributeType type, String value) {
    if (type == null) throw new ApiException(
      ErrorCode.DOES_NOT_EXIST,
      ErrorGroup.ATTRIBUTE_TEMPLATE,
      HttpStatus.BAD_REQUEST
    );
    if (Objects.equals(value, "")) return;
    switch (type) {
      case STRING:
        break;
      case INT:
        try {
          Integer.parseInt(value);
        } catch (NumberFormatException e) {
          throw new ApiException(
            ErrorCode.WRONG_VALUE_FORMAT,
            List.of("INT"),
            ErrorGroup.ATTRIBUTE,
            HttpStatus.BAD_REQUEST
          );
        }
        break;
      case DATE:
        try {
          Instant.parse(value);
        } catch (DateTimeParseException e) {
          throw new ApiException(
            ErrorCode.WRONG_VALUE_FORMAT,
            List.of("DATE"),
            ErrorGroup.ATTRIBUTE,
            HttpStatus.BAD_REQUEST
          );
        }
        break;
      case BOOL:
        value = value.toLowerCase();
        if (
          !value.equals("true") && !value.equals("false")
        ) throw new ApiException(
          ErrorCode.WRONG_VALUE_FORMAT,
          List.of("BOOL"),
          ErrorGroup.ATTRIBUTE,
          HttpStatus.BAD_REQUEST
        );
        break;
    }
  }
}
