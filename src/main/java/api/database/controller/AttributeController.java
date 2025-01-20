package api.database.controller;

import api.database.entity.object.Attribute;
import api.database.service.core.provider.AttributeProvider;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attributes")
public class AttributeController {

  private final AttributeProvider attributeProvider;

  public AttributeController(AttributeProvider attributeProvider) {
    this.attributeProvider = attributeProvider;
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public Attribute getAssociationType(@PathVariable Integer id) {
    return attributeProvider.getAttribute(id);
  }
}
