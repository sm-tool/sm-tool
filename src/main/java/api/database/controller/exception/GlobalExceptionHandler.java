package api.database.controller.exception;

import static org.springframework.jdbc.support.JdbcUtils.convertUnderscoreNameToPropertyName;

import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Sprawdź wiadomość o braku klucza obcego
   * Zwraca null w przypadku braku dopasowania
   * @return null/ApiException
   */
  ApiException parseNoKeyException(String message) {
    Pattern pattern = Pattern.compile(
      "Key \\((\\w+)\\)=\\((\\d+)\\) is not present in table \"(\\w+)\""
    );
    Matcher matcher = pattern.matcher(message);
    ApiException apiException = null;
    if (matcher.find()) {
      String keyName = matcher.group(1); // Przechwytuje nazwę klucza (np. object_type_id)
      String keyValue = matcher.group(2); // Przechwytuje wartość klucza (np. 1)
      String tableName = matcher.group(3); // Przechwytuje nazwę tabeli (np. qds_object_type)
      apiException = new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        List.of(keyName, keyValue),
        ErrorGroup.valueOf(tableName.substring(4).toUpperCase()),
        HttpStatus.BAD_REQUEST
      );
    }
    return apiException;
  }

  ApiException parseDuplicatedKey(String message) {
    Pattern pattern = Pattern.compile(
      "Key \\((\\w+)\\)=\\((\\d+)\\) already exists"
    );
    Matcher matcher = pattern.matcher(message);
    ApiException apiException = null;
    if (matcher.find()) {
      String keyName = matcher.group(1); // Przechwytuje nazwę klucza (np. object_type_id)
      String keyValue = matcher.group(2); // Przechwytuje wartość klucza (np. 1)
      apiException = new ApiException(
        ErrorCode.ALREADY_EXISTS,
        List.of(keyName, keyValue),
        ErrorGroup.OTHERS,
        HttpStatus.BAD_REQUEST
      );
    }
    return apiException;
  }

  /**
   * Sprawdź wiadomość o próbie wstawieniu null do pola gdzie jest to zabronione
   * Zwraca null w przypadku braku dopasowania
   * @return null/ApiException
   */
  private ApiException parseNullException(String message) {
    Pattern pattern = Pattern.compile(
      "null value in column \"(\\w+)\" of relation \"(\\w+)\" violates not-null constraint"
    );
    Matcher matcher = pattern.matcher(message);
    ApiException apiException = null;
    if (matcher.find()) {
      String keyName = matcher.group(1); // Przechwytuje nazwę kolumny
      String tableName = matcher.group(2); // Przechwytuje nazwę tabeli
      apiException = new ApiException(
        ErrorCode.NULL_VALUE,
        List.of(convertUnderscoreNameToPropertyName(keyName)),
        ErrorGroup.valueOf(tableName.substring(4).toUpperCase()),
        HttpStatus.BAD_REQUEST
      );
    }
    return apiException;
  }

  private ApiException parseForeignKeyException(String message) {
    Pattern pattern = Pattern.compile(
      "update or delete on table \"(\\w+)\" violates foreign key constraint \"(\\w+)\" on table \"(\\w+)\"[\\s\\S]*Key \\(id\\)=\\((\\d+)\\)"
    );
    Matcher matcher = pattern.matcher(message);
    ApiException apiException = null;
    if (matcher.find()) {
      String sourceTable = matcher.group(1);
      String targetTable = matcher.group(3);
      String conflictId = matcher.group(4);

      apiException = new ApiException(
        ErrorCode.ELEMENT_IN_USE,
        List.of(sourceTable.substring(4), conflictId),
        ErrorGroup.valueOf(targetTable.substring(4).toUpperCase()),
        HttpStatus.CONFLICT
      );
    }
    return apiException;
  }

  /** Funkcja przechwytująca błędy z bazy danych i zmieniająca je na klasę ApiException
   * która to jest wysyłana jako odpowiedź
   */
  @ExceptionHandler(SQLException.class)
  public ResponseEntity<ApiException> handleDataAccessException(
    SQLException ex
  ) {
    SQLException root = ex;
    while (true) {
      ex = ex.getNextException();
      if (ex != null) {
        root = ex;
      } else break;
    }
    String message = root.getMessage();
    //Błędy braku odpowiednich kluczy w tabelkach - naruszenie klucza obcego
    ApiException apiException = parseNoKeyException(message);
    //Błędy wartości null
    if (apiException == null) apiException = parseNullException(message);
    //Błędy klucza obcego
    if (apiException == null) apiException = parseForeignKeyException(message);
    // Błędy unikalności
    if (apiException == null) apiException = parseDuplicatedKey(message);
    //Inne błędy
    System.out.println(message);
    if (apiException == null) {
      apiException = new ApiException(
        ErrorCode.DOES_NOT_EXIST,
        ErrorGroup.SERVER,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return new ResponseEntity<>(apiException, apiException.getHtmlCode());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiException> handleMethodArgumentNotValidException(
    MethodArgumentNotValidException ex
  ) {
    System.out.println(
      ex.getBindingResult().getAllErrors().getFirst().getDefaultMessage()
    );
    String errorMessage = ex
      .getBindingResult()
      .getAllErrors()
      .getFirst()
      .getDefaultMessage();
    assert errorMessage != null;
    String[] errList = errorMessage.split(";");

    return new ResponseEntity<>(
      new ApiException(
        ErrorCode.valueOf(errList[0]),
        Arrays.stream(errList).skip(2).toList(),
        ErrorGroup.valueOf(errList[1]),
        HttpStatus.BAD_REQUEST
      ),
      HttpStatus.BAD_REQUEST
    );
  }

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ApiException> handleApiException(ApiException ex) {
    return new ResponseEntity<>(ex, ex.getHtmlCode());
  }
}
