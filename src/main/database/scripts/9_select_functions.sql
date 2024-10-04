-- Tworzenie funkcji zwracających rekordy
-----------------------------------Lista scenariuszy z datami ostatnich edycji----------------------------------
CREATE OR REPLACE FUNCTION get_scenario_list(v_user_id INTEGER)
    RETURNS TABLE
            (
                title         TEXT,
                first_name    TEXT,
                last_name     TEXT,
                last_modified TIMESTAMP
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT s.title, u.first_name, u.last_name, sh.date AS last_modified
        FROM qds_scenario s
                 JOIN qds_permission p ON s.id = p.scenario_id
                 JOIN _user u ON p.id = u.id
                JOIN qds_scenario_history sh ON s.id = sh.scenario_id
        WHERE EXISTS (SELECT 1
                      FROM qds_permission
                      WHERE (user_id = v_user_id OR user_id = 0)
                        --użytkownik ma uprawnienia lub scenariusz jest dostępny globalnie
                        AND scenario_id = s.id)
          AND sh.date = (SELECT MAX(date) FROM qds_scenario_history WHERE scenario_id = s.id);
END;
$$ LANGUAGE plpgsql;
------------------------dostań templatki wraz z typami
CREATE FUNCTION get_object_templates(p_scenario_id INTEGER)
    RETURNS TABLE
            (
                id           INTEGER,
                title        TEXT,
                description  TEXT,
                attributes   TEXT[],
                scenario_id  INTEGER,
                object_types INTEGER[]
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT t.id,
               t.title,
               t.description,
               t.attributes,
               t.scenario_id,
               ARRAY(SELECT object_type_id --kocham postgresa <3
                     FROM _qds_object_type_to_template
                     WHERE template_id = t.id) AS object_types
        FROM qds_object_template t
        WHERE scenario_id = p_scenario_id;
END;
$$ LANGUAGE plpgsql;

--obiekty? to samo - sprawdzić inserta? atrybuty?

--obserwator lista threadów widocznych? dla threada lista obserwatorów?

--thread info... globalny z id = 0? bez is_global? Da się załatwić ale wtedy można encję wyp... ale nie byłoby
--powiązań... nie żeby były specjalnie potrzebne jak to i tak na front pójdzie jsonem

--wyświelanie eventu... jakieś zmiany brać?