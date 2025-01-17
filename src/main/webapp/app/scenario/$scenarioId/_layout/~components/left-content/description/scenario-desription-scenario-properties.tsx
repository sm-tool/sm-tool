import EditScenarioButton from '@/features/scenario/components/edit-scenario-button';
import { useActiveScenario } from '@/features/scenario/queries.ts';
import LabeledSection from '@/app/scenario/$scenarioId/_layout/~components/left-content/description/labeled-section.tsx';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { Scenario } from '@/features/scenario/types.ts';

const ScenarioDesriptionScenarioProperties = () => {
  return (
    <StatusComponent<Scenario> useQuery={useActiveScenario()}>
      {scenario => (
        <>
          <LabeledSection subtitle='Scenario Title' content={scenario!.title} />
          <LabeledSection
            subtitle='Purpose of the scenario'
            content={scenario!.purpose}
          />
          <LabeledSection
            subtitle='Description'
            content={scenario!.description ?? ''}
          />
          <LabeledSection
            subtitle='Context'
            content={scenario!.context ?? ''}
          />
          <EditScenarioButton />
        </>
      )}
    </StatusComponent>
  );
};

export default ScenarioDesriptionScenarioProperties;
