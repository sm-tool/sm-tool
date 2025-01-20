import { AttributeChange } from '@/features/attribute-changes/types.ts';
import React from 'react';
import { useForm } from 'react-hook-form';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import { Pencil } from 'lucide-react';
import AttributeChangeForm from '@/features/association-change/components/association-change-card/attribute-change-form.tsx';
import { cn } from '@nextui-org/theme';
import { AttributeTypeDisplay } from '@/features/attribute-template/attribute-type/types.ts';
import { AttributeState } from '@/features/event-state/types.ts';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb.tsx';
import { useAttributeInstanceMapping } from '@/features/attribute/queries.ts';
import { useObjectInstance } from '@/features/object-instance/queries.ts';
import { useAttributeTemplate } from '@/features/attribute-template/queries.ts';
import TooltipButton from '@/components/ui/common/display/tooltip-button';
import { CommandItem } from '@/components/ui/shadcn/command.tsx';
import {
  BreadCrumbLink,
  BreadCrumbTemplateName,
} from '@/features/attribute-changes/components/attribute-change-card';

const isValueUnset = (value: string | null) =>
  value === undefined || value === null || value === '';

const AttributeForm = ({
  state,
  attributeTemplateId,
  disabled = false,
}: {
  state: AttributeState;
  attributeTemplateId: number;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { createAttributeChange } = useEventForm();
  const attributeTemplateQuery = useAttributeTemplate(attributeTemplateId);

  const defaultValues: AttributeChange = {
    attributeId: state.attributeId,
    changeType: {
      from: state.value ?? null,
      to: state.value ?? null,
    },
  };

  const handleSubmit = (data: AttributeChange) => {
    const newChange: AttributeChange = {
      attributeId: state.attributeId,
      changeType: {
        from: state.value || null,
        to: data.changeType.to,
      },
    };
    createAttributeChange(newChange);
    setIsOpen(false);
  };

  const methods = useForm<AttributeChange>({
    defaultValues,
  });

  return (
    <StatusComponent useQuery={attributeTemplateQuery} className='w-fit'>
      {attributeTemplate => (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <TooltipButton
              buttonChildren={<Pencil className='size-5' />}
              className='w-12'
              variant='outline'
              tooltipDisabled={!disabled}
              disabled={disabled}
            >
              {_ => (
                <>
                  Thread termination and branching events cannot make any chan
                </>
              )}
            </TooltipButton>
          </DialogTrigger>
          <AttributeChangeForm
            methods={methods}
            attribute={attributeTemplate!}
            onSubmit={handleSubmit}
            onClose={() => setIsOpen(false)}
          />
        </Dialog>
      )}
    </StatusComponent>
  );
};

const AttributeTemplateDetails = ({
  attributeTemplateId,
  state,
}: {
  attributeTemplateId: number;
  state: AttributeState;
}) => {
  const valueUnset = isValueUnset(state.value ?? null);
  return (
    <StatusComponent useQuery={useAttributeTemplate(attributeTemplateId)}>
      {attributeTemplate => (
        <>
          <div
            className={cn(
              'text-xs border-1 border-content3 rounded-sm p-0.5 px-2 mb-2 w-fit ml-4',
              valueUnset && 'bg-danger/20 text-danger',
            )}
          >
            {AttributeTypeDisplay[attributeTemplate!.type]}
          </div>

          <div className='text-center'>
            <div
              className={cn(
                'truncate min-w-0 bg-content2 rounded-sm p-1 px-4',
                valueUnset && 'bg-danger/20 text-danger',
              )}
            >
              {state.value ?? 'No value set'}
              {attributeTemplate!.unit && (
                <span className='text-default-500 italic ml-1'>
                  {attributeTemplate!.unit}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </StatusComponent>
  );
};

const AttribiuteUnChangedCard = ({
  state,
  disabled = false,
}: {
  state: AttributeState;
  disabled?: boolean;
}) => {
  const attributeInstanceMappingQuery = useAttributeInstanceMapping(
    state.attributeId,
  );
  const objectQuery = useObjectInstance(
    attributeInstanceMappingQuery.data?.objectId,
  );
  const attributeQuery = useAttributeTemplate(
    attributeInstanceMappingQuery.data?.attributeTemplateId,
  );

  if (
    !attributeInstanceMappingQuery.data ||
    !objectQuery.data ||
    !attributeQuery.data
  ) {
    return null;
  }

  const itemValue = `${objectQuery.data.name} ${attributeQuery.data.name}`;

  return (
    <CommandItem value={itemValue} className=''>
      <Card className='w-full rounded-lg'>
        <div className='p-3'>
          <div className='flex justify-between items-start'>
            <div className='truncate max-w-[70%]'>
              <Breadcrumb className='flex w-full'>
                <BreadcrumbList className='flex items-center'>
                  <BreadcrumbItem className='max-lg:hidden'>
                    <BreadCrumbLink
                      objectId={attributeInstanceMappingQuery.data.objectId}
                    />
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
                  <BreadCrumbTemplateName
                    attributeTemplateId={
                      attributeInstanceMappingQuery.data.attributeTemplateId
                    }
                  />
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <AttributeForm
              disabled={disabled}
              state={state}
              attributeTemplateId={
                attributeInstanceMappingQuery.data.attributeTemplateId
              }
            />
          </div>
          <AttributeTemplateDetails
            state={state}
            attributeTemplateId={
              attributeInstanceMappingQuery.data.attributeTemplateId
            }
          />
        </div>
      </Card>
    </CommandItem>
  );
};

export default AttribiuteUnChangedCard;
