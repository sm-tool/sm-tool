package api.database.repository.attribute;

import api.database.entity.object.Attribute;
import api.database.model.domain.attribute.InternalAttributeIdWithType;
import api.database.model.domain.attribute.InternalAttributeWithType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające atrybutami obiektów w systemie,
/// dostarczające operacje bazodanowe dla encji `Attribute`.
///
/// # Główne funkcjonalności
/// - Podstawowe operacje CRUD na atrybutach
/// - Pobieranie atrybutów wraz z ich typami
/// - Pobieranie atrybutów dla wielu obiektów
/// - Wsparcie dla zapytań natywnych SQL
///
/// # Przykład użycia
/// ```java
/// @Autowired
/// private AttributeRepository attributeRepository;
///
/// // Pobranie typów dla listy atrybutów
/// List<InternalAttributeIdWithType> types = attributeRepository.getAttributeTypes(ids);
/// ```
///
/// # Powiązane komponenty
/// - {@link Attribute} - encja reprezentująca atrybut obiektu
/// - {@link api.database.entity.object.AttributeTemplate} - definicja typu atrybutu
/// - {@link InternalAttributeWithType} - projekcja łącząca atrybut z typem
/// - {@link InternalAttributeIdWithType} - projekcja ID atrybutu z typem
@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Integer> {
  /// Pobiera typy atrybutów dla podanych identyfikatorów.
  ///
  /// Wykonuje złączenie z tabelą szablonów atrybutów aby uzyskać informacje o typie.
  /// Wykorzystuje natywne zapytanie SQL dla lepszej wydajności.
  ///
  /// # Parametry
  /// @param attributeIds Lista identyfikatorów atrybutów do pobrania
  /// @return Lista projekcji zawierających ID atrybutu i jego typ
  @Query(
    value = """
    SELECT a.id, at.type
    FROM qds_attribute_template at
        JOIN qds_attribute a ON at.id = a.attribute_template_id
    WHERE a.id = ANY (:attributeIds)
    """,
    nativeQuery = true
  )
  List<InternalAttributeIdWithType> getAttributeTypes(
    @Param("attributeIds") Integer[] attributeIds
  );

  /// Pobiera komplet informacji o atrybutach dla wskazanych obiektów.
  ///
  /// Wykonuje złączenie z szablonami aby pobrać również typ każdego atrybutu.
  /// Wyniki są sortowane po ID obiektu i ID atrybutu dla zachowania spójnej kolejności.
  ///
  /// # SQL
  /// Zapytanie wykonuje:
  /// - Złączenie `qds_attribute` z `qds_attribute_template`
  /// - Filtrowanie po przekazanych ID obiektów
  /// - Sortowanie wyników
  ///
  /// # Parametry
  /// @param objectIds Lista identyfikatorów obiektów
  /// @return Lista atrybutów wraz z informacją o ich typach, posortowana
  @Query(
    value = """
    SELECT a.*, at.type
    FROM qds_attribute a
        JOIN qds_attribute_template at ON a.attribute_template_id = at.id
    WHERE a.object_id = ANY(:objectIds)
    ORDER BY object_id, id;
    """,
    nativeQuery = true
  )
  List<InternalAttributeWithType> getAllByObjectIds(
    @Param("objectIds") Integer[] objectIds
  );
}
