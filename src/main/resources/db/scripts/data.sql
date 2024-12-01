INSERT INTO qds_user (email, first_name, id, last_name, role) VALUES ('student@student.student','student','fixed-student','student','USER');
-----------------------------------------------------
INSERT INTO qds_scenario (event_duration, id, creation_date, end_date, last_modification_date, start_date, context, description, purpose, title) VALUES
(10,nextval('qds_scenario_id_seq'),TIMESTAMP '2024-10-10T20:20:20Z',TIMESTAMP '2024-10-12T20:20:20Z',
 TIMESTAMP '2024-10-10T20:20:20Z', TIMESTAMP '2024-10-10T20:20:20Z', 'KONTEKST','OPIS','CEL','TYTUŁ');
--------------------------------------------------------
INSERT INTO qds_thread (id, is_global, scenario_id, description, title)
VALUES (nextval('qds_thread_id_seq'),
        TRUE, currval('qds_scenario_id_seq'), 'Wątek globalny', 'Wątek globalny'),
       (nextval('qds_thread_id_seq'),
        FALSE, currval('qds_scenario_id_seq'), 'Przybycie straży', 'Przybycie'),
       (nextval('qds_thread_id_seq'), FALSE, currval('qds_scenario_id_seq'), 'Ewakuacja budynku', 'Ewakuacja'),
       (nextval('qds_thread_id_seq'),
        FALSE, currval('qds_scenario_id_seq'), 'Gaszenie', 'Gaszenie'),
       (nextval('qds_thread_id_seq'),
        FALSE, currval('qds_scenario_id_seq'), 'Koniec gaszenia', 'Koniec gaszenia');

------------------------------------------------------------------- Phases
--                                                                                                      1
INSERT INTO qds_scenario_phase (end_time, id, scenario_id, start_time, description, title, color) VALUES (2, nextval('qds_scenario_phase_id_seq'),
1, 1, 'Służby zostały wezwane do akcji', 'Faza dojazdu służb', '#feffc8');
--                                                                                                      2
INSERT INTO qds_scenario_phase (end_time, id, scenario_id, start_time, description, title, color) VALUES (8, nextval('qds_scenario_phase_id_seq'),
1, 3, 'Służby wykonują akcje ratownicze', 'Faza operacji ratunkowej', '#ffc8c8');
------------------------------------------------------------------Type i template
-- 8-piętrowy budynek schemat całego tworzenia obiektu i instancji
-- Type budynku                                                                                               
--                                                                                                      1
INSERT INTO qds_object_type (id, is_only_global, parent_id, color, description, title) VALUES (nextval('qds_object_type_id_seq'),
true,null,'#fbeea7','Typ opisujący budynek','Budynek');
-- Template 8-piętrowy budynek                                                                         
--                                                                                                      1
INSERT INTO qds_object_template (id, object_type_id, color, description, title) VALUES (nextval('qds_object_template_id_seq'),
1,'#feffc8','Szablon opisujący szczególny 8-piętrowy budynek', '8-piętrowy budynek');
-- Dodanie attribute czyPaliSię                                                             
--                                                                                                      1
INSERT INTO qds_attribute_template (id, object_template_id, name, type) VALUES (nextval('qds_attribute_template_id_seq'),
1, 'czyPaliSię' , 'BOOL');

-- Drużyna strażacka scehmat tworzenia obiektu
-- Type actora                                                                                                  
--                                                                                                      2
INSERT INTO qds_object_type (id, is_only_global, parent_id, color, description, title) VALUES (nextval('qds_object_type_id_seq'),
false, null,'#fba7a7','Typ opisujący actora','Aktor');
-- Template drużyna strażacka                                                                       
--                                                                                                      2
INSERT INTO qds_object_template (id, object_type_id, color, description, title) VALUES (nextval('qds_object_template_id_seq'),
2, '#ff5a5a', 'Szablon opisujący instancjowalną drużynę strażacką', 'Drużyna strażacka');

-- Sprzęt strażacki scehmat tworzenia obiektu
-- Typ sprzętu                                                                                              
--                                                                                                      3
INSERT INTO qds_object_type (id, is_only_global, parent_id, color, description, title) VALUES (nextval('qds_object_type_id_seq'),
false, null,'#a7fbaf','Typ opisujący zasób','Zasób');
-- Template sprzętu                                                                                         
--                                                                                                      3
INSERT INTO qds_object_template (id, object_type_id, color, description, title) VALUES (nextval('qds_object_template_id_seq'),
3, '#ff5a5a', 'Szablon opisujący instancjowalny sprzęt gaśniczy', 'Sprzęt gaśniczy');

