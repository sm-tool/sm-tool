-- init_pgcrypto.sql
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Dodanie typów (ENUM)
-----------------------------------------------------------------------------------------Typy
CREATE TYPE qds_action_type AS ENUM (
    'GLOBAL',
    'NORMAL',
    'START',
    'END',
    'IDLE',
    'JOIN_OUT',
    'JOIN_IN',
    'FORK_OUT',
    'FORK_IN'
    );

CREATE TYPE qds_branching_type AS ENUM ('JOIN', 'FORK');

CREATE TYPE qds_permission_type AS ENUM ('AUTHOR', 'EDIT', 'VIEW');

CREATE TYPE qds_association_operation AS ENUM ('INSERT', 'DELETE');

-- dodaj rozszerzenia
CREATE EXTENSION pgcrypto;
--CREATE EXTENSION pg_cron;

-- Dodanie tablel oraz indeksów
----------------------------------------Użytkownicy-------------------------------------------
CREATE TABLE _user
(
    id                   SERIAL PRIMARY KEY,
    email                TEXT    NOT NULL,
    first_name           TEXT    NOT NULL,
    last_name            TEXT    NOT NULL,
    is_account_active    BOOLEAN NOT NULL DEFAULT false,
    password             TEXT    NOT NULL,
    token                TEXT,
    token_expires_at     TIMESTAMP,
    avatar               TEXT
);

-----------------------------------------------Uprawnienia-----------------------------------------

CREATE TABLE qds_permission
(
    id          SERIAL              NOT NULL PRIMARY KEY,
    type        qds_permission_type NOT NULL,
    user_id     INTEGER             NOT NULL, -- Klucz obcy do qds_user
    scenario_id INTEGER             NOT NULL  -- klucz obcy do qds_scenario
);

-- index + unikalność emaila i scenariusza
CREATE UNIQUE INDEX qds_permission_user_id_scenario_id_uindex ON qds_permission (user_id, scenario_id);

------------------------------------------------Scenariusz--------------------------------------------------

-- Description i context
-- mogą być puste (być pustymi stringami)
CREATE TABLE qds_scenario
(
    id              SERIAL    NOT NULL PRIMARY KEY,
    title           TEXT      NOT NULL,
    description     TEXT      NOT NULL,
    context         TEXT      NOT NULL,
    start_date      TIMESTAMP NOT NULL,
    end_date        TIMESTAMP NOT NULL,
    action_duration INTEGER,                        -- Długość akcji... jeszcze by się entity obraziło jakby było not null
    purpose_title   TEXT      NOT NULL             -- klucz obcy do qds_purpose
);

---------------Cele scenariusza
--- unikalne
CREATE TABLE qds_purpose
(
    purpose TEXT NOT NULL PRIMARY KEY
);

--------------Historia scenariusza
--- generowana automatycznie na podstawie zapytań
CREATE TABLE qds_scenario_history
(
    id          SERIAL    NOT NULL PRIMARY KEY,
    title       TEXT      NOT NULL,
    author      TEXT      NOT NULL,
    date        TIMESTAMP NOT NULL,
    scenario_id INTEGER   NOT NULL
);

-----------------Fazy scenariusza
CREATE TABLE qds_scenario_phase
(
    id          SERIAL  NOT NULL PRIMARY KEY,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL,
    start_time  INTEGER NOT NULL,
    end_time    INTEGER NOT NULL,
    scenario_id INTEGER NOT NULL,

    CONSTRAINT qds_scenario_phase_end_time_greater CHECK ( end_time > start_time )
);

------------------------------------------ Typy -------------------------------------
---------------------Typ obiektu
CREATE TABLE qds_object_type
(
    id             SERIAL  NOT NULL PRIMARY KEY,
    scenario_id    INTEGER NOT NULL,
    title          TEXT    NOT NULL,
    is_only_global BOOLEAN NOT NULL,
    color          TEXT
);

