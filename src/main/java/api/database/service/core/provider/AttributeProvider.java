package api.database.service.core.provider;

import api.database.entity.object.Attribute;
import api.database.model.constant.ErrorCode;
import api.database.model.constant.ErrorGroup;
import api.database.model.domain.attribute.InternalAttributeWithType;
import api.database.model.exception.ApiException;
import api.database.model.response.AttributeResponse;
import api.database.repository.attribute.AttributeRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AttributeProvider {

  private final AttributeRepository attributeRepository;

  @Autowired
  public AttributeProvider(AttributeRepository attributeRepository) {
    this.attributeRepository = attributeRepository;
  }

  public Map<Integer, List<AttributeResponse>> getObjectsAttributes(
    List<Integer> objectIds
  ) {
    List<InternalAttributeWithType> attributes =
      attributeRepository.getAllByObjectIds(objectIds.toArray(new Integer[0]));

    return attributes
      .stream()
      .collect(
        Collectors.groupingBy(
          InternalAttributeWithType::getObjectId,
          Collectors.mapping(AttributeResponse::from, Collectors.toList())
        )
      );
  }

  public Attribute getAttribute(Integer id) {
    return attributeRepository
      .findById(id)
      .orElseThrow(() ->
        new ApiException(
          ErrorCode.DOES_NOT_EXIST,
          ErrorGroup.ATTRIBUTE,
          HttpStatus.NOT_FOUND
        )
      );
  }
}
