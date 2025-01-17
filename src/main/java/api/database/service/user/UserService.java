package api.database.service.user;

import api.database.entity.user.User;
import api.database.entity.user.UserToObject;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.exception.ApiException;
import api.database.repository.user.UserRepository;
import api.database.repository.user.UserToObjectRepository;
import api.database.service.core.provider.ObjectTypeProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final UserToObjectRepository userToObjectRepository;
  private final ObjectTypeProvider objectTypeProvider;

  public User getCurrentUser(Authentication authentication) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    return userRepository
      .findById(jwt.getSubject())
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.USER,
          HttpStatus.NOT_FOUND
        )
      );
  }

  public void assignUserToObject(
    Integer objectId,
    Authentication authentication
  ) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    String userId = userRepository
      .findById(jwt.getSubject())
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.USER,
          HttpStatus.NOT_FOUND
        )
      )
      .getId();
    if (
      objectTypeProvider.findById(objectId).getCanBeUser()
    ) userToObjectRepository.save(
      new UserToObject(null, objectId, userId, null, null)
    );
    else throw new ApiException(
      ErrorCode.OBJECT_CANNOT_BE_USER,
      ErrorGroup.OBJECT,
      HttpStatus.BAD_REQUEST
    );
  }

  public void unassignUserFromObject(
    Integer objectId,
    Authentication authentication
  ) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    String userId = userRepository
      .findById(jwt.getSubject())
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.USER,
          HttpStatus.NOT_FOUND
        )
      )
      .getId();
    userToObjectRepository.deleteByUserIdAndObjectId(userId, objectId);
  }
}
