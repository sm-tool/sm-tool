package api.database.service.core.provider;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import api.database.entity.object.ObjectType;
import api.database.entity.scenario.Scenario;
import api.database.model.request.save.ObjectTypeSaveRequest;
import jakarta.transaction.Transactional;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import utils.BaseUnitTest;
import utils.builders.QdsAddObjectTypeBuilder;
import utils.builders.QdsAddScenarioBuilder;

class ObjectTypeProviderTest extends BaseUnitTest {

  @Autowired
  private ObjectTypeProvider objectTypeProvider;

  @Test
  @Transactional
  void testGetTypeAncestors() {
    Scenario addedScenario = getObjectManager()
      .addScenarioByManager(new QdsAddScenarioBuilder().build());

    Integer parentId = null;
    Integer lastAddedObjectTypeId = null;

    for (int i = 1; i <= 5; i++) {
      ObjectTypeSaveRequest newObjectType = new QdsAddObjectTypeBuilder()
        .withTitle("Title " + i)
        .withParentId(parentId)
        .build();

      ObjectType addedObjectType = getObjectManager()
        .addObjectTypeByManager(newObjectType, addedScenario.getId());
      assertNotNull(addedObjectType);
      parentId = addedObjectType.getId();
      lastAddedObjectTypeId = addedObjectType.getId();
    }

    List<Integer> ancestorsIds = objectTypeProvider.getTypeAncestors(
      lastAddedObjectTypeId
    );
    assertEquals(4, ancestorsIds.size());
  }
}
