package api.database.classes.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record QdsUserRegisterInfo(
  @Email(message = "ERROR_INCORECT_EMAIL")
  @NotBlank(message = "ERROR_EMAIL_BLANK")
  String email,

  @NotBlank(message = "ERROR_PASSWORD_BLANK") String password,

  @NotBlank(message = "ERROR_FIRST_NAME_BLANK") String firstName,

  @NotBlank(message = "ERROR_LAST_NAME_BLANK") String lastName
) {}
