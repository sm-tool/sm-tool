package api.database.repositories;

import api.database.classes.mappers.IntegerArrayRowMapper;
import api.database.classes.mappers.QdsBranchingRowMapper;
//import api.database.classes.mappers.QdsThreadActionDTORowMapper;
import api.database.classes.mappers.QdsThreadActionRowMapper;
import api.database.classes.mappers.QdsThreadRowMapper;
import api.database.classes.threads.body.QdsForkInfo;
import api.database.classes.threads.body.QdsThreadActionInfo;
import api.database.classes.threads.body.QdsThreadInfo;
//import api.database.classes.threads.dto.QdsThreadActionDTO;
import api.database.classes.threads.response.QdsBranching;
import api.database.classes.threads.response.QdsEvent;
import api.database.classes.threads.response.QdsThread;
import api.database.classes.threads.response.QdsThreadAction;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class QdsThreadRepository {

  private final JdbcTemplate jdbcTemplate;

  public QdsThreadRepository(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public Integer insertThread(QdsThreadInfo qdsThreadInfo, Integer scenarioId) {
    String sql = "SELECT add_new_thread(?,?,?,?)";
    return jdbcTemplate.queryForObject(
      sql,
      Integer.class,
      scenarioId,
      qdsThreadInfo.title(),
      qdsThreadInfo.description(),
      qdsThreadInfo.time()
    );
  }

  public Integer[] forkThread(QdsForkInfo forkInfo, Integer scenarioId) {
    String sql = "SELECT * FROM fork_thread(?,?,?,?,?,?)";
    return jdbcTemplate.queryForObject(
      sql,
      new IntegerArrayRowMapper(),
      scenarioId,
      forkInfo.forkedThreadId(),
      forkInfo.offspringNumber(),
      forkInfo.forkTime(),
      forkInfo.title(),
      forkInfo.description()
    );
  }

  public Integer insertAction(QdsThreadActionInfo action, Integer scenarioId) {
    String sql = "SELECT add_action(?,?,?,?,?)";
    return jdbcTemplate.queryForObject(
      sql,
      Integer.class,
      scenarioId,
      action.threadId(),
      action.time(),
      action.description(),
      action.title()
    );
  }

  public List<QdsThread> getThreads(Integer scenarioId) {
    String sql = "SELECT * FROM get_threads(?)";
    return jdbcTemplate.query(sql, new QdsThreadRowMapper(), scenarioId);
  }

  public List<QdsThreadAction> getActions(List<Integer> threadIds) {
    String sql = "SELECT * FROM get_actions(?)";
    return jdbcTemplate.query(
      sql,
      ps ->
        ps.setArray(
          1,
          ps.getConnection().createArrayOf("integer", threadIds.toArray())
        ),
      new QdsThreadActionRowMapper()
    );
  }

  public List<QdsBranching> getBranching(Integer scenarioId) {
    String sql = "SELECT * FROM get_branching(?)";
    return jdbcTemplate.query(sql, new QdsBranchingRowMapper(), scenarioId);
  }

  public String changeEvent(QdsEvent event) {
    String sql = "UPDATE qds_event SET description = ?, title = ? WHERE id = ?";
    jdbcTemplate.update(sql, event.description(), event.title(), event.id());
    return "SUCCESS_EVENT_CHANGED";
  }

  public String changeThread(QdsThread thread, Integer scenarioId) {
    String sql = "SELECT * FROM change_thread(?,?,?,?)";
    return jdbcTemplate.queryForObject(
      sql,
      String.class,
      thread.id(),
      scenarioId,
      thread.title(),
      thread.description()
    );
  }
}
