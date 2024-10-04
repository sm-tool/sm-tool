--Tworzenie funkcji pobierających wątki
--------------------------------------------
CREATE OR REPLACE FUNCTION get_threads(p_scenario_id INTEGER)
    RETURNS TABLE
            (
                id          INTEGER,
                title       TEXT,
                description TEXT
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT (CASE WHEN t.is_global = TRUE THEN 0 ELSE t.id END) AS id, t.title, t.description
        FROM qds_thread t
        WHERE scenario_id = p_scenario_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_actions(p_thread_ids INTEGER[])
    RETURNS TABLE
            (
                thread_id    INTEGER,
                d_time       INTEGER,
                id           INTEGER,
                action_type  qds_action_type,
                event_id     INTEGER,
                title        TEXT,
                description  TEXT,
                branching_id INTEGER
            )
AS
$$
DECLARE
    global_thread_id INTEGER;
BEGIN

    -- id threada globalnego - thread 0 nie istnieje, więc może zostać w tabelce
    SELECT t.id
    INTO global_thread_id
    FROM qds_thread t
    WHERE is_global = TRUE;

    p_thread_ids := array_append(p_thread_ids, global_thread_id);

    RETURN QUERY
        SELECT (CASE WHEN a.thread_id = global_thread_id THEN 0 ELSE a.thread_id END) AS thread_id,
               a.time,
               a.id,
               a.action_type,
               a.event_id,
               e.title,
               e.description,
               a.branching_id
        FROM qds_thread_action a
                 LEFT JOIN qds_event e ON a.event_id = e.id
        WHERE a.thread_id = ANY (p_thread_ids)
        ORDER BY thread_id, a.time;
END;
$$ LANGUAGE plpgsql;

CREATE AGGREGATE array_accum (anycompatiblearray)
    (
    sfunc = array_cat,
    stype = anycompatiblearray,
    initcond = '{}'
    );


CREATE OR REPLACE FUNCTION get_branching(p_scenario_id INTEGER)
    RETURNS TABLE
            (
                id              INTEGER,
                branching_type  qds_branching_type,
                coming_in       INTEGER[],
                coming_out      INTEGER[],
                event_id        INTEGER,
                title           TEXT,
                description     TEXT,
                d_time          INTEGER,
                object_transfer INTEGER[][]
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT b.id,
               b.branching_type,
               -- Coming in threads
               ARRAY(
                       SELECT ta.thread_id
                       FROM qds_thread_action ta
                       WHERE ta.action_type IN ('FORK_IN', 'JOIN_IN')
                         AND ta.branching_id = b.id
                       ORDER BY ta.thread_id
               )      AS coming_in,
               -- Coming out threads
               ARRAY(
                       SELECT ta.thread_id
                       FROM qds_thread_action ta
                       WHERE ta.action_type IN ('FORK_OUT', 'JOIN_OUT')
                         AND ta.branching_id = b.id
                       ORDER BY ta.thread_id
               )      AS coming_out,
               b.event_id,
               e.title,
               e.description,
               b.time AS d_time,
               -- Object transfer as a 2D array
               (
                   SELECT ARRAY_AGG(obj_array)
                   FROM (
                            SELECT
                                ARRAY_AGG(qot.object_id) AS obj_array
                            FROM qds_thread_action ta --ten left join wymusza nulla
                                     LEFT JOIN _qds_object_to_thread qot ON qot.thread_id = ta.thread_id
                            WHERE ta.action_type IN ('FORK_OUT', 'JOIN_OUT')
                              AND ta.branching_id = b.id
                            GROUP BY ta.thread_id
                            ORDER BY ta.thread_id
                        ) sub
               ) AS object_transfer
        FROM qds_thread_branching b
                 JOIN qds_event e ON b.event_id = e.id
        WHERE b.scenario_id = p_scenario_id;
END;
$$ LANGUAGE plpgsql;
