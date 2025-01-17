import React from 'react';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';
import { AttributeTypeDisplay } from '@/features/attribute-template/attribute-type/types.ts';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useAttributeTemplate } from '@/features/attribute-template/queries.ts';
import FormatDate from '@/utils/dates/format-date.ts';

interface AttributeTemplateCardProperties
  extends React.HTMLAttributes<HTMLDivElement> {
  attributeTemplateId: number;
  value?: string;
}

const AttributeCardValue = React.forwardRef<
  HTMLDivElement,
  AttributeTemplateCardProperties
>(({ attributeTemplateId, className, value, ...properties }, reference) => {
  const CardContent = () => {
    const isValueSet = value !== undefined && value !== null && value !== '';

    return (
      <StatusComponent useQuery={useAttributeTemplate(attributeTemplateId)}>
        {attributeTemplate => (
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
                  'text-xs text-default-500 border-1 border-default-300 rounded-sm p-0.5 px-1',
                  !isValueSet && 'bg-danger/20 text-danger',
                )}
              >
                {AttributeTypeDisplay[attributeTemplate!.type]}
              </span>
              <span className='text-default-900 truncate'>
                {attributeTemplate!.name}
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
                      ? attributeTemplate?.type === AttributeTypeDisplay.DATE
                        ? FormatDate(value)
                        : value
                      : 'No value set'}
                  </span>
                  {attributeTemplate?.unit && (
                    <span className='text-default-500 italic ml-1'>
                      {attributeTemplate.unit}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        )}
      </StatusComponent>
    );
  };
  return (
    <DialogWrapper>
      <CardContent />
    </DialogWrapper>
  );
});

AttributeCardValue.displayName = 'AttributeCardValue';

export default AttributeCardValue;
