import ReferencePickerWithQuery from '@/components/ui/common/input/reference-picker-TODO/reference-picker-with-query.tsx';
import { useInfiniteObjectTemplateByTypeId } from '@/features/object-template/queries.ts';
import {
  ObjectTemplate,
  ObjectTemplateForm,
} from '@/features/object-template/types.ts';
import { TextSelect } from 'lucide-react';
import { ObjectTemplateBadge } from '@/features/object-template/components/object-template-badge.tsx';
import { CreateNewTemplateButton } from '@/app/home/_layout/catalog/_layout/templates';

const ObjectTemplatePicker = ({
  value,
  objectTypeId,
  onChange,
}: {
  value?: number;
  objectTypeId: number;
  onChange?: (value?: number) => void;
  defaultValueForCreator?: Partial<ObjectTemplateForm>;
}) => {
  const query = useInfiniteObjectTemplateByTypeId(objectTypeId, {});

  return (
    <ReferencePickerWithQuery<ObjectTemplate, 'qdsObjectTemplate'>
      value={value}
      onChange={onChange ?? (() => {})}
      // @ts-expect-error -- TODO poprawić kiedyś te typy
      infiniteQuery={() => query}
      renderItem={data => <ObjectTemplateBadge templateId={data} />}
      getItemId={item => item.id}
      emptyComponent={
        <>
          <div className='flex flex-col items-center gap-6 text-center justify-center h-full'>
            <TextSelect className='size-32 text-default-200' />
            <h1 className='font-bold'>
              We could not find any template connected to selected type, go back
              and select other type or
            </h1>
          </div>
        </>
      }
      topUtil={
        <CreateNewTemplateButton
          defaultValueForCreator={{
            objectTypeId: objectTypeId,
          }}
        />
      }
    />
  );
};

export default ObjectTemplatePicker;
