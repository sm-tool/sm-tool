package api.database.entity.object;

import api.database.model.constant.QdsAttributeType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/// Definiuje szablon atrybutu obiektu, określający jego nazwę i typ danych.
/// Szablony atrybutów są częścią szablonu obiektu i określają jakie atrybuty
/// oraz jakiego typu muszą posiadać obiekty stworzone z tego szablonu.
///
/// # Ważne zasady
/// - Para (objectTemplateId, name) musi być unikalna
/// - Nazwa atrybutu musi być unikalna w ramach szablonu obiektu
/// - Typ atrybutu określa dozwolony format i walidację wartości
/// - Usuwany kaskadowo wraz z szablonem obiektu
///
/// # Typy atrybutów
/// Dostępne typy zdefiniowane w QdsAttributeType:
/// - TEXT - wartość tekstowa
/// - NUMBER - wartość liczbowa
/// - BOOLEAN - wartość logiczna (true/false)
/// - DATE - data
/// - TIME - czas
///
/// # Powiązania
/// {@link QdsObjectTemplate} - szablon definiujący strukturę obiektu
/// {@link QdsAttribute} - konkretne wystąpienia atrybutów bazujące na szablonie
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(
  name = "qds_attribute_template",
  indexes = {
    @Index(
      name = "qds_attribute_template_id_name_uindex",
      columnList = "object_template_id, name",
      unique = true
    ),
  }
)
public class QdsAttributeTemplate {

  /// Unikalny identyfikator szablonu atrybutu
  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "qds_attribute_template_id_gen"
  )
  @SequenceGenerator(
    name = "qds_attribute_template_id_gen",
    sequenceName = "qds_attribute_template_id_seq",
    allocationSize = 1
  )
  @Column(name = "id", nullable = false)
  private Integer id;

  /// Identyfikator szablonu obiektu
  @Column(name = "object_template_id", nullable = false)
  private Integer objectTemplateId;

  /// Nazwa atrybutu (unikalna w ramach szablonu)
  @Column(name = "name", nullable = false, columnDefinition = "TEXT")
  private String name;

  /// Typ danych atrybutu
  @Column(name = "type", nullable = false, columnDefinition = "TEXT")
  @Enumerated(EnumType.STRING)
  private QdsAttributeType type;

  /// Referencja do szablonu obiektu
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JoinColumn(
    name = "object_template_id",
    nullable = false,
    insertable = false,
    updatable = false
  )
  @JsonIgnore
  private QdsObjectTemplate objectTemplate;
}