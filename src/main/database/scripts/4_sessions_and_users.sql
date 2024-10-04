-- Tworzenie zarządzania sesjami i użytkownikami
---------------------------------------------------------
CREATE TABLE sessions
(
    session_id    SERIAL PRIMARY KEY,            -- Unikalny identyfikator sesji, automatycznie numerowany
    user_id       INTEGER REFERENCES _user (id), -- Klucz obcy do tabeli użytkowników
    session_token TEXT NOT NULL,                 -- Token sesji, który będzie unikalnym identyfikatorem
    created_at    TIMESTAMP DEFAULT NOW(),       -- Czas utworzenia sesji
    expires_at    TIMESTAMP,                     -- Czas wygaśnięcia sesji
    is_active     BOOLEAN   DEFAULT TRUE         -- Flaga określająca, czy sesja jest aktywna
);

-----------------------------------Generowanie tokenu resetu oraz rejestracji
CREATE FUNCTION token_generate(p_user_id INTEGER)
    RETURNS TEXT AS
$$
DECLARE
    v_token TEXT;
BEGIN
    -- Generowanie unikalnego tokena resetowania hasła
    v_token := encode(gen_random_bytes(16), 'hex');

    -- Zapisanie tokena w bazie danych
    UPDATE _user
    SET token            = v_token,
        token_expires_at = NOW() + INTERVAL '24 hour'
    WHERE id = p_user_id;

    RETURN v_token;
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION token_verify(p_reset_token TEXT)
    RETURNS INTEGER AS
$$
DECLARE
    v_user_id INTEGER;
BEGIN
    -- Sprawdzenie, czy istnieje użytkownik z takim tokenem
    SELECT id
    INTO v_user_id
    FROM _user
    WHERE token = p_reset_token;

-- Jeśli użytkownik z tokenem nie został znaleziony
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'ERROR_INVALID_TOKEN';
    END IF;

    -- Zwrócenie ID użytkownika
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

----------------------------------Rejestracja
CREATE FUNCTION user_register(
    p_email TEXT,
    p_password TEXT,
    p_first_name TEXT,
    p_last_name TEXT
)
    RETURNS TEXT AS
$$
DECLARE
    v_password_hash TEXT;
    v_user_id       INTEGER;
BEGIN
    -- Sprawdzenie, czy użytkownik już istnieje
    IF EXISTS (SELECT 1 FROM _user WHERE email = p_email) THEN
        RAISE EXCEPTION 'ERROR_USER_ALREADY_EXISTS';
    END IF;

    -- Hashowanie hasła
    v_password_hash := crypt(p_password, gen_salt('bf'));

    -- Wstawienie nowego użytkownika do tabeli _user
    INSERT INTO _user (email, password, first_name, last_name)
    VALUES (p_email, v_password_hash, p_first_name, p_last_name)
    RETURNING id INTO v_user_id;

    RETURN token_generate(v_user_id);
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION user_activate_account(
    p_token TEXT
) RETURNS TEXT AS
$$
DECLARE
    v_user_id INTEGER;
BEGIN
    v_user_id := token_verify(p_token);

    -- Sprawdzenie, czy konto jest już aktywne
    IF EXISTS (SELECT 1 FROM _user WHERE id = v_user_id AND is_account_active = TRUE) THEN
        RAISE EXCEPTION 'ERROR_ACCOUNT_ALREADY_ACTIVE';
    END IF;

    -- Aktywacja konta
    UPDATE _user
    SET is_account_active = TRUE,
        token             = NULL,
        token_expires_at  = NULL -- Usunięcie tokena po aktywacji
    WHERE id = v_user_id;

    RETURN 'SUCCESS_ACCOUNT_ACTIVATED';
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------Logowanie
CREATE FUNCTION user_login(p_email TEXT, p_password TEXT)
    RETURNS TABLE
            (
                session_token TEXT,
                email         TEXT,
                first_name    TEXT,
                last_name     TEXT,
                avatar        TEXT
            )
AS
$$
DECLARE
    v_user_id       INTEGER;
    v_password_hash TEXT;
    v_session_token TEXT;
    v_first_name    TEXT;
    v_last_name     TEXT;
    v_avatar        TEXT;
BEGIN
    -- Pobierz hasło użytkownika na podstawie podanego adresu e-mail
    SELECT u.id, u.password, u.first_name, u.last_name, u.avatar
    INTO v_user_id, v_password_hash, v_first_name, v_last_name, v_avatar
    FROM _user u
    WHERE u.email = p_email
      AND u.is_account_active = TRUE;

-- Sprawdź, czy użytkownik istnieje
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'ERROR_INVALID_EMAIL_OR_PASSWORD';
    END IF;

    -- Weryfikacja hasła
    IF crypt(p_password, v_password_hash) <> v_password_hash THEN
        RAISE EXCEPTION 'ERROR_INVALID_EMAIL_OR_PASSWORD';
    END IF;

    -- Generowanie unikalnego tokena sesji
    v_session_token := encode(gen_random_bytes(16), 'hex');

    -- Wstawienie nowego rekordu do tabeli sessions
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (v_user_id, v_session_token, NOW() + INTERVAL '2 hour');

-- Zwróć token sesji oraz dane użytkownika
    RETURN QUERY
        SELECT v_session_token, p_email, v_first_name, v_last_name, v_avatar;
END;
$$ LANGUAGE plpgsql;


