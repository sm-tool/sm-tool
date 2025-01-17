package api.database.controller.object;

import api.database.entity.object.AttributeTemplate;
import api.database.model.request.create.AttributeTemplateCreateRequest;
import api.database.model.request.update.AttributeTemplateUpdateRequest;
import api.database.service.core.provider.AttributeTemplateProvider;
import api.database.service.global.AttributeTemplateService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attribute-templates")
public class AttributeTemplateController {

  private final AttributeTemplateService attributeTemplateService;
  private final AttributeTemplateProvider attributeTemplateProvider;

  public AttributeTemplateController(
    AttributeTemplateService attributeTemplateService,
    AttributeTemplateProvider attributeTemplateProvider
  ) {
    this.attributeTemplateService = attributeTemplateService;
    this.attributeTemplateProvider = attributeTemplateProvider;
  }

  //--------------------------------------------------Endpointy GET---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/template/{id}")
  public List<AttributeTemplate> getAttributeTemplates(
    @PathVariable Integer id
  ) {
    return attributeTemplateProvider.getAttributeTemplates(id);
  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public AttributeTemplate getAttributeTemplate(@PathVariable Integer id) {
    return attributeTemplateProvider.getOneAttributeTemplate(id);
  }

  //--------------------------------------------------Endpoint POST---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PostMapping
  public AttributeTemplate addAttributeTemplate(
    @Valid @RequestBody AttributeTemplateCreateRequest attributeTemplateInfo
  ) {
    return attributeTemplateService.addAttributeTemplate(attributeTemplateInfo);
  }

  //--------------------------------------------------Endpoint PUT---------------------------------------------------------
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public AttributeTemplate updateAttributeTemplate(
    @Valid @RequestBody AttributeTemplateUpdateRequest attributeTemplateInfo,
    @PathVariable Integer id
  ) {
    return attributeTemplateService.updateAttributeTemplate(
      id,
      attributeTemplateInfo
    );
  }

  //--------------------------------------------------Endpoint DELETE---------------------------------------------------------

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteAttributeTemplate(@PathVariable Integer id) {
    attributeTemplateService.deleteAttributeTemplate(id);
  }
}
