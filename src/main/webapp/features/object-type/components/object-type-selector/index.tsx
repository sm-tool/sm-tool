import {
  useInfiniteObjectTypeHeaderLess,
  useObjectTypeScenarioList,
} from '@/features/object-type/queries.ts';
import ReferencePickerSelection from '@/components/ui/common/input/reference-picker/reference-picker-selection.tsx';
import { ObjectType } from '@/features/object-type/types.ts';
import { ObjectTypeTitle } from '@/features/object-type/components/object-type-overview/object-type-header.tsx';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';

const ObjectTypeSelector = ({
  value,
  onChange,
  scenarioId,
}: {
  value: number[];
  onChange: (value?: number[]) => void;
  scenarioId: number;
}) => {
  const query = useInfiniteObjectTypeHeaderLess(scenarioId, {});

  return (
    <div>
      <StatusComponent
        useQuery={useObjectTypeScenarioList()}
        loadingComponent={<Skeleton className='w-full h-[301px]' />}
        showIfEmpty
      >
        {scenarioTypeIds => (
          <ReferencePickerSelection<ObjectType, 'qdsObjectType'>
            value={value}
            onChange={onChange}
            getItemId={data => data.id}
            // @ts-expect-error -- refacotr into proper component
            infiniteQuery={() => query}
            filterFunction={id => !scenarioTypeIds!.includes(id)}
            renderItem={objectTypeId => (
              <ObjectTypeTitle objectTypeId={objectTypeId} />
            )}
          />
        )}
      </StatusComponent>
    </div>
  );
};

export default ObjectTypeSelector;
