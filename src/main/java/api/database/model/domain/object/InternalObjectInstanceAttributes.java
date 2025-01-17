package api.database.model.domain.object;

import java.util.List;

/// Projekcja JPA zwracająca obiekt wraz z listą identyfikatorów jego atrybutów.
/// Używana podczas operacji na atrybutach obiektu, szczególnie przy walidacji
/// dostępności atrybutów w kontekście wątku.
public interface InternalObjectInstanceAttributes {
  /// @return identyfikator obiektu
  Integer getId();
  /// @return identyfikator wątku źródłowego (0 dla obiektów globalnych)
  Integer getOriginThreadId();
  /// @return lista identyfikatorów atrybutów obiektu
  List<Integer> getAttributes();
}
