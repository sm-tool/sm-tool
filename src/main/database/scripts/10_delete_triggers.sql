-- Dodanie triggerów wywoływanych przy usuwaniu danych

----------------------------------------Usuwanie scenariusza-------------------------------------------
CREATE FUNCTION delete_scenario()
    RETURNS TRIGGER AS
$$
DECLARE
    v_scenario_id INTEGER;
BEGIN
    -- użycie scenario_id (dla usuwania użytkownika bądź uprawnień)
    -- bądź id (dla usuwania scenariusza)
    IF OLD.scenario_id IS NOT NULL THEN
        v_scenario_id := OLD.scenario_id;
    ELSIF OLD.id IS NOT NULL THEN
        v_scenario_id := OLD.id;
    ELSE
        RAISE EXCEPTION 'No valid scenario ID found';
    END IF;

    -- Usuwanie zmian asocjacji i atrybutów
    DELETE
    FROM qds_association_change
    WHERE event_id IN (SELECT event_id
                       FROM qds_event
                       WHERE thread_id IN (SELECT thread_id
                                           FROM qds_thread_info
                                           WHERE scenario_id = v_scenario_id));
    DELETE
    FROM qds_attribute_change
    WHERE event_id IN (SELECT event_id
                       FROM qds_event
                       WHERE thread_id IN (SELECT thread_id
                                           FROM qds_thread_info
                                           WHERE scenario_id = v_scenario_id));
    --usuwanie obserwatora i jego dowiązań do wątków
    DELETE FROM qds_observer WHERE scenario_id = v_scenario_id;
    -- Usuwanie obiektów - usuwa asocjacje oraz atrybuty
    DELETE FROM qds_object WHERE scenario_id = v_scenario_id;
    -- Usuwanie template
    DELETE FROM qds_object_template WHERE scenario_id = v_scenario_id;
    -- Usuwanie rodzajów asocjacji
    DELETE FROM qds_association_type WHERE scenario_id = v_scenario_id;

    -- TO RACZEJ NIE PÓJDZIE TAK ŁATWO LOL
    DELETE
    FROM qds_event_info
    WHERE id IN (SELECT event_info_id
                 FROM qds_event
                 WHERE thread_id IN (SELECT thread_id
                                     FROM qds_thread_info
                                     WHERE scenario_id = v_scenario_id));
    DELETE
    FROM qds_event
    WHERE thread_id IN (SELECT thread_id
                        FROM qds_thread_info
                        WHERE scenario_id = v_scenario_id);
    DELETE
    FROM qds_thread_info
    WHERE scenario_id = v_scenario_id;

    -- Usunięcie scenariusza wraz z history, phase i
    -- object type
    DELETE FROM qds_scenario WHERE id = OLD.scenario_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger usuwający scenariusze dla autora
CREATE TRIGGER before_permission_delete
    BEFORE DELETE
    ON qds_permission
    FOR EACH ROW
    WHEN (OLD.type = 'AUTHOR')
EXECUTE FUNCTION delete_scenario();

CREATE TRIGGER before_delete_scenario
    BEFORE DELETE
    ON qds_scenario
EXECUTE FUNCTION delete_scenario()

--jak z usuwaniem obiektów i templatek przy usuwaniu typów??

-- usuwanie obiektu wywalenie go ze wszystkich threadów i blokada jak jest change? Albo likwidacja

