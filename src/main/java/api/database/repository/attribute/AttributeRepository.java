package api.database.repository.attribute;

import api.database.entity.object.Attribute;
import api.database.model.domain.attribute.InternalAttributeIdWithType;
import api.database.model.domain.attribute.InternalAttributeWithType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/// Repozytorium zarządzające atrybutami obiektów w systemie.
/// Odpowiada za:
/// - Podstawowe operacje CRUD na atrybutach
/// - Pobieranie atrybutów wraz z ich typami
/// - Pobieranie atrybutów dla wielu obiektów
///
/// # Powiązania
/// - {@link Attribute} - encja reprezentująca atrybut obiektu
/// - {@link api.database.entity.object.AttributeTemplate} - definicja typu atrybutu
/// - {@link InternalAttributeWithType} - projekcja atrybutu z typem
@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Integer> {
  /// Pobiera typy atrybutów na podstawie ich identyfikatorów.
  /// Łączy atrybuty z ich szablonami by pobrać informacje o typie.
  ///
  /// @param attributeIds lista ID atrybutów
  /// @return lista projekcji zawierających ID i typ atrybutu
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

  /// Pobiera wszystkie atrybuty dla wskazanych obiektów wraz z ich typami.
  /// Zwraca posortowaną listę wg ID obiektu i ID atrybutu.
  ///
  /// @param objectIds lista ID obiektów
  /// @return lista atrybutów z informacją o ich typach
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