-- Pojazd strażacki schemat tworzenia obiektu
--                                                                                                      4
INSERT INTO qds_object_type (id, is_only_global, parent_id, color, description, title) VALUES (nextval('qds_object_type_id_seq'),
false, null, '#a7b9fb', 'Typ opisujący pojazd', 'Pojazd');
--                                                                                                      4
INSERT INTO qds_object_template (id, object_type_id, color, description, title) VALUES (nextval('qds_object_template_id_seq'),
4, '#486be9', 'Szablon opisujący pojazd', 'Pojazd');

-- Miejsce pożaru schemat tworzenia obiektu                                                                        
--                                                                                                      5
INSERT INTO qds_object_type (id, is_only_global, parent_id, color, description, title) VALUES (nextval('qds_object_type_id_seq'),
true, null,'#d6a7fb','Typ opisujący miejsce', 'Miejsce');
--                                                                                                      5
INSERT INTO qds_object_template (id, object_type_id, color, description, title) VALUES (nextval('qds_object_template_id_seq'),
5, '#bb69fc', 'Schemat opisujący miejsce pożaru', 'Miejsce pożaru');

--scenarioToObjectType
INSERT INTO qds_scenario_to_object_type (id, object_type_id, scenario_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 1,1);
INSERT INTO qds_scenario_to_object_type (id, object_type_id, scenario_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 2,1);
INSERT INTO qds_scenario_to_object_type (id, object_type_id, scenario_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 3,1);
INSERT INTO qds_scenario_to_object_type (id, object_type_id, scenario_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 4,1);
INSERT INTO qds_scenario_to_object_type (id, object_type_id, scenario_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 5,1);
--scenarioToObjectTemplate
INSERT INTO qds_scenario_to_object_template (id, template_id, scenario_id) VALUES (nextval('qds_scenario_to_object_template_id_seq'), 1,1);
INSERT INTO qds_scenario_to_object_template (id, template_id, scenario_id) VALUES (nextval('qds_scenario_to_object_template_id_seq'), 2,1);
INSERT INTO qds_scenario_to_object_template (id, template_id, scenario_id) VALUES (nextval('qds_scenario_to_object_template_id_seq'), 3,1);
INSERT INTO qds_scenario_to_object_template (id, template_id, scenario_id) VALUES (nextval('qds_scenario_to_object_template_id_seq'), 4,1);
INSERT INTO qds_scenario_to_object_template (id, template_id, scenario_id) VALUES (nextval('qds_scenario_to_object_template_id_seq'), 5,1);
--------------------------------------------------------------------------------------Typ asocjacji
--                                                                                                      1
INSERT INTO qds_association_type (first_object_type_id, id, second_object_type_id, description) VALUES (2,nextval('qds_association_type_id_seq'),4,'aktor w pojeździe');
--                                                                                                      2
INSERT INTO qds_association_type (first_object_type_id, id, second_object_type_id, description) VALUES (2,nextval('qds_association_type_id_seq'),5,'aktor na miejscu zdarzenia');
--                                                                                                      3
INSERT INTO qds_association_type (first_object_type_id, id, second_object_type_id, description) VALUES (2,nextval('qds_association_type_id_seq'),1,'aktor w budynku');
--                                                                                                      4
INSERT INTO qds_association_type (first_object_type_id, id, second_object_type_id, description) VALUES (2,nextval('qds_association_type_id_seq'),3,'aktor w posiadaniu sprzętu');
--                                                                                                      5
INSERT INTO qds_association_type (first_object_type_id, id, second_object_type_id, description) VALUES (3,nextval('qds_association_type_id_seq'),5,'sprzęt na miejscu zdarzenia');
--                                                                                                      6
INSERT INTO qds_association_type (first_object_type_id, id, second_object_type_id, description) VALUES (3, nextval('qds_association_type_id_seq'),4,'obiekt w pojeździe');

INSERT INTO qds_branching (branching_time, id, scenario_id, branching_type, description, title, is_correct) VALUES (4,nextval('qds_branching_id_seq'),1,'FORK',
                                                                                                        'Drużyny rozdzielają się - drużyna 1 wchodzi do budynku i rozpoczyna ewakuację. Drużyna 2 wykorzystuje sprzęt strażacki do zabezpieczenia terenu m. in. odcięcia mediów jak np gazu.','Podział drużyn na zadania', TRUE);
INSERT INTO qds_branching (branching_time, id, scenario_id, branching_type, description, title) VALUES (7,nextval('qds_branching_id_seq'),1,'JOIN',
                                                                                                        'Drużyna 1 pomyślnie ukończyła ewakuację i dołącza do drużyny 2 ','Zakończenie ewakuacji');
--- OBIEKTY UŻYWANE PRZEZ THREAD 1
--                                                                                                      1
INSERT INTO qds_object (id, object_type_id, scenario_id, template_id, name) VALUES (nextval('qds_object_id_seq'), 5,1,5, 'Miejsce pożaru');
--                                                                                                      1
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'),1,1);

