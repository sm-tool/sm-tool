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
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb.tsx';
import { useObjectTemplate } from '@/features/object-template/queries.ts';
import useScenarioSearchParameterNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import { Label } from '@/components/ui/shadcn/label.tsx';
import { useAttributeInstanceMapping } from '@/features/attribute/queries.ts';
import { useObjectInstance } from '@/features/object-instance/queries.ts';
import { useAttributeTemplate } from '@/features/attribute-template/queries.ts';
import TooltipButton from '@/components/ui/common/display/tooltip-button';

const ObjectTemplateBreadcrumb = ({ templateId }: { templateId: number }) => {
  const objectTemplateQuery = useObjectTemplate(templateId);
  const { navigateRelative } = useScenarioSearchParameterNavigation();

  return (
    <StatusComponent useQuery={objectTemplateQuery}>
      {objectTemplate => (
        <BreadcrumbLink
          onClick={() =>
            navigateRelative(`catalogue:templates:${objectTemplate!.id}`)
          }
        >
          <Label variant='entity' size='xl' className='hover:cursor-pointer'>
            {objectTemplate!.title}
          </Label>
        </BreadcrumbLink>
      )}
    </StatusComponent>
  );
};

const BreadCrumbLink = ({ objectId }: { objectId: number }) => {
  const objectInstanceQuery = useObjectInstance(objectId);

  return (
    <StatusComponent useQuery={objectInstanceQuery}>
      {objectInstance => (
        <ObjectTemplateBreadcrumb templateId={objectInstance!.templateId} />
      )}
    </StatusComponent>
  );
};

const BreadCrumbTemplateName = ({
  attributeTemplateId,
}: {
  attributeTemplateId: number;
}) => {
  return (
    <StatusComponent useQuery={useAttributeTemplate(attributeTemplateId)}>
      {attributeTemplate => (
        <BreadcrumbItem>
          <Label size='xl' className='text-default-700'>
            {attributeTemplate!.name}
          </Label>
        </BreadcrumbItem>
      )}
    </StatusComponent>
  );
};

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
  const attributeInstanceMapping = useAttributeInstanceMapping(
    state.attributeId,
  );

  return (
    <StatusComponent useQuery={attributeInstanceMapping}>
      {attributeInstanceMapping => {
        if (!attributeInstanceMapping) return <></>;

        return (
          <Card className='w-full rounded-lg'>
            <div className='p-3'>
              <div className='flex justify-between items-start'>
                <div className='truncate max-w-[70%]'>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadCrumbLink
                          objectId={attributeInstanceMapping.objectId}
                        />
                        <BreadcrumbSeparator />
                      </BreadcrumbItem>
                      <BreadCrumbTemplateName
                        attributeTemplateId={
                          attributeInstanceMapping.attributeTemplateId
                        }
                      />
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <AttributeForm
                  disabled={disabled}
                  state={state}
                  attributeTemplateId={
                    attributeInstanceMapping.attributeTemplateId
                  }
                />
              </div>
              <AttributeTemplateDetails
                state={state}
                attributeTemplateId={
                  attributeInstanceMapping.attributeTemplateId
                }
              />
            </div>
          </Card>
        );
      }}
    </StatusComponent>
  );
};

export default AttribiuteUnChangedCard;
