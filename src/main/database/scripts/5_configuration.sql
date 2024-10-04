-- Dodanie konfiguracji
CREATE TABLE configuration (
    private_key TEXT,
    default_action_duration INTEGER
);

INSERT INTO configuration VALUES (NULL, 10);