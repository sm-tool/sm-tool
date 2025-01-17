/// Pakiet zawierający klasy wyjątków wykorzystywane w aplikacji do obsługi
/// błędów biznesowych i walidacyjnych.
///
/// # Główne komponenty
/// - {@link api.database.model.exception.ApiException} - Podstawowy wyjątek
///   dla błędów biznesowych, zawierający:
///   - Kod błędu z {@link api.database.model.constant.ErrorCode}
///   - Grupę błędu z {@link api.database.model.constant.ErrorGroup}
///   - Status HTTP
///   - Opcjonalną listę wartości kontekstowych
///
/// # Przykład użycia
/// ```java
/// throw new ApiException(
///     ErrorCode.DOES_NOT_EXIST,
///     ErrorGroup.OBJECT,
///     HttpStatus.NOT_FOUND
/// );
/// ```
///
/// # Integracja z GlobalExceptionHandler
/// Wyjątki są przechwytywane przez GlobalExceptionHandler, który:
/// - Mapuje je na odpowiednie odpowiedzi HTTP
/// - Dodaje szczegółowe informacje o błędzie
/// - Zapewnia spójny format odpowiedzi
package api.database.model.exception;
