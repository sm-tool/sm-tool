package api.database.entity.user;

import api.database.entity.object.QdsObject;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Reprezentuje powiązanie między użytkownikiem a obiektem reprezentującym go
/// w scenariuszu (obiekt typu Actor).
///
/// # Ważne zasady
/// - Obiekt może reprezentować tylko jednego użytkownika (objectId jest unikalny)
/// - Para (userId, objectId) jest indeksowana dla wydajności
/// - Usuwana kaskadowo z obiektem lub użytkownikiem
/// - Tylko dla obiektów typu Actor lub Observer (zdefiniowanych w konfiguracji)
///
/// # Wykorzystanie
/// - Identyfikacja aktora lub obserwatora jako reprezentację użytkownika w scenariuszu
///
/// # Powiązania
/// {@link QdsUser} - reprezentowany użytkownik
/// {@link QdsObject} - aktor reprezentujący użytkownika
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_user_to_object",
  indexes = {
    @Index(
      name = "qds_user_to_object_user_id_object_id_index",
      columnList = "user_id, object_id"
    ),
    @Index(
      name = "qds_user_to_object_object_id",
      columnList = "object_id",
      unique = true
    ),
  }
)
public class QdsUserToObject {

  /// Unikalny identyfikator powiązania
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_user_to_object_id_gen"
  )
  @SequenceGenerator(
    name = "qds_user_to_object_id_gen",
    sequenceName = "qds_user_to_object_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator obiektu
  @Column(name = "object_id", nullable = false)
  private Integer objectId;

  /// Identyfikator użytkownika
  @Column(name = "user_id", nullable = false)
  private String userId;

  /// Referencja do obiektu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsObject object;

  /// Referencja do użytkownika
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "user_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  private QdsUser user;
}
