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
