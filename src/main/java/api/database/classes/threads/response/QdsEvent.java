package api.database.classes.threads.response;

/**
 * Reprezentuje informacje o wydarzeniu w ramach scenariusza.
 *
 * <p>Klasa ta przechowuje szczegółowe informacje o wydarzeniu,  jego
 * tytuł oraz opis. Dane te są wykorzystywane do prezentacji wydarzenia
 * w kontekście wydarzenia w samym wątku (reprezentowanego przez
 * {@link QdsEvent}).</p>
 *
 * <p>Opis wydarzenia może powtarzać się dla eventów fork i join,
 * w pozostałych przypadkach nie jest to możliwe</p>
 *
 * <p>Usuwane wraz z wydarzeniem, niemożliwe jest samodzielne usunięcie</p>
 *
 * @see QdsEvent
 */
public record QdsEvent(Integer id, String title, String description) {}