-- unikalny index na scenario id i title
CREATE UNIQUE INDEX qds_object_type_scenario_id_title_uindex ON qds_object_type (scenario_id, title);

-------------------Rodzaj asocjacji
CREATE TABLE qds_association_type
(
    id                    SERIAL  NOT NULL PRIMARY KEY,
    description           TEXT    NOT NULL,
    scenario_id           INTEGER NOT NULL,
    first_object_type_id  INTEGER NOT NULL,
    second_object_type_id INTEGER NOT NULL,

    UNIQUE (scenario_id, description)
);

-- index na scenario id
CREATE INDEX qds_association_type_scenario_id_index ON qds_association_type USING hash (scenario_id);

-----------------------------------------Szablony obiektów----------------------------------------------------------
CREATE TABLE qds_object_template
(
    id          SERIAL  NOT NULL PRIMARY KEY,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL,
    attributes  TEXT[]  NOT NULL,
    scenario_id INTEGER NOT NULL,
    UNIQUE (scenario_id, title)
);

CREATE INDEX qds_object_template_scenario_id_index ON qds_object_template USING hash (scenario_id);

CREATE TABLE _qds_object_type_to_template
(
    object_type_id INTEGER,
    template_id    INTEGER,
    PRIMARY KEY (object_type_id, template_id)
);


------------------------------------------Atrybuty------------------------------------------------------
CREATE TABLE qds_attribute
(
    id            SERIAL  NOT NULL PRIMARY KEY,
    name          TEXT    NOT NULL,
    default_value TEXT    NOT NULL, --Watość przy tworzeniu obiektu
    object_id     INTEGER NOT NULL
);

-- unikalny index na obiekt i nazwę
CREATE UNIQUE INDEX qds_attribute_object_id_name_uindex ON qds_attribute (object_id, name);

----------------------Wartości atrybutów
CREATE TABLE qds_attribute_change
(
    id               SERIAL  NOT NULL PRIMARY KEY,
    value            TEXT    NOT NULL,
    thread_action_id INTEGER NOT NULL,
    attribute_id     INTEGER NOT NULL,
    UNIQUE (thread_action_id, attribute_id)
);

-- index na atrybuty
CREATE INDEX qds_attribute_change_attribute_id_index ON qds_attribute_change USING hash (thread_action_id);

----------------------------------------Obiekty/instancje------------------------------------------------
CREATE TABLE qds_object
(
    id          SERIAL  NOT NULL PRIMARY KEY,
    scenario_id INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    template_id INTEGER
);

-- unikalny index na nazwę i scenariusz
CREATE UNIQUE INDEX qds_object_scenario_id_name_uindex ON qds_object (scenario_id, name);

---------------------Typy
-----------------przypisane do obiektów
CREATE TABLE _qds_object_to_type
(
    object_id INTEGER NOT NULL,
    type_id   INTEGER NOT NULL,
    PRIMARY KEY (object_id, type_id)
);

-----------------------------------------------Asocjacje-------------------------------------------------
CREATE TABLE qds_association
(
    id                  SERIAL  NOT NULL PRIMARY KEY,
    association_type_id INTEGER NOT NULL,
    object1_id          INTEGER NOT NULL,
    object2_id          INTEGER NOT NULL,

    CHECK ( object1_id <> object2_id ),
    UNIQUE (association_type_id, object1_id, object2_id)
);

CREATE TABLE qds_association_change
(
    id                    SERIAL                    NOT NULL PRIMARY KEY,
    thread_action_id      INTEGER                   NOT NULL,
    association_id        INTEGER                   NOT NULL,
    association_operation qds_association_operation NOT NULL,
    UNIQUE (thread_action_id, association_id)
);

-------------------------------------------------Role------------------------------------------------------
-------------------Obserwator
CREATE TABLE qds_observer
(
    id          SERIAL  NOT NULL PRIMARY KEY,
    name        TEXT    NOT NULL,
    scenario_id INTEGER NOT NULL
);

