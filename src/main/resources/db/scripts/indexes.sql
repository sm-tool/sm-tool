-----------------------------------------------------------------------------------------------
-------------------------------------------------Indexes
--QdsScenarioPhase
CREATE INDEX qds_scenario_phase_scenario_id_index ON qds_scenario_phase USING hash (scenario_id);
--QdsAssociationType
CREATE INDEX qds_association_type_first_object_type_id_index ON qds_association_type USING hash (first_object_type_id);
--QdsAssociationChange
CREATE INDEX qds_association_change_association_id ON qds_association_change USING hash (association_id);
--QdsAttributeChange
CREATE INDEX qds_attribute_change_attribute_id_index ON qds_attribute_change USING hash (event_id);
--QdsObject
CREATE INDEX qds_object_scenario_id_uindex ON qds_object USING hash (scenario_id);
--QdsThread
CREATE UNIQUE INDEX qds_thread_global_uindex ON qds_thread (scenario_id) WHERE is_global = TRUE;

CREATE INDEX qds_thread_scenario_index ON qds_thread USING hash (scenario_id);
--QdsBranching
CREATE INDEX qds_branching_scenario_index ON qds_branching USING hash (scenario_id);
--QdsEvent
CREATE INDEX qds_event_thread_id_index ON qds_event USING hash (thread_id);