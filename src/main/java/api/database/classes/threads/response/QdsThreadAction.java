package api.database.classes.threads.response;

import api.database.classes.enums.QdsActionType;
import api.database.entities.QdsAssociation;
import api.database.entities.QdsAttributeChange;

/**
 * Reprezentuje wydarzenie, które jest częścią określonego wątku ({@link QdsThread}) bądź
 * istnieje globalnie dla scenariusza.
 *
 * <p>Każde wydarzenie odnosi się do określonego wątku w określonym czasie ({@code time}).
 * Posiada również odniesienie do swojego opisu i tytułu {@link QdsEvent}</p>
 *
 * <p>Posiada także swój typ który definiuje jego właściwości ({@link QdsActionType})</p>
 *
 * <p>Na ich podstawie konstruowane są rozgałęzienia wątków ({@code fork}, {@code join})</p>
 * <p>Wydarzenie (nie dotyczy odnoszących się do rozgałęzień) umożliwia zmianę asocjacji
 * ({@link QdsAssociation}) oraz atrybutów obiektów w czasie ({@link QdsAttributeChange})
 * i jest jedyną poprawna opcja ich zmiany</p>
 *
 * <p>Jeżeli event nie jest rozgałęzieniem to jego opis musi być unikalny natomiast wszystkie wątki
 * rozgałęzienia posiadają ten sam opis i tytuł</p>
 *
 * <p>Usuwany wraz z scenariuszem.</p>
 *
 * @see QdsThread
 * @see QdsActionType
 * @see QdsAssociation
 * @see QdsAttributeChange
 */

public record QdsThreadAction(
  Integer threadId,
  Integer id,
  Integer time,
  QdsActionType actionType,
  QdsEvent event,
  Integer branchingId
) {}
