package api.database.controllers;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(DataAccessException.class)
  public ResponseEntity<String> handleDataAccessException(
    DataAccessException ex
  ) {
    String errorMessage = "Wystąpił błąd z dostępem do danych.";
    Throwable cause = ex.getCause();
    if (cause instanceof SQLException) {
      SQLException sqlEx = (SQLException) cause;
      errorMessage = sqlEx.getMessage(); // Pobranie oryginalnego komunikatu błędu z PostgreSQL
    }
    //To tak na szybko docelowo jsonik odpowiedni
    return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  //do przerobienia
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(
    MethodArgumentNotValidException ex
  ) {
    Map<String, String> errors = new HashMap<>();

    ex
      .getBindingResult()
      .getAllErrors()
      .forEach(error -> {
        String fieldName = ((FieldError) error).getField();
        String errorMessage = error.getDefaultMessage();
        errors.put(fieldName, errorMessage);
      });

    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
  }
}
