--test
INSERT INTO qds_user (id, email, first_name, last_name, role) VALUES (0, 'GLOBAL', 'GLOBAL', 'GLOBAL', 'USER');

INSERT INTO qds_scenario (id, event_duration, title, purpose, description, context, start_date, end_date) VALUES (nextval('qds_scenario_id_seq'),10,'test','purpose testowy','chat gubi kontekst','test',DATE '2024/02/16',DATE '2024/02/17');

INSERT INTO qds_scenario (id, event_duration, title, purpose, description, context, start_date, end_date) VALUES (nextval('qds_scenario_id_seq'),11,'test2','purpose testowy2','chat gubi kontekst2','test2',DATE '2024/02/16',DATE '2024/02/17');

INSERT INTO qds_thread (id, scenario_id, title, description, is_global) VALUES ( nextval('qds_thread_id_seq'),1, 'GLOBAL', 'GLOBAL_THREAD', TRUE);

INSERT INTO qds_event (id, thread_id, event_time, event_type) VALUES (nextval('qds_event_id_seq'),1, 0, 'START');

INSERT INTO qds_event (id, thread_id, event_time, event_type) VALUES (nextval('qds_event_id_seq'),1, 1, 'END');

INSERT INTO qds_thread (id, scenario_id, title, description, is_global) VALUES (nextval('qds_thread_id_seq'), 1, 'NEW_THREAD_TITLE', 'NEW_THREAD_DESCRIPTION', FALSE);

INSERT INTO qds_event (id, thread_id, event_time, event_type) VALUES (nextval('qds_event_id_seq'), 2, 0, 'START');

INSERT INTO qds_event (id, thread_id, event_time, event_type) VALUES (nextval('qds_event_id_seq'), 2, 1, 'END');

INSERT INTO qds_object (id, scenario_id, template_id, name) VALUES (nextval('qds_object_id_seq'), 1, null, 'Object 1');

INSERT INTO qds_object (id, scenario_id, template_id, name) VALUES (nextval('qds_object_id_seq'), 1, null, 'Object 2');

INSERT INTO qds_object_type (id, title, description, color, is_only_global, parent_id) VALUES (nextval('qds_object_type_id_seq'), 'Type A', 'Description A', '#FF0000', false, null);

INSERT INTO qds_object_type (id, title, description, color, is_only_global, parent_id) VALUES (nextval('qds_object_type_id_seq'), 'Type B', 'Description B', '#00FF00', true, null);

INSERT INTO qds_object_type (id, title, description, color, is_only_global, parent_id) VALUES (nextval('qds_object_type_id_seq'), 'Type C', 'Description C', '#0000FF', false, null);

INSERT INTO qds_object_type (id, title, description, color, is_only_global, parent_id) VALUES (nextval('qds_object_type_id_seq'), 'Type D', 'Description D', '#000FFF', false, 2);

INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 1, 1);

INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 2, 1);

INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 1, 2);

INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 2, 2);

INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 1, 3);

INSERT INTO qds_scenario_to_object_type (id, scenario_id, object_type_id) VALUES (nextval('qds_scenario_to_object_type_id_seq'), 1, 4);

INSERT INTO qds_association_type (id, description, first_object_type_id, second_object_type_id) VALUES (nextval('qds_association_type_id_seq'), 'Association A-B', 1, 2);

INSERT INTO qds_association_type (id, description, first_object_type_id, second_object_type_id) VALUES (nextval('qds_association_type_id_seq'), 'Association B-C', 2, 3);

INSERT INTO qds_association_type (id, description, first_object_type_id, second_object_type_id) VALUES (nextval('qds_association_type_id_seq'), 'Association A-C', 1, 3);

INSERT INTO qds_association_type (id, description, first_object_type_id, second_object_type_id) VALUES (nextval('qds_association_type_id_seq'), 'Association A-A', 1, 1);

INSERT INTO qds_association_type (id, description, first_object_type_id, second_object_type_id) VALUES (nextval('qds_association_type_id_seq'), 'Association C-C', 3, 3);

INSERT INTO qds_association_type (id, description, first_object_type_id, second_object_type_id) VALUES (nextval('qds_association_type_id_seq'), 'Association D-C', 4, 3);

INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 1, 2);

INSERT INTO qds_thread_to_object (id, object_id, thread_id) VALUES (nextval('qds_thread_to_object_id_seq'), 2, 2);

INSERT INTO qds_object_template (id, color, title, description) VALUES (nextval('qds_object_template_id_seq'), 'color1', 'title1', 'description1');

INSERT INTO qds_object_template (id, color, title, description) VALUES (nextval('qds_object_template_id_seq'), 'color2', 'title2', 'description2');

INSERT INTO qds_object_template (id, color, title, description) VALUES (nextval('qds_object_template_id_seq'), 'color3', 'title3', 'description3');

INSERT INTO qds_scenario_to_object_template (id, scenario_id, template_id) VALUES (nextval('qds_scenario_to_object_template_id_seq'), 1, 1);

INSERT INTO qds_scenario_to_object_template (id, scenario_id, template_id) VALUES (nextval('qds_scenario_to_object_template_id_seq'), 2, 1);

INSERT INTO qds_scenario_to_object_template (id, scenario_id, template_id) VALUES (nextval('qds_scenario_to_object_template_id_seq'), 1, 2);

INSERT INTO qds_attribute_template (id, object_template_id, name, type) VALUES (nextval('qds_attribute_template_id_seq'), 1, 'name1', 'INT');

INSERT INTO qds_attribute_template (id, object_template_id, name, type) VALUES (nextval('qds_attribute_template_id_seq'), 1, 'name2', 'STRING');

INSERT INTO qds_attribute_template (id, object_template_id, name, type) VALUES (nextval('qds_attribute_template_id_seq'), 2, 'name3', 'INT');

INSERT INTO qds_scenario_phase (id, scenario_id, start_time, end_time, title, description) VALUES (nextval('qds_scenario_phase_id_seq'), 1, 100, 200, 'Phase 1', 'Description of phase 1');

INSERT INTO qds_scenario_phase (id, scenario_id, start_time, end_time, title, description) VALUES (nextval('qds_scenario_phase_id_seq'), 1, 200, 300, 'Phase 2', 'Description of phase 2');

INSERT INTO qds_scenario_phase (id, scenario_id, start_time, end_time, title, description) VALUES (nextval('qds_scenario_phase_id_seq'), 1, 300, 400, 'Phase 3', 'Description of phase 3');