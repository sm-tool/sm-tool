package api.database.model.constant;

import api.database.entity.association.QdsAssociationChange;

/// Reprezentuje możliwe operacje na asocjacjach między obiektami.
/// Używane w encji {@link QdsAssociationChange} do określenia rodzaju zmiany
/// wykonywanej w ramach wydarzenia.
///
/// # Wartości
/// - INSERT - Dodanie nowej asocjacji
/// - DELETE - Usunięcie istniejącej asocjacji
public enum QdsAssociationOperation {
  /// Dodanie nowej asocjacji między obiektami
  INSERT,

  /// Usunięcie istniejącej asocjacji między obiektami
  DELETE,
}