-- Dodanie budynku jako obiekt                                                                  
--                                                                                                      2
INSERT INTO qds_object (id, object_type_id, scenario_id, template_id, name) VALUES (nextval('qds_object_id_seq'),1,1,1,'8-piętrowy budynek');
--                                                                                                      2
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'),2,1);
-- Dodanie attribute czyPaliSię do template 8-piętrowy budynek                                           
--                                                                                                      1
INSERT INTO qds_attribute (attribute_template_id, id, object_id, initial_value) VALUES (1, nextval('qds_attribute_id_seq'), 2, 'false');


-- Global thread - 1
--                                                                                                      1
INSERT INTO qds_event (event_time, id, thread_id, event_type) VALUES (0,nextval('qds_event_id_seq'),1,'START');
--                                                                                                      2
INSERT INTO qds_event (event_time, id, thread_id, description, event_type, title) VALUES (1,nextval('qds_event_id_seq'),1,
                                                                                          $$
W centrum miasta wybuchł gwałtowny pożar w 8-piętrowym budynku mieszkalnym, ogarniając kilka górnych pięter. Straż pożarna została wezwana i jest obecnie w drodze na miejsce zdarzenia, by podjąć akcję gaśniczą i ewakuacyjną.
 $$,'GLOBAL','Wybuch pożaru');
--                                                                                                      3
INSERT INTO qds_event (event_time, id, thread_id, event_type) VALUES (2,nextval('qds_event_id_seq'),1,'END');
-- Dodanie zmiany atrybutu 8-piętrowego budynku z czyPaliSię:false -> czyPaliSię:true
--                                                                                                      1
INSERT INTO qds_attribute_change (attribute_id, event_id, id, value) VALUES (1,2,nextval('qds_attribute_change_id_seq'),'true');

-- OBIEKTY UŻYWANE PRZEZ THREAD 2
-- Dodanie sprzętu strażackiego jako obiekt                                                         
--                                                                                                      3
INSERT INTO qds_object (id, object_type_id, scenario_id, template_id, name) VALUES (nextval('qds_object_id_seq'), 3,1,3,'Sprzęt strażacki');
--                                                                                                      3
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'),3,2);

-- Dodanie drużyny strażackiej 1 i 2 jako obiekt                                                          
--                                                                                                      4
INSERT INTO qds_object (id, object_type_id, scenario_id, template_id, name) VALUES (nextval('qds_object_id_seq'), 2, 1, 2, 'Drużyna strażacka 1');
--                                                                                                      4
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 4, 2);
--                                                                                                      5
INSERT INTO qds_object (id, object_type_id, scenario_id, template_id, name) VALUES (nextval('qds_object_id_seq'), 2, 1, 2, 'Drużyna strażacka 2');
--                                                                                                      5
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 5,2);

--                                                                                                      6
INSERT INTO qds_object (id, object_type_id, scenario_id, template_id, name) VALUES (nextval('qds_object_id_seq'), 4, 1, 4, 'Pojazd strażacki');
--                                                                                                      6
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 6,2);

--Asocjacja                                                                                                                 
--                                                                                                      1
INSERT INTO qds_association (association_type_id, id, object1_id, object2_id) VALUES (1,nextval('qds_association_id_seq'),4,6);
--                                                                                                      2
INSERT INTO qds_association (association_type_id, id, object1_id, object2_id) VALUES (1,nextval('qds_association_id_seq'),5,6);
--                                                                                                                      3
INSERT INTO qds_association (association_type_id, id, object1_id, object2_id) VALUES (5,nextval('qds_association_id_seq'),3,6);
--                                                                                                                       4
INSERT INTO qds_association (association_type_id, id, object1_id, object2_id) VALUES (1,nextval('qds_association_id_seq'),4,1);
--                                                                                                                       5
INSERT INTO qds_association (association_type_id, id, object1_id, object2_id) VALUES (1,nextval('qds_association_id_seq'),5,1);
--                                                                                                                      6
INSERT INTO qds_association (association_type_id, id, object1_id, object2_id) VALUES (5,nextval('qds_association_id_seq'),3,1);
-- First thread - 2 - firefighters
--                                                                                                      4
INSERT INTO qds_event (event_time, id, thread_id, event_type) VALUES (2,nextval('qds_event_id_seq'),2,'START');
--                                                                                                                                      1
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (1, 4, nextval('qds_association_change_id_seq'), 'INSERT');
--                                                                                                                                      2
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (2, 4, nextval('qds_association_change_id_seq'), 'INSERT');

