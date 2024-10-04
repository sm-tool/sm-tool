package api.database.classes.user;

public record QdsUserInfoWithSession(
  String sessionToken,
  QdsUserInfo userInfo
) {}
