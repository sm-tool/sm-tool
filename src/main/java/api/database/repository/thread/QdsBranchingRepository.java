package api.database.repository.thread;

import api.database.entity.thread.QdsBranching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QdsBranchingRepository
  extends JpaRepository<QdsBranching, Integer>, QdsBranchingRepositoryCustom {
  @Modifying
  @Query("DELETE FROM QdsBranching b WHERE b.scenario.id = :scenarioId")
  void deleteScenarioBranchings(@Param("scenarioId") Integer scenarioId);

  @Modifying
  @Query(
    value = "DELETE FROM qds_branching WHERE id = ANY(:branchingIds)",
    nativeQuery = true
  )
  void deleteBranchingByIds(@Param("branchingIds") Integer[] branchingIds);

  @Modifying
  @Query(
    value = "UPDATE qds_branching SET is_correct=false WHERE id=:forkId",
    nativeQuery = true
  )
  void markForkAsIncorrect(@Param("forkId") Integer forkId);

  @Modifying
  @Query(
    value = """
    UPDATE qds_event e
    SET thread_id = map.input_thread_id
    FROM (
        SELECT unnest(:inputThreadIds) as input_thread_id,
               unnest(:outputThreadIds) as output_thread_id,
               unnest(:branchingIds) as branching_id
    ) map
    WHERE e.thread_id = map.output_thread_id
    AND e.branching_id != map.branching_id;
    """,
    nativeQuery = true
  )
  void fixIncorrectJoins(
    @Param("inputThreadIds") Integer[] inputThreadIds,
    @Param("outputThreadIds") Integer[] outputThreadIds,
    @Param("branchingIds") Integer[] branchingIds
  );
}
