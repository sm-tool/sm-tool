import { AttributeInstanceForm } from '@/features/attribute/types.ts';
import { AttributeTemplate } from '@/features/attribute-template/types.ts';
import useInitialAttributeActions from '@/features/attribute/components/attribute-object-setter/attribute-card-initial-value/use-initial-attribute-actions.tsx';
import WithTopActions from '@/lib/actions/hoc/with-top-actions.tsx';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';
import { AttributeTypeDisplay } from '@/features/attribute-template/attribute-type/types.ts';

type AttributeCardValueProperties = {
  className?: string;
  attributeInstance: AttributeInstanceForm;
  attributeTemplate: AttributeTemplate;
};

const AttributeCardInitialValue = ({
  className,
  attributeTemplate,
}: AttributeCardValueProperties) => {
  const actions = useInitialAttributeActions();
  // const isValueSet =
  //   attributeInstance.initialValue !== undefined &&
  //   attributeInstance.initialValue !== null;
  // const isDefaultValueOverridden =
  //   attributeTemplate.defaultValue !== attributeInstance.initialValue &&
  //   attributeTemplate.defaultValue !== null;

  return (
    <WithTopActions<AttributeTemplate>
      actions={actions}
      item={attributeTemplate}
    >
      <Card
        className={cn(
          'w-full rounded-lg',
          className,
          // !isValueSet && 'border-danger border-2',
        )}
      >
        <div className='flex flex-col gap-2 p-2 items-center'>
          <div className='flex flex-col items-center'>
            <span
              className={cn(
                'text-xs text-default-500 border-1 border-default-300 rounded-sm p-0.5 px-1',
                // !isValueSet && 'bg-danger/20 text-danger',
              )}
            >
              {AttributeTypeDisplay[attributeTemplate.type]}
            </span>
            {/*{isDefaultValueOverridden && (*/}
            {/*  <span className='text-[10px] text-default-400 mt-1'>*/}
            {/*    Default: {attributeTemplate.defaultValue}*/}
            {/*  </span>*/}
            {/*)}*/}
          </div>
          <span className='text-default-900 truncate'>
            {attributeTemplate.name}
          </span>
          <span
            className={cn(
              'truncate bg-content2 rounded-sm p-1 px-4 min-w-6 min-h-4',
              // !isValueSet && 'bg-danger/20 text-danger',
            )}
          >
            {/*{isValueSet ? attributeInstance.initialValue : 'No value set'}*/}
          </span>
        </div>
      </Card>
    </WithTopActions>
  );
};

export default AttributeCardInitialValue;
