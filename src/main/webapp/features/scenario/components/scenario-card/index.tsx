import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useScenario } from '@/features/scenario/queries.ts';
import { Card, CardTitle } from '@/components/ui/shadcn/card.tsx';
import { Label } from '@/components/ui/shadcn/label.tsx';

const ScenarioCard = ({ scenarioId }: { scenarioId: number }) => {
  return (
    <StatusComponent useQuery={useScenario(scenarioId)}>
      {scenario => (
        <Card className='w-full h-32 flex flex-col gap-y-4 p-6'>
          <CardTitle>{scenario!.title}</CardTitle>
          <Label>{scenario!.description}</Label>
        </Card>
      )}
    </StatusComponent>
  );
};

export const ScenarioTitleCard = ({ scenarioId }: { scenarioId: number }) => {
  return (
    <StatusComponent useQuery={useScenario(scenarioId)}>
      {scenario => (
        <>
          <Label className='text-2xl font-semibold'>{scenario!.title}</Label>
        </>
      )}
    </StatusComponent>
  );
};

export default ScenarioCard;
