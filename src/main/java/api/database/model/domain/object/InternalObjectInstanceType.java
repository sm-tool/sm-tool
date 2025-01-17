package api.database.model.domain.object;

/// Projekcja JPA zwracająca parę: identyfikator obiektu i jego typ.
/// Używana podczas walidacji typów obiektów i sprawdzania możliwości
/// tworzenia asocjacji.
public interface InternalObjectInstanceType {
  /// @return identyfikator obiektu
  Integer getId();
  /// @return identyfikator typu obiektu
  Integer getObjectTypeId();
}