-- unikalny index na scenariusz i nazwę
CREATE UNIQUE INDEX qds_observer_scenario_id_title_uindex ON qds_observer (scenario_id, name);


----------------------------Obserwator do wątku
CREATE TABLE _qds_observer_to_thread
(
    observer_id INTEGER NOT NULL,
    thread_id   INTEGER NOT NULL,
    PRIMARY KEY (observer_id, thread_id)
);
----------------------------------------------------------Thread---------------------------------------------

------------------------------Obiekt do wątku
CREATE TABLE _qds_object_to_thread
(
    thread_id INTEGER NOT NULL,
    object_id INTEGER NOT NULL,
    PRIMARY KEY (thread_id, object_id)
);

---------------------------------Thread info
CREATE TABLE qds_thread
(
    id          SERIAL  NOT NULL PRIMARY KEY,
    scenario_id INTEGER NOT NULL,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL,
    is_global   BOOLEAN DEFAULT FALSE
);

-- index na id scenariusza dla globalnych threadów
CREATE UNIQUE INDEX qds_thread_global_uindex ON qds_thread (scenario_id) WHERE is_global = TRUE;

CREATE INDEX qds_thread_scenario_index ON qds_thread USING hash(scenario_id);
----------------------------------Akcje w threadzie
CREATE TABLE qds_thread_action
(
    id           SERIAL          NOT NULL PRIMARY KEY,
    thread_id    INTEGER         NOT NULL,
    time         INTEGER         NOT NULL,
    action_type  qds_action_type NOT NULL,
    event_id     INTEGER,
    branching_id INTEGER,
    UNIQUE (thread_id, time), --Jedna akcja w danym czasie na danym wątku
    UNIQUE (event_id),        --Unikalne wydarzenie
    CHECK ((event_id IS NOT NULL AND branching_id IS NULL AND
            action_type IN ('GLOBAL', 'NORMAL', 'IDLE'))
        OR (event_id IS NULL AND branching_id IS NOT NULL AND
            action_type IN ('JOIN_OUT', 'JOIN_IN', 'FORK_OUT', 'FORK_IN'))
        OR (event_id IS NULL AND branching_id IS NULL AND action_type IN ('START', 'END')))
);

CREATE INDEX qds_thread_action_thread_index ON qds_thread_action (thread_id);


--------------------------------------Event - wraz z nim przychodzą association change i attribute change
CREATE TABLE qds_event
(
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL
);

--------------------------------------Podział i łączenie wątków wraz z eventem (tutaj brak możliwości zmiany atrybutów)
CREATE TABLE qds_thread_branching
(
    id       SERIAL PRIMARY KEY,
    scenario_id INTEGER NOT NULL,
    branching_type  qds_branching_type,
    time     INTEGER NOT NULL,
    event_id INTEGER NOT NULL
);

CREATE INDEX qds_thread_branching_scenario_index ON qds_thread_branching USING hash(scenario_id);

