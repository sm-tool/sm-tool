package api.database.controller.object;

import api.database.entity.object.QdsAttributeTemplate;
import api.database.model.object.QdsInfoAddAttributeTemplate;
import api.database.service.template.AttributeTemplateService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attribute-template")
public class AttributeTemplateController {

  private final AttributeTemplateService attributeTemplateService;

  public AttributeTemplateController(
    AttributeTemplateService attributeTemplateService
  ) {
    this.attributeTemplateService = attributeTemplateService;
  }

  @PostMapping("/add")
  public ResponseEntity<Integer> addAttributeTemplate(
    @RequestBody QdsInfoAddAttributeTemplate attributeTemplate,
    @RequestHeader Integer templateId
  ) {
    return ResponseEntity.ok(
      attributeTemplateService.addAttributeTemplate(
        attributeTemplate,
        templateId
      )
    );
  }

  @GetMapping("/one")
  public ResponseEntity<QdsAttributeTemplate> getOneAttributeTemplate(
    @RequestHeader Integer attributeTemplateId
  ) {
    return ResponseEntity.ok(
      attributeTemplateService.getOneAttributeTemplate(attributeTemplateId)
    );
  }

  @GetMapping("/list/template")
  public ResponseEntity<List<QdsAttributeTemplate>> getObjectAttributeTemplates(
    @RequestHeader Integer objectTemplateId
  ) {
    List<QdsAttributeTemplate> attributes =
      attributeTemplateService.getAttributeTemplates(objectTemplateId);
    return ResponseEntity.ok(attributes);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteObjectAttributeTemplates(
    @PathVariable Integer id
  ) {
    attributeTemplateService.deleteAttributeTemplates(id);
    return ResponseEntity.noContent().build();
  }
}
