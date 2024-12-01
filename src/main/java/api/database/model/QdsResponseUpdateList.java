package api.database.model;

import java.util.List;

/**
 * Lista encji które się zmieniły i należy na nowo pobrać
 * @param entitiesToGet
 */
public record QdsResponseUpdateList(List<String> entitiesToGet) {}
