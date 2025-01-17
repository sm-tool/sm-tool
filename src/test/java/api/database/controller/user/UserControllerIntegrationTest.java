package api.database.controller.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import api.database.entity.user.UserToObject;
import api.database.repository.user.UserToObjectRepository;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import utils.BaseIntegrationTest;

class UserControllerIntegrationTest extends BaseIntegrationTest {

  @Autowired
  UserToObjectRepository userToObjectRepository;

  @Test
  void testGetCurrentUser() throws Exception {
    String expectedJson = Files.readString(
      Paths.get("src/test/resources/responses/user/get_current_user.json")
    );

    getMockMvc()
      .perform(
        get("/api/users/me")
          .with(jwt().jwt(jwt -> jwt.subject("1")))
          .accept(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk())
      .andExpect(content().json(expectedJson, false));
  }

  @Test
  @Transactional
  void testAssignUserToObject() throws Exception {
    Integer objectId = 1;
    String userId = "1";

    int assignmentsBefore = getJdbcTemplate()
      .queryForObject(
        "SELECT COUNT(*) FROM qds_user_to_object WHERE object_id = ? AND user_id = ?",
        Integer.class,
        objectId,
        userId
      );

    getMockMvc()
      .perform(
        post("/api/users/assign/{objectId}", objectId)
          .with(jwt().jwt(jwt -> jwt.subject(userId)))
          .accept(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk());

    getEntityManager().flush();

    int assignmentsAfter = getJdbcTemplate()
      .queryForObject(
        "SELECT COUNT(*) FROM qds_user_to_object WHERE object_id = ? AND user_id = ?",
        Integer.class,
        objectId,
        userId
      );

    assertEquals(assignmentsBefore + 1, assignmentsAfter);
  }

  @Test
  @Transactional
  void testUnassignUserFromObject() throws Exception {
    Integer objectId = 1;
    String userId = "1";

    userToObjectRepository.save(
      new UserToObject(null, objectId, userId, null, null)
    );

    getEntityManager().flush();

    int assignmentsBefore = getJdbcTemplate()
      .queryForObject(
        "SELECT COUNT(*) FROM qds_user_to_object WHERE object_id = ? AND user_id = ?",
        Integer.class,
        objectId,
        userId
      );

    getMockMvc()
      .perform(
        delete("/api/users/assign/{objectId}", objectId)
          .with(jwt().jwt(jwt -> jwt.subject(userId)))
          .accept(MediaType.APPLICATION_JSON)
      )
      .andExpect(status().isOk());

    getEntityManager().flush();

    int assignmentsAfter = getJdbcTemplate()
      .queryForObject(
        "SELECT COUNT(*) FROM qds_user_to_object WHERE object_id = ? AND user_id = ?",
        Integer.class,
        objectId,
        userId
      );

    assertEquals(assignmentsBefore - 1, assignmentsAfter);
  }
}
