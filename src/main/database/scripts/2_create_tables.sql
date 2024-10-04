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
    color       TEXT,
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