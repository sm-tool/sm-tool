package api.database.model.constant;

/// Reprezentuje operacje modyfikacji asocjacji między obiektami.
///
/// # Operacje asocjacji
///
/// ## `INSERT`
/// Dodaje nowe powiązanie między obiektami.
/// - Tworzy relację, która wcześniej nie istniała
/// - Rejestruje nowy związek w systemie
///
/// ## `DELETE`
/// Usuwa istniejące powiązanie między obiektami.
/// - Usuwa wcześniej utworzoną relację
/// - Zrywa istniejący związek między obiektami
///
/// @see api.database.entity.association.AssociationChange zmiany asocjacji
public enum AssociationOperation {
  /// Dodanie nowego powiązania między obiektami
  INSERT,

  /// Usunięcie istniejącego powiązania między obiektami
  DELETE,
}
