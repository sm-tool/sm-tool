-- Dodanie triggerów wywoływanych przy dodawaniu danych
-----------------------------------------------------------
----------------------------------------Uprawnienia
CREATE OR REPLACE FUNCTION check_global_user_trigger()
    RETURNS TRIGGER AS
$$
BEGIN
    -- Sprawdź czy istnieje już globalne uprawnienie
    IF EXISTS (SELECT 1
               FROM qds_permission
               WHERE scenario_id = NEW.scenario_id
                 AND user_id = 0
                 AND type = NEW.type) THEN
        RAISE EXCEPTION 'Entry with scenario_id = % and type = % already have global permission', NEW.scenario_id, NEW.type;
    END IF;

    -- Dodaj wpis
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER global_user
    BEFORE INSERT
    ON qds_permission
    FOR EACH ROW
EXECUTE FUNCTION check_global_user_trigger();

--------------------------------------------Action number from time
CREATE FUNCTION calculate_action_no(action_duration INTEGER, start_date TIMESTAMP, end_date TIMESTAMP)
    RETURNS INTEGER AS
$$
BEGIN
    RETURN EXTRACT(EPOCH FROM (end_date - start_date))::INTEGER / (action_duration * 60) - 1;
    -- nie wliczamy ostatniej (niepełnej akcji)
END;
$$ LANGUAGE plpgsql;

----------------------------------------------Scenario

CREATE FUNCTION add_scenario_defaults()
    RETURNS TRIGGER AS $$
    DECLARE
        v_thread_id INTEGER;
BEGIN
        -- Podstawowe typy obiektów
        INSERT INTO qds_object_type (scenario_id, title, is_only_global)
        VALUES (NEW.id, 'ACTOR', FALSE),
               (NEW.id, 'BUILDING', TRUE),
               (NEW.id, 'VEHICLE', FALSE),
               (NEW.id, 'RESOURCE', FALSE),
               (NEW.id, 'PLACE', TRUE);

        -- Wątek globalny
        INSERT INTO qds_thread (scenario_id, title, description, is_global)
        VALUES (NEW.id, 'GLOBAL', 'GLOBAL_THREAD', TRUE)
        RETURNING id INTO v_thread_id;

        INSERT INTO qds_thread_action (thread_id, time, action_type, event_id, branching_id)
        VALUES (v_thread_id, 0, 'START', NULL, NULL);

        INSERT INTO qds_thread_action (thread_id, time, action_type, event_id, branching_id)
        VALUES (v_thread_id, calculate_action_no(NEW.action_duration, NEW.start_date, NEW.end_date), 'END', NULL, NULL);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_scenario_insert
    AFTER INSERT ON qds_scenario
    FOR EACH ROW
EXECUTE FUNCTION add_scenario_defaults();

--dodanie domyślej długości trwania akcji
CREATE FUNCTION check_action_duration()
    RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.action_duration IS NULL THEN
         SELECT default_action_duration INTO NEW.action_duration FROM configuration;
    END IF;
-- bez returna error był
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_scenario_insert
    BEFORE INSERT ON qds_scenario
    FOR EACH ROW
EXECUTE FUNCTION check_action_duration();

--dodawanie scenariusza - co z purpose? dodawany automatycznie? jakiś przełącznik?


--globalne typy - brak możliwości dodania template? tylko instancja?
--wymóg typów dla template i dla obiektów? Co najmniej jednego?

--dodawanie obiektu musi mieć id wątku - funckcja? Czy transakcja z 2 tabelką?

--funkcja do dodawania branchingu~!!!

--dodawanie asocjacji automatyczne?

-- Użytkownik globalny umożliwiający wybranie
-- możliwości dostępu do scenariusza dla niezalogowanych
INSERT INTO _user (id, email, first_name, last_name, password)
VALUES (0, 'GLOBAL', 'GLOBAL', 'GLOBAL', 'GLOBAL');
--test
INSERT INTO qds_purpose VALUES ('test');

INSERT INTO qds_scenario VALUES (1,'test','ayaya','chat gubi kontekst',DATE ('2024/02/16'),
                                 DATE ('2024/02/17'), 10, 'test');

INSERT INTO qds_permission (type, user_id, scenario_id) VALUES ('VIEW', 0, 1);

--Lista wymaga jakiegokolwiek wpisu w historii
INSERT INTO qds_scenario_history (title, author, date, scenario_id) VALUES ('Stworzenie świata', 'Gall Anonim', DATE('2012/12/21'), 1);

INSERT INTO _user(email, first_name, last_name, password)
VALUES ('TEST', 'TEST', 'TEST', 'TEST');

-- SELECT add_new_thread(1, 'POMOCY', 'POMOCY OPIS', 3);
--
-- SELECT * FROM fork_thread(1,2,
--                           3, 5, 'TEST FORKA', 'OPIS TESTU')