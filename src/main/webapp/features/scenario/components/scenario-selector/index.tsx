import {
  Scenario,
  ScenarioApiFilterMethods,
} from '@/features/scenario/types.ts';
import { useInfiniteScenarios } from '@/features/scenario/queries.ts';
import { TextSelect } from 'lucide-react';
import ScenarioCard, {
  ScenarioTitleCard,
} from '@/features/scenario/components/scenario-card';
import ReferencePickerWithQuery from '@/components/ui/common/input/reference-picker/reference-picker-with-query.tsx';
import { useParams } from '@tanstack/react-router';

const ScenarioSelector = ({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (value?: number) => void;
}) => {
  const query = useInfiniteScenarios({});
  const { scenarioId } = useParams({
    strict: false,
  });

  return (
    <ReferencePickerWithQuery<Scenario, ScenarioApiFilterMethods>
      value={value}
      onChange={onChange ?? (() => {})}
      // @ts-expect-error -- TODO: REFACTOR specyfic component
      infiniteQuery={() => query}
      renderOnButton={data => <ScenarioTitleCard scenarioId={data} />}
      filterCondition={data => data.id !== Number(scenarioId)}
      renderItem={data => <ScenarioCard scenarioId={data} />}
      getItemId={item => item.id}
      dialogTitle={'Select scenario'}
      emptyComponent={
        <>
          <div className='flex flex-col items-center gap-6 text-center justify-center h-full'>
            <TextSelect className='size-32 text-default-200' />
            <h1 className='font-bold'>
              There are no scenarios to import type from
            </h1>
          </div>
        </>
      }
    />
  );
};

export default ScenarioSelector;