-------------------------------Wylogowanie
CREATE FUNCTION user_logout(p_session_token TEXT)
    RETURNS TEXT AS
$$
BEGIN
    -- Sprawdź, czy sesja istnieje i jest aktywna
    IF EXISTS (SELECT 1
               FROM sessions
               WHERE session_token = p_session_token
                 AND is_active = TRUE) THEN
        -- Dezaktywuj sesję
        UPDATE sessions
        SET is_active = FALSE
        WHERE session_token = p_session_token;

        RETURN 'SUCCESS_USER_LOGGED_OUT';
    ELSE
        -- Jeśli sesja nie istnieje lub już jest nieaktywna
        RAISE EXCEPTION 'ERROR_INVALID_OR_INACTIVE_SESSION';
    END IF;
END;
$$ LANGUAGE plpgsql;


-----------------------------------------Zmiana hasła
CREATE FUNCTION user_change_password(
    p_email TEXT,
    p_old_password TEXT,
    p_new_password TEXT
)
    RETURNS TEXT AS
$$
DECLARE
    v_user_id       INTEGER;
    v_password_hash TEXT;
BEGIN
    -- Pobierz ID użytkownika i aktualny hash hasła na podstawie podanego adresu e-mail
    SELECT id, password
    INTO v_user_id, v_password_hash
    FROM _user
    WHERE email = p_email;

-- Sprawdź, czy użytkownik istnieje
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'ERROR_INVALID_EMAIL_OR_PASSWORD';
    END IF;

    -- Weryfikacja starego hasła
    IF crypt(p_old_password, v_password_hash) <> v_password_hash THEN
        RAISE EXCEPTION 'ERROR_INVALID_EMAIL_OR_PASSWORD';
    END IF;

    -- Hashowanie nowego hasła
    v_password_hash := crypt(p_new_password, gen_salt('bf'));

    -- Aktualizacja hasła użytkownika
    UPDATE _user
    SET password = v_password_hash
    WHERE id = v_user_id;

    RETURN 'SUCCESS_PASSWORD_CHANGED';
END;
$$ LANGUAGE plpgsql;


-------------------------------------------Resetowanie hasła
CREATE FUNCTION user_reset_password_with_token(
    p_reset_token TEXT,
    p_new_password TEXT
)
    RETURNS TEXT AS
$$
DECLARE
    v_user_id       INTEGER;
    v_password_hash TEXT;
BEGIN
    v_user_id := token_verify(p_reset_token);

    -- Hashowanie nowego hasła
    v_password_hash := crypt(p_new_password, gen_salt('bf'));

    -- Aktualizacja hasła użytkownika i usunięcie tokena resetowania hasła
    UPDATE _user
    SET password         = v_password_hash,
        token            = NULL,
        token_expires_at = NULL
    WHERE id = v_user_id;

    RETURN 'SUCCESS_PASSWORD_RESET';
END;
$$ LANGUAGE plpgsql;

-----------------------------------------Weryfikacja SID i uprawnień
CREATE FUNCTION get_user_id_from_session(p_session_token TEXT)
    RETURNS INTEGER AS
$$
DECLARE
    v_user_id INTEGER;
BEGIN
    IF p_session_token IS NULL THEN
        RETURN 0; --GLOBAL USER
    END IF;
    -- Pobierz ID użytkownika na podstawie tokenu sesji
    SELECT user_id
    INTO v_user_id
    FROM sessions
    WHERE session_token = p_session_token
      AND is_active = TRUE
      AND expires_at > NOW();

-- Sprawdź, czy znaleziono użytkownika
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'ERROR_INVALID_OR_INACTIVE_SESSION';
    END IF;

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------Sprawdź uprawnienia
CREATE FUNCTION check_permissions_for_user(
    p_session_token TEXT,
    p_scenario_id INTEGER,
    p_want_edit_as_author BOOLEAN
)
    RETURNS BOOLEAN AS
$$
DECLARE
    v_user_id INTEGER;
BEGIN
    -- Pobierz user_id na podstawie tokenu sesji
    v_user_id := get_user_id_from_session(p_session_token);

    -- Sprawdzenie uprawnień dla edycji uprawnień
    IF p_want_edit_as_author = TRUE THEN
        RETURN EXISTS (SELECT 1
                       FROM qds_permission
                       WHERE user_id = v_user_id
                         AND scenario_id = p_scenario_id
                         AND type = 'AUTHOR');
    ELSIF p_want_edit_as_author = FALSE THEN
        -- Sprawdzanie uprawnień dla edycji
        RETURN EXISTS (SELECT 1
                       FROM qds_permission
                       WHERE user_id = v_user_id
                         AND scenario_id = p_scenario_id
                         AND (type = 'EDIT' OR type = 'AUTHOR'));
    ELSE -- p_want_edit_as_author IS NULL
    -- Sprawdzanie uprawnień dla przeglądania
        RETURN EXISTS (SELECT 1
                       FROM qds_permission
                       WHERE user_id = v_user_id
                         AND scenario_id = p_scenario_id);
    END IF;
END;
$$ LANGUAGE plpgsql;

------------------------------------Dostań listę użytkowników
CREATE FUNCTION user_get_list()
    RETURNS TABLE
            (
                email      TEXT,
                first_name TEXT,
                last_name  TEXT,
                avatar     TEXT
            )
AS
$$
BEGIN
    RETURN QUERY SELECT u.email, u.first_name, u.last_name, u.avatar
                 FROM _user u;
END;
$$ LANGUAGE plpgsql;