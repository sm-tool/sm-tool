-----------------------------------------------------------------------------------------------
-------------------------------------------------Indexes
--ScenarioPhase
CREATE INDEX qds_scenario_phase_scenario_id_index ON qds_scenario_phase USING hash (scenario_id);
--AssociationType
CREATE INDEX qds_association_type_first_object_type_id_index ON qds_association_type USING hash (first_object_type_id);
--AssociationChange
CREATE INDEX qds_association_change_association_id ON qds_association_change USING hash (association_id);
--AttributeChange
CREATE INDEX qds_attribute_change_attribute_id_index ON qds_attribute_change USING hash (event_id);
--ObjectInstance
CREATE INDEX qds_object_scenario_id_uindex ON qds_object USING hash (scenario_id);
--Thread
CREATE UNIQUE INDEX qds_thread_global_uindex ON qds_thread (scenario_id) WHERE is_global = TRUE;

CREATE INDEX qds_thread_scenario_index ON qds_thread USING hash (scenario_id);
--Branching
CREATE INDEX qds_branching_scenario_index ON qds_branching USING hash (scenario_id);
--Event
CREATE INDEX qds_event_thread_id_index ON qds_event USING hash (thread_id);
--ObjectType trigger
--Ehh
CREATE OR REPLACE FUNCTION update_has_children() RETURNS TRIGGER AS $$ BEGIN UPDATE qds_object_type SET has_children = EXISTS (SELECT 1 FROM qds_object_type child WHERE child.parent_id = qds_object_type.id) WHERE id IN (OLD.parent_id, NEW.parent_id); RETURN NEW;END; $$ LANGUAGE plpgsql;
CREATE TRIGGER maintain_has_children AFTER INSERT OR UPDATE OF parent_id OR DELETE ON qds_object_type FOR EACH ROW EXECUTE FUNCTION update_has_children();
INSERT INTO qds_object_type (id, color, parent_id, is_only_global, title, description, is_base_type,can_be_user) VALUES (nextval('qds_object_type_id_seq'),'#FF0000', NULL, FALSE, 'ACTOR', 'ACTOR', TRUE, TRUE), (nextval('qds_object_type_id_seq'),'#0000FF', NULL, FALSE, 'OBSERVER', 'OBSERVER', TRUE, TRUE), (nextval('qds_object_type_id_seq'),'#0000FF', NULL, TRUE, 'BUILDING', 'BUILDING', TRUE, FALSE), (nextval('qds_object_type_id_seq'),'#0000FF', NULL, FALSE, 'VEHICLE', 'VEHICLE', TRUE, FALSE), (nextval('qds_object_type_id_seq'),'#0000FF', NULL, FALSE, 'RESOURCE', 'RESOURCE', TRUE, FALSE), (nextval('qds_object_type_id_seq'),'#0000FF', NULL, TRUE, 'PLACE', 'PLACE', TRUE, FALSE);

