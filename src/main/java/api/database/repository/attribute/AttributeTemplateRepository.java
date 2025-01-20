package api.database.repository.attribute;

import api.database.entity.object.AttributeTemplate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/// Repozytorium zarządzające szablonami atrybutów w systemie.
/// Dostarcza operacje bazodanowe dla encji `AttributeTemplate`, która definiuje
/// metadane atrybutu takie jak nazwa, typ danych i wartość domyślna.
///
/// # Główne funkcjonalności
/// - Podstawowe operacje CRUD na szablonach atrybutów
/// - Pobieranie szablonów dla określonego szablonu obiektu
/// - Automatyczne sortowanie wyników po ID
///
/// # Przykład użycia
/// ```java
/// @Autowired
/// private AttributeTemplateRepository repository;
///
/// // Pobranie wszystkich szablonów atrybutów dla szablonu obiektu
/// List<AttributeTemplate> templates = repository.findAllByTemplateId(objectTemplateId);
/// ```
///
/// # Powiązane komponenty
/// - {@link AttributeTemplate} - encja reprezentująca szablon atrybutu
/// - {@link api.database.entity.object.ObjectTemplate} - szablon obiektu zawierający szablony atrybutów
/// - {@link api.database.entity.object.Attribute} - konkretna instancja atrybutu bazująca na szablonie
public interface AttributeTemplateRepository
  extends JpaRepository<AttributeTemplate, Integer> {
  /// Pobiera wszystkie szablony atrybutów dla wskazanego szablonu obiektu.
  /// Wyniki są sortowane po ID dla zachowania spójnej kolejności.
  ///
  /// # Zapytanie
  /// Wykorzystuje JPQL do:
  /// - Filtrowania po ID szablonu obiektu
  /// - Sortowania wyników po ID atrybutu
  ///
  /// # Parametry
  /// @param templateId ID szablonu obiektu
  /// @return Lista szablonów atrybutów posortowana po ID
  @Query(
    """
    SELECT a FROM AttributeTemplate a
    WHERE a.objectTemplateId = :templateId
    ORDER BY a.id
    """
  )
  List<AttributeTemplate> findAllByTemplateId(
    @Param("templateId") Integer templateId
  );
}
