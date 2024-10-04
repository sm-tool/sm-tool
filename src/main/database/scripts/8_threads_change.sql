--Tworzenie funkcji umożliwiających zmiany informacji o wątkach
---------------------------------------
CREATE OR REPLACE FUNCTION change_thread(p_thread_id INTEGER, p_scenario_id INTEGER, p_title TEXT, p_description TEXT)
    RETURNS TEXT AS
$$
BEGIN
    IF p_thread_id = 0 THEN
        SELECT id INTO p_thread_id FROM qds_thread WHERE is_global = TRUE and scenario_id = p_scenario_id;
    END IF;

    UPDATE qds_thread SET title = p_title, description = p_description WHERE id = p_thread_id;

    RETURN 'SUCCESS_THREAD_UPDATED';
END;
$$ LANGUAGE plpgsql;