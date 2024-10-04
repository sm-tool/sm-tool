package api.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Reprezentuje cel scenariusza w systemie.
 *
 * <p>Każdy cel scenariusza ({@code purpose}) jest unikalny i jest
 * przypisany do wielu scenariuszy ({@link QdsScenario}), które
 * realizują dany cel.</p>
 *
 * <p>Obecność scenariusza z danym celem uniemożliwia jego usunięcie</p>
 *
 * @see QdsScenario
 */

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "qds_purpose")
public class QdsPurpose {

  @Id
  @Column(name = "purpose", nullable = false, columnDefinition = "TEXT")
  private String purpose;
}