--                                                                                                      5
INSERT INTO qds_event (event_time, id, thread_id, description, event_type, title) VALUES (3,nextval('qds_event_id_seq'),2,$$
Drużyna strażacka 1 i 2 przybywa na miejsce pożaru. Strażacy opuszczają pojazd. Rozładowują i rozstawiają sprzęt. Rozwijają węże, przygotowują pompy, rozstawiają drabiny. Oceniają sytuację, analizują pożar, wiatr i zagrożenia $$,
                                                                                          'NORMAL','Przybycie na miejsce pożaru');

--                                                                                                                                      1
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (1, 5, nextval('qds_association_change_id_seq'), 'DELETE');
--                                                                                                                                      2
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (2, 5, nextval('qds_association_change_id_seq'), 'DELETE');
--                                                                                                                                      3
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (3, 5, nextval('qds_association_change_id_seq'), 'DELETE');
--                                                                                                                                      4
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (4, 5, nextval('qds_association_change_id_seq'), 'INSERT');
--                                                                                                                                      5
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (5, 5, nextval('qds_association_change_id_seq'), 'INSERT');
--                                                                                                                                      6
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (6, 5, nextval('qds_association_change_id_seq'), 'INSERT');
--                                                                                                      6
INSERT INTO qds_event (branching_id, event_time, id, thread_id, event_type) VALUES (1,4,nextval('qds_event_id_seq'),2,'FORK_IN');

-- thread - 3
--                                                                                              4
INSERT INTO qds_association (association_type_id, id, object1_id, object2_id) VALUES (3,nextval('qds_association_id_seq'),5,1);

--                                                                                                      7
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 4, 3);

--                                                                                                      7
INSERT INTO qds_event (branching_id, event_time, id, thread_id, event_type) VALUES (1,4,nextval('qds_event_id_seq'),3,'FORK_OUT');

--                                                                                                      8
INSERT INTO qds_event (event_time, id, thread_id, description, event_type, title) VALUES (5,nextval('qds_event_id_seq'),3,
                                                                                          'Drużyna 1 wchodzi do budynku i rozpoczyna jego ewakuacje',
                                                                                          'NORMAL','Rozpoczęcie ewakuacji budynku');
--                                                                                                                                      4
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (4,8,nextval('qds_association_change_id_seq'),'INSERT');
--                                                                                                      9
INSERT INTO qds_event (branching_id, event_time, id, thread_id, event_type) VALUES (2,7,nextval('qds_event_id_seq'),3,'JOIN_IN');

--thread - 4
--                                                                                                                      5
INSERT INTO qds_association (association_type_id, id, object1_id, object2_id) VALUES (4,nextval('qds_association_id_seq'),5,3);
--                                                                                                      8
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 5, 4);
--                                                                                                       9
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 3, 4);
--                                                                                                       10
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 6, 4);
--                                                                                                                              10
INSERT INTO qds_event (branching_id, event_time, id, thread_id, event_type) VALUES (1,4,nextval('qds_event_id_seq'),4,'FORK_OUT');
--                                                                                                                          11
INSERT INTO qds_event (event_time, id, thread_id, description, event_type, title) VALUES (5,nextval('qds_event_id_seq'),4,
                                                                                          'Drużyna 2 przygotowuje sprzęt do rozpoczęcia akcji gaszenia',
                                                                                          'NORMAL','Przygotowanie sprzętu do gaszenia');
--                                                                                                                                                  5
INSERT INTO qds_association_change (association_id, event_id, id, association_operation) VALUES (5, 11, nextval('qds_association_change_id_seq'),'INSERT');
--                                                                                                                      12
INSERT INTO qds_event (branching_id, event_time, id, thread_id, event_type) VALUES (2,7,nextval('qds_event_id_seq'),4,'JOIN_IN');

--thread - 5
--                                                                                          11
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 3, 5);
--                                                                                          12
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 4, 5);
--                                                                                          13
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 5, 5);
--                                                                                          14
INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 6, 5);
--                                                                                                                              13
INSERT INTO qds_event (branching_id, event_time, id, thread_id, event_type) VALUES (2,7,nextval('qds_event_id_seq'),5,'JOIN_OUT');
--                                                                                                                      14
INSERT INTO qds_event (event_time, id, thread_id, description, event_type, title) VALUES (8,nextval('qds_event_id_seq'),5,
                                                                                          'Drużyna 2 z pomocą drużyny 1 pomyślnie ugasiła budynek',
                                                                                          'NORMAL','Zakończenie operacji gaszenia');
--                                                                                                                          2
INSERT INTO qds_attribute_change (attribute_id, event_id, id, value) VALUES (1,14,nextval('qds_attribute_change_id_seq'),false);
--                                                                                                  15
INSERT INTO qds_event (event_time, id, thread_id, event_type) VALUES (9,nextval('qds_event_id_seq'),5,'END');


 

