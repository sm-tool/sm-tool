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
