package api.database.model.constant;

/// Typy atrybutów używane w systemie.
///
/// # Dostępne typy
/// - `INT` - liczby całkowite
/// - `STRING` - tekst
/// - `DATE` - data/czas
/// - `BOOL` - wartość logiczna (prawda/fałsz)
///
/// # Zastosowanie
/// Używane przy definiowaniu szablonów atrybutów obiektów.
/// Określa sposób walidacji i formatowania wartości atrybutów.
///
/// # Przykład użycia
/// ```java
/// AttributeTemplate template = new AttributeTemplate(
///     "Wiek",
///     AttributeType.INT,
///     "0"
/// );
/// ```
///
/// @see api.database.entity.object.AttributeTemplate szablon atrybutu obiektu
public enum AttributeType {
  /// Typ liczbowy - reprezentuje liczby całkowite
  INT,

  /// Typ tekstowy - reprezentuje ciągi znaków
  STRING,

  /// Typ daty - reprezentuje datę lub czas
  DATE,

  /// Typ logiczny - reprezentuje wartości prawda/fałsz
  BOOL,
}
