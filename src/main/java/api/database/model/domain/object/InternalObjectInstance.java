package api.database.model.domain.object;

/// Projekcja JPA zwracająca podstawowe informacje o instancji obiektu w systemie.
/// Zawiera najważniejsze dane identyfikujące obiekt i określające jego charakter,
/// wykorzystywana głównie podczas operacji na obiektach.
public interface InternalObjectInstance {
  /// @return identyfikator obiektu
  Integer getId();
  /// @return nazwa obiektu
  String getName();
  /// @return identyfikator szablonu obiektu
  Integer getTemplateId();
  /// @return identyfikator typu obiektu
  Integer getObjectTypeId();
  /// @return identyfikator wątku źródłowego (0 dla obiektów globalnych)
  Integer getOriginThreadId();
}
