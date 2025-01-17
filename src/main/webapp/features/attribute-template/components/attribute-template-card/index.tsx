import { AttributeTemplate } from '@/features/attribute-template/types.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';
import React from 'react';
import { AttributeTypeDisplay } from '@/features/attribute-template/attribute-type/types.ts';
import WithTopActions from '@/lib/actions/hoc/with-top-actions.tsx';
import useAttributeTemplateActions from '@/features/attribute-template/components/attribute-template-card/use-attribute-template-actions.tsx';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';
import FormatDate from '@/utils/dates/format-date.ts';

interface AttributeTemplateCardProperties
  extends React.HTMLAttributes<HTMLDivElement> {
  attributeTemplate: AttributeTemplate;
}

const AttributeTemplateCard = React.forwardRef<
  HTMLDivElement,
  AttributeTemplateCardProperties
>(({ attributeTemplate, className, ...properties }, reference) => {
  const CardContent = () => {
    const actions = useAttributeTemplateActions();
    const isValueSet =
      attributeTemplate.defaultValue !== undefined &&
      attributeTemplate.defaultValue !== null &&
      attributeTemplate.defaultValue !== '';

    return (
      <div className='relative'>
        <WithTopActions<AttributeTemplate>
          actions={actions}
          item={attributeTemplate}
        >
          <Card
            ref={reference}
            className={cn(
              'w-full rounded-lg',
              className,
              !isValueSet && 'border-danger border-2',
            )}
            {...properties}
          >
            <div className='flex flex-col gap-2 p-2 items-center'>
              <span
                className={cn(
                  `text-xs text-default-500 border-1 border-default-300 rounded-sm p-0.5 px-1
                  max-w-full`,
                  !isValueSet && 'bg-danger/20 text-danger',
                )}
              >
                {AttributeTypeDisplay[attributeTemplate.type]}
              </span>
              <span className='text-default-900 truncate max-w-[90%]'>
                {attributeTemplate.name}
              </span>
              <div className='flex flex-row gap-y-6 w-full'>
                <p
                  className={cn(
                    'truncate bg-content2 rounded-sm p-1 px-4 min-w-6 min-h-4 w-full text-center',
                    !isValueSet && 'bg-danger/20 text-danger',
                  )}
                >
                  <span className='max-w-[90%] inline-block truncate align-middle'>
                    {isValueSet
                      ? attributeTemplate.type === AttributeTypeDisplay.DATE
                        ? FormatDate(attributeTemplate.defaultValue)
                        : attributeTemplate.defaultValue
                      : 'No value set'}
                  </span>
                  {attributeTemplate.unit && (
                    <span className='text-default-500 italic ml-1'>
                      {attributeTemplate.unit}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        </WithTopActions>
      </div>
    );
  };

  return (
    <DialogWrapper>
      <CardContent />
    </DialogWrapper>
  );
});

AttributeTemplateCard.displayName = 'AttributeTemplateCard';

export default AttributeTemplateCard;
