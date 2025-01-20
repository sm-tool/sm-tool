import ReferencePickerSelection from '@/components/ui/common/input/reference-picker/reference-picker-selection.tsx';
import { ObjectTemplate } from '@/features/object-template/types.ts';
import {
  useInfiniteObjectTemplateHeaderLess,
  useObjectTemplatesScenarioList,
} from '@/features/object-template/queries.ts';
import ObjectTemplateBadge from '@/features/object-template/components/object-template-badge.tsx';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';

const ObjectTemplateSelector = ({
  value,
  onChange,
  scenarioId,
}: {
  value: number[];
  onChange: (value?: number[]) => void;
  scenarioId: number;
}) => {
  const query = useInfiniteObjectTemplateHeaderLess(scenarioId, {});

  return (
    <StatusComponent
      useQuery={useObjectTemplatesScenarioList()}
      loadingComponent={<Skeleton className='w-full h-[301px]' />}
    >
      {scenarioTemplatedIds => (
        <ReferencePickerSelection<ObjectTemplate, 'qdsObjectTemplate'>
          value={value}
          onChange={onChange}
          getItemId={data => data.id}
          // @ts-expect-error -- refacotr into proper component
          infiniteQuery={() => query}
          filterFunction={id => !scenarioTemplatedIds!.includes(id)}
          renderItem={objectTemplateId => (
            <ObjectTemplateBadge templateId={objectTemplateId} />
          )}
        />
      )}
    </StatusComponent>
  );
};

export default ObjectTemplateSelector;
