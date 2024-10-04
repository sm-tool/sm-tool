--Tworzenie funkcji dodającej wątki, branching, akcje i eventy
---------------------------------------
CREATE OR REPLACE FUNCTION add_new_thread(p_scenario_id INTEGER, p_title TEXT, p_description TEXT,
                                          p_start_time INTEGER) RETURNS INTEGER AS
$$
DECLARE
    v_thread_id INTEGER;
BEGIN
    INSERT INTO qds_thread (scenario_id, title, description)
    VALUES (p_scenario_id, p_title, p_description)
    RETURNING id INTO v_thread_id;

    INSERT INTO qds_thread_action (thread_id, time, action_type, event_id, branching_id)
    VALUES (v_thread_id, p_start_time, 'START', NULL, NULL);

    INSERT INTO qds_thread_action (thread_id, time, action_type, event_id, branching_id)
    VALUES (v_thread_id, p_start_time + 1, 'END', NULL, NULL);

    RETURN v_thread_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fork_thread(p_scenario_id INTEGER, p_forked_thread_id INTEGER, p_offspring_number INTEGER,
                                       p_fork_time INTEGER, p_title TEXT, p_description TEXT) RETURNS INTEGER[] AS
$$
DECLARE
    v_thread_id    INTEGER;
    v_event_id     INTEGER;
    v_branching_id INTEGER;
    v_last_action  qds_thread_action%ROWTYPE;
    v_thread_ids   INTEGER[] := '{}';
BEGIN
    IF p_forked_thread_id = 0 THEN
        RAISE EXCEPTION 'ERROR_TRIED_TO_FORK_GLOBAL_THREAD';
    END IF;

    IF p_offspring_number < 2 THEN
        RAISE EXCEPTION 'ERROR_INVALID_OFFSPRING_NUMBER';
    END IF;

    --Znajdź ostatnią akcję threada
    SELECT *
    INTO v_last_action
    FROM qds_thread_action
    WHERE thread_id = p_forked_thread_id
      AND action_type IN ('END', 'FORK_IN', 'JOIN_IN');

    --Warunki ostatniej akcji aby możliwe było dodanie forka
    IF v_last_action.time > p_fork_time THEN RAISE EXCEPTION 'ERROR_EXIST_LATER_EVENTS'; END IF;
    IF v_last_action.action_type IN ('FORK_IN', 'JOIN_IN') THEN RAISE EXCEPTION 'ERROR_THREAD_ALREADY_BRANCHED'; END IF;

    --Wstaw forka do tabelki branching
    INSERT INTO qds_event (title, description) VALUES (p_title, p_description) RETURNING id INTO v_event_id;
    INSERT INTO qds_thread_branching (scenario_id, branching_type, time, event_id)
    VALUES (p_scenario_id, 'FORK', p_fork_time, v_event_id)
    RETURNING id INTO v_branching_id;

    --Wstaw forka do parenta - event_id jest nullem ze względu na to że zmieniany może być tylko end
    UPDATE qds_thread_action
    SET time         = p_fork_time,
        action_type  = 'FORK_IN',
        branching_id = v_branching_id
    WHERE id = v_last_action.id;

    --Wstaw nowe thready z branchingu
    FOR counter IN 1..p_offspring_number
        LOOP
            INSERT INTO qds_thread (scenario_id, title, description)
            VALUES (p_scenario_id, '', '')
            RETURNING id INTO v_thread_id;

            -- Dodanie id nowego threada do tablicy
            v_thread_ids := ARRAY_APPEND(v_thread_ids, v_thread_id);

            INSERT INTO qds_thread_action (thread_id, time, action_type, event_id, branching_id)
            VALUES (v_thread_id, p_fork_time, 'FORK_OUT', NULL, v_branching_id);

            INSERT INTO qds_thread_action (thread_id, time, action_type, event_id, branching_id)
            VALUES (v_thread_id, p_fork_time + 1, 'END', NULL, NULL);
        END LOOP;
    --v_thread_ids := ARRAY_APPEND(v_thread_ids, v_branching_id);

    RETURN v_thread_ids;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_action(p_scenario_id INTEGER, p_thread_id INTEGER, p_time INTEGER,
                                      p_description TEXT, p_title TEXT) RETURNS TEXT AS
$$
DECLARE
    v_global      BOOLEAN := FALSE;
    v_last_action qds_thread_action%ROWTYPE;
    v_id          INTEGER;
BEGIN
    IF p_thread_id = 0 THEN
        SELECT id INTO p_thread_id FROM qds_thread WHERE is_global = TRUE and scenario_id = p_scenario_id;
        v_global := TRUE;
    END IF;
    --Znajdź ostatnią akcję threada
    SELECT *
    INTO v_last_action
    FROM qds_thread_action
    WHERE thread_id = p_thread_id
      AND action_type IN ('END', 'FORK_IN', 'JOIN_IN');
    IF v_last_action.time < p_time THEN
        IF v_last_action.action_type IN ('FORK_IN', 'JOIN_IN') THEN
            RAISE EXCEPTION 'ERROR_THREAD_WAS_FORKED_BEFORE';
        ELSE
            UPDATE qds_thread_action
            SET time = v_last_action.time + 1
            WHERE id = v_last_action.id;
        END IF;
    END IF;
    INSERT INTO qds_event (title, description) VALUES (p_title, p_description) RETURNING id INTO v_id;
    --ieszcze evejt
    INSERT INTO qds_thread_action (thread_id, time, action_type, event_id, branching_id)
    VALUES (p_thread_id, p_time,
            (CASE WHEN v_global THEN 'GLOBAL' ELSE 'NORMAL' END)::qds_action_type, v_id, NULL)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;