-- Dodanie kluczy obcych
--------------------------------------------------------------------------------------------Klucze obce
----------------------------------------Uprawnienia-----------------------------------------------------
ALTER TABLE qds_permission
    ADD CONSTRAINT qds_permission_user_id_fk FOREIGN KEY (user_id) REFERENCES _user (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_permission
    ADD CONSTRAINT qds_permission_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

------------------------------------------Scenariusz-----------------------------------------------------
ALTER TABLE qds_scenario
    ADD CONSTRAINT qds_scenario_purpose_title_fk FOREIGN KEY (purpose_title) REFERENCES qds_purpose (purpose) ON DELETE RESTRICT ON UPDATE CASCADE;

--------------------------------------Historia i fazy----------------------------------------------------
ALTER TABLE qds_scenario_history
    ADD CONSTRAINT qds_scenario_history_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_scenario_phase
    ADD CONSTRAINT qds_scenario_phase_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

--------------------------------------------Typy----------------------------------------------------------
ALTER TABLE qds_object_type
    ADD CONSTRAINT qds_object_type_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_association_type
    ADD CONSTRAINT qds_association_type_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_association_type
    ADD CONSTRAINT qds_association_type_first_type_id_fk FOREIGN KEY (first_object_type_id) REFERENCES qds_object_type (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_association_type
    ADD CONSTRAINT qds_association_type_second_type_id_fk FOREIGN KEY (second_object_type_id) REFERENCES qds_object_type (id) ON DELETE CASCADE ON UPDATE CASCADE;

--------------------------------------------Szablony------------------------------------------------------------
ALTER TABLE qds_object_template
    ADD CONSTRAINT qds_object_template_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE _qds_object_type_to_template
    ADD CONSTRAINT _qds_object_type_to_template_object_template_id_fk FOREIGN KEY (template_id) REFERENCES qds_object_template (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE _qds_object_type_to_template
    ADD CONSTRAINT _qds_object_type_to_template_object_type_id_fk FOREIGN KEY (object_type_id) REFERENCES qds_object_type (id) ON DELETE CASCADE ON UPDATE CASCADE;

------------------------------------------Atrybuty------------------------------------------------------
ALTER TABLE qds_attribute
    ADD CONSTRAINT qds_attribute_object_id_fk FOREIGN KEY (object_id) REFERENCES qds_object (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_attribute_change
    ADD CONSTRAINT qds_attribute_change_attribute_id_fk FOREIGN KEY (attribute_id) REFERENCES qds_attribute (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_attribute_change
    ADD CONSTRAINT qds_attribute_change_thread_action_id_fk FOREIGN KEY (thread_action_id) REFERENCES qds_thread_action (id) ON DELETE CASCADE ON UPDATE CASCADE;

-------------------------------------------Obiekty-------------------------------------------------------
ALTER TABLE qds_object
    ADD CONSTRAINT qds_object_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_object
    ADD CONSTRAINT qds_object_template_id_fk FOREIGN KEY (template_id) REFERENCES qds_object_template (id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE _qds_object_to_type
    ADD CONSTRAINT _qds_object_to_type_object_type_id_fk FOREIGN KEY (object_id) REFERENCES qds_object (id) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE _qds_object_to_type
    ADD CONSTRAINT _qds_object_to_type_type_id_fk FOREIGN KEY (type_id) REFERENCES qds_object_type (id) ON DELETE NO ACTION ON UPDATE CASCADE;

--------------------------------------------Asocjacje----------------------------------------------------
ALTER TABLE qds_association
    ADD CONSTRAINT qds_association_association_type_id_fk FOREIGN KEY (association_type_id) REFERENCES qds_association_type (id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE qds_association
    ADD CONSTRAINT qds_association_object1_id_fk FOREIGN KEY (object1_id) REFERENCES qds_object (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_association
    ADD CONSTRAINT qds_association_object2_id_fk FOREIGN KEY (object2_id) REFERENCES qds_object (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_association_change
    ADD CONSTRAINT qds_association_change_thread_action_id_fk FOREIGN KEY (thread_action_id) REFERENCES qds_thread_action (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qds_association_change
    ADD CONSTRAINT qds_association_change_association_id_fk FOREIGN KEY (association_id) REFERENCES qds_association (id) ON DELETE CASCADE ON UPDATE CASCADE;

-------------------------------------------------Role------------------------------------------------------
ALTER TABLE qds_observer
    ADD CONSTRAINT qds_observer_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

----------------------------------------------------------Thread---------------------------------------------
---------------------Rola do wątku
--TRIGGERY? JAK dziedziczone w forkach i mergach
ALTER TABLE _qds_observer_to_thread
    ADD CONSTRAINT _qds_observer_to_thread_role_id FOREIGN KEY (observer_id) REFERENCES qds_observer (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE _qds_observer_to_thread
    ADD CONSTRAINT _qds_observer_to_thread_thread_id FOREIGN KEY (thread_id) REFERENCES qds_thread (id) ON DELETE CASCADE ON UPDATE CASCADE;

---------------------Obiekt do wątku
ALTER TABLE _qds_object_to_thread
    ADD CONSTRAINT _qds_object_to_thread_object_id FOREIGN KEY (object_id) REFERENCES qds_object (id) ON DELETE CASCADE ON UPDATE CASCADE;

--                                 ON DELETE TRIGGER!!
ALTER TABLE _qds_object_to_thread
    ADD CONSTRAINT _qds_object_to_thread_thread_id FOREIGN KEY (thread_id) REFERENCES qds_thread (id) ON DELETE CASCADE ON UPDATE CASCADE;

--                                      ON DELETE TRIGGER!!

--------------------------------------------Thready - usuwane funkcjami - dodawane też
-----------------------------------------Thread
ALTER TABLE qds_thread
    ADD CONSTRAINT qds_thread_scenario_id_fk FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

----------------------------------Akcje w threadzie
ALTER TABLE qds_thread_action
    ADD CONSTRAINT qds_thread_action_thread_id FOREIGN KEY (thread_id) REFERENCES qds_thread (id) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE qds_thread_action
    ADD CONSTRAINT qds_thread_action_event_id FOREIGN KEY (event_id) REFERENCES qds_event (id) ON DELETE NO ACTION ON UPDATE CASCADE ;

ALTER TABLE qds_thread_action
    ADD CONSTRAINT qds_thread_action_branching_id FOREIGN KEY (branching_id) REFERENCES qds_thread_branching (id) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE qds_thread_branching
    ADD CONSTRAINT qds_thread_branching_event_id FOREIGN KEY (event_id) REFERENCES qds_event (id) ON DELETE NO ACTION ON UPDATE CASCADE ;

ALTER TABLE qds_thread_branching
    ADD CONSTRAINT qds_thread_branching_scenario_id FOREIGN KEY (scenario_id) REFERENCES qds_scenario (id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE FUNCTION user_get_list()
    RETURNS TABLE
            (
                email      TEXT,
                first_name TEXT,
                last_name  TEXT,
                avatar     TEXT
            )
    AS '
BEGIN
    RETURN QUERY SELECT u.email, u.first_name, u.last_name, u.avatar
                 FROM _user u;
END;
' LANGUAGE plpgsql;

CREATE FUNCTION token_generate(p_user_id INTEGER)
    RETURNS TEXT
AS '
DECLARE
    v_token TEXT;
BEGIN
    -- Generowanie unikalnego tokena resetowania hasła
    v_token := encode(gen_random_bytes(16), ''hex'');

    -- Zapisanie tokena w bazie danych
    UPDATE _user
    SET token            = v_token,
        token_expires_at = NOW() + INTERVAL ''24 hour''
    WHERE id = p_user_id;

    RETURN v_token;
END;
' LANGUAGE plpgsql;

CREATE FUNCTION user_register(
    p_email TEXT,
    p_password TEXT,
    p_first_name TEXT,
    p_last_name TEXT
)
    RETURNS TEXT
AS '
DECLARE
    v_password_hash TEXT;
    v_user_id       INTEGER;
BEGIN
    -- Sprawdzenie, czy użytkownik już istnieje
    IF EXISTS (SELECT 1 FROM _user WHERE email = p_email) THEN
        RAISE EXCEPTION ''ERROR_USER_ALREADY_EXISTS'';
    END IF;

    -- Hashowanie hasła
    v_password_hash := crypt(p_password, gen_salt(''bf''));

    -- Wstawienie nowego użytkownika do tabeli _user
    INSERT INTO _user (email, password, first_name, last_name)
    VALUES (p_email, v_password_hash, p_first_name, p_last_name)
    RETURNING id INTO v_user_id;

    RETURN token_generate(v_user_id);
END;
' LANGUAGE plpgsql;