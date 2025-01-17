package api.database.model.response;

import api.database.model.domain.object.InternalObjectInstance;
import java.util.List;

/// Reprezentuje stan obiektu w odpowiedzi API wraz z jego atrybutami.
/// Używany do prezentacji pełnych informacji o instancji obiektu.
///
/// # Przechowuje
/// - Podstawowe dane obiektu (id, nazwa, pochodzenie)
/// - Identyfikatory powiązanych encji (szablon, typ)
/// - Listę atrybutów obiektu
///
/// # Tworzenie
/// Dostarcza metodę statyczną from() tworzącą odpowiedź na podstawie:
/// - Wewnętrznej reprezentacji obiektu (InternalObjectInstance)
/// - Listy odpowiedzi z atrybutami
///
/// # Przykład użycia
/// ```java
/// ObjectInstanceResponse response = ObjectInstanceResponse.from(
///     internalObject,
///     attributeResponses
/// );
/// ```
///
/// # Struktura rekordu
/// @param id identyfikator obiektu
/// @param originThreadId identyfikator wątku źródłowego
/// @param name nazwa obiektu
/// @param templateId identyfikator szablonu
/// @param objectTypeId identyfikator typu obiektu
/// @param attributes lista atrybutów obiektu
public record ObjectInstanceResponse(
  Integer id,
  Integer originThreadId,
  String name,
  Integer templateId,
  Integer objectTypeId,
  List<AttributeResponse> attributes
) {
  public static ObjectInstanceResponse from(
    InternalObjectInstance obj,
    List<AttributeResponse> attributeData
  ) {
    return new ObjectInstanceResponse(
      obj.getId(),
      obj.getOriginThreadId(),
      obj.getName(),
      obj.getTemplateId(),
      obj.getObjectTypeId(),
      attributeData == null ? List.of() : attributeData
    );
  }
}
