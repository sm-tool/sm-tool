package api.database.model.data;

import api.database.model.constant.BranchingType;
import java.util.List;

/// Reprezentuje rozgałęzienie (FORK/JOIN) w scenariuszu.
/// # Przechowuje
/// - Metadane rozgałęzienia (id, typ, czas, tytuł, opis)
/// - Status poprawności transferów w przypadku FORK
/// - Powiązania z wątkami (wejściowe i wyjściowe)
/// - Dane transferów obiektów między wątkami (tylko dla FORK)
///
/// # Szczegóły pól
/// - type: rodzaj rozgałęzienia (FORK - podział wątku, JOIN - łączenie wątków)
/// - isCorrect: czy obiekty są poprawnie przekazane (tylko dla FORK może być false)
/// - comingIn: id wątków wchodzących do rozgałęzienia (jeden dla FORK, wiele dla JOIN)
/// - comingOut: id wątków wychodzących (wiele dla FORK, jeden dla JOIN)
/// - objectTransfer: sposób transferu obiektów do wątków potomnych (tylko dla FORK)
///
/// # Używane do
/// - Prezentacji stanu rozgałęzień w scenariuszu
/// - Walidacji poprawności transferów obiektów
/// - Zarządzania powiązaniami między wątkami
/// - Wykrywania i sygnalizowania niepoprawnych podziałów
/// - Mapowania stanu w odpowiedziach API
public record BranchingData(
  Integer id,
  BranchingType type, //Merge lub fork
  Boolean isCorrect,
  String title,
  String description,
  Integer time,
  Integer[] comingIn,
  Integer[] comingOut,
  List<OffspringObjectTransferData> objectTransfer
) {}
