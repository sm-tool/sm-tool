import { AttributeChange } from '@/features/attribute-changes/types.ts';
import { useAttributeTemplate } from '@/features/attribute-template/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { AttributeTypeDisplay } from '@/features/attribute-template/attribute-type/types.ts';
import { cn } from '@nextui-org/theme';
import { ArrowRight, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import ConfirmDoubleClickButton from '@/components/ui/common/input/confirm-double-click-button';
import AttributeChangeForm from '@/features/association-change/components/association-change-card/attribute-change-form.tsx';
import { useForm } from 'react-hook-form';
import { useEventForm } from '@/app/scenario/$scenarioId/_layout/events/_layout/$threadId/_layout/$eventId/~components/event-form-context.tsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb.tsx';
import useScenarioSearchParameterNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import { useObjectTemplate } from '@/features/object-template/queries.ts';
import { useAttributeInstanceMapping } from '@/features/attribute/queries.ts';
import { useObjectInstance } from '@/features/object-instance/queries.ts';
import { CommandItem } from '@/components/ui/shadcn/command.tsx';
import MultiStatusComponent from '@/components/ui/common/data-load-states/status-multi-query-component';
import QuickTooltip from '@/components/ui/common/display/quick-tooltip';

export const ObjectTemplateBreadcrumb = ({
  templateId,
}: {
  templateId: number;
}) => {
  const objectTemplateQuery = useObjectTemplate(templateId);
  const { navigateRelative } = useScenarioSearchParameterNavigation();

  return (
    <StatusComponent useQuery={objectTemplateQuery}>
      {objectTemplate => (
        <BreadcrumbItem>
          <QuickTooltip content={<span>{objectTemplate!.title}</span>}>
            <BreadcrumbLink
              onClick={() =>
                navigateRelative(`catalogue:templates:${objectTemplate!.id}`)
              }
              className='max-w-[200px] truncate text-xl border-l-3 border-primary-500 pl-2'
            >
              {objectTemplate!.title}
            </BreadcrumbLink>
          </QuickTooltip>
        </BreadcrumbItem>
      )}
    </StatusComponent>
  );
};

export const BreadCrumbLink = ({ objectId }: { objectId: number }) => {
  const objectInstanceQuery = useObjectInstance(objectId);
  const { navigateRelative } = useScenarioSearchParameterNavigation();

  return (
    <StatusComponent useQuery={objectInstanceQuery}>
      {objectInstance => (
        <div className='flex items-center'>
          <ObjectTemplateBreadcrumb templateId={objectInstance!.templateId} />
          <BreadcrumbSeparator className='mr-1' />
          <BreadcrumbItem>
            <QuickTooltip content={<span>{objectInstance!.name}</span>}>
              <BreadcrumbLink
                onClick={() =>
                  navigateRelative(`objects:${objectInstance!.id}`)
                }
                className='max-w-[200px] text-xl truncate'
              >
                {objectInstance!.name}
              </BreadcrumbLink>
            </QuickTooltip>
          </BreadcrumbItem>
        </div>
      )}
    </StatusComponent>
  );
};

export const BreadCrumbTemplateName = ({
  attributeTemplateId,
}: {
  attributeTemplateId: number;
}) => {
  const attributeTemplateQuery = useAttributeTemplate(attributeTemplateId);

  return (
    <StatusComponent useQuery={attributeTemplateQuery}>
      {attributeTemplate => (
        <div className='flex items-center'>
          <BreadcrumbItem>
            <QuickTooltip content={<span>{attributeTemplate!.name}</span>}>
              <BreadcrumbPage
                className='max-w-[200px] text-xl truncate text-default-700 max-lg:border-l-3
                  max-lg:border-primary-500 max-lg:pl-2'
              >
                {attributeTemplate!.name}
              </BreadcrumbPage>
            </QuickTooltip>
          </BreadcrumbItem>
        </div>
      )}
    </StatusComponent>
  );
};

const isValueUnset = (value: string | null) =>
  value === undefined || value === null || value === '';

const AttributeForm = ({
  attributeChange,
  attributeTemplateId,
  onDelete,
  onChange,
  editDisabled = false,
  deleteDisabled = false,
}: {
  attributeChange: AttributeChange;
  attributeTemplateId: number;
  onDelete: (attributeChange: AttributeChange) => void;
  onChange: (attributeChange: AttributeChange) => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const methods = useForm<AttributeChange>({
    defaultValues: attributeChange,
  });

  const handleSubmit = (data: AttributeChange) => {
    onChange(data);
    setIsOpen(false);
  };

  return (
    <StatusComponent
      useQuery={useAttributeTemplate(attributeTemplateId)}
      className='w-fit'
    >
      {attributeTemplate => (
        <div className='flex gap-2 p-2'>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild disabled={editDisabled}>
              <Button
                variant='outline'
                size='icon'
                className='w-12'
                disabled={editDisabled}
              >
                <Pencil className='size-5' />
              </Button>
            </DialogTrigger>
            <AttributeChangeForm
              methods={methods}
              attribute={attributeTemplate!}
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
            />
          </Dialog>
          <ConfirmDoubleClickButton
            onConfirm={() => onDelete(attributeChange)}
            disabled={deleteDisabled}
            side='left'
            disabledText={'default value change cannot be deleted '}
          >
            <Trash2 className='size-5' />
          </ConfirmDoubleClickButton>
        </div>
      )}
    </StatusComponent>
  );
};

const ValueDisplay = ({
  value,
  originalValue,
  unit,
  isUnset,
}: {
  value: string | null;
  originalValue: string | null;
  unit?: string | null;
  isUnset: boolean;
}) => {
  const hasStateChanged = value !== originalValue;

  return (
    <div className='text-center'>
      <div
        className={cn(
          'truncate min-w-0 bg-content2 rounded-sm p-1 px-4',
          isUnset && 'bg-danger/20 text-danger',
          hasStateChanged && 'bg-warning/20 text-danger-',
        )}
      >
        {value || 'No value set'}
        {unit && <span className='text-default-500 italic ml-1'>{unit}</span>}
      </div>
      {hasStateChanged && (
        <div className='text-default-500 text-sm mt-1'>
          {'Previously: ' + (originalValue || 'No value set')}
        </div>
      )}
    </div>
  );
};

const AttributeDetails = ({
  attribtueTemplateId,
  attributeChange,
}: {
  attributeChange: AttributeChange;
  attribtueTemplateId: number;
}) => {
  const { originalMaps } = useEventForm();

  const originalAttribute =
    originalMaps.attributes[attributeChange.attributeId].changeType.to;

  const fromValueUnset = isValueUnset(attributeChange.changeType.from);
  const toValueUnset = isValueUnset(attributeChange.changeType.to);

  return (
    <StatusComponent useQuery={useAttributeTemplate(attribtueTemplateId)}>
      {attributeTemplate => (
        <>
          <div
            className={cn(
              'text-xs border-1 border-content3 rounded-sm p-0.5 px-2 mb-2 w-fit ml-4',
              (fromValueUnset || toValueUnset) && 'bg-danger/20 text-danger',
            )}
          >
            {AttributeTypeDisplay[attributeTemplate!.type]}
          </div>

          <div className='flex items-center justify-center gap-3'>
            <ValueDisplay
              originalValue={attributeChange.changeType.from}
              value={attributeChange.changeType.from}
              unit={attributeTemplate!.unit}
              isUnset={fromValueUnset}
            />

            <ArrowRight className='text-default-400' />

            <ValueDisplay
              originalValue={originalAttribute}
              value={attributeChange.changeType.to}
              unit={attributeTemplate!.unit}
              isUnset={toValueUnset}
            />
          </div>
        </>
      )}
    </StatusComponent>
  );
};

const AttributeChangeCard = ({
  attributeChange,
  onChange,
  onDelete,
  deleteDisabled = false,
  editDisabled = false,
}: {
  attributeChange: AttributeChange;
  onChange: (attributeChange: AttributeChange) => void;
  onDelete: (attributeChange: AttributeChange) => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
}) => {
  const attributeInstanceMappingQuery = useAttributeInstanceMapping(
    attributeChange.attributeId,
  );
  const objectQuery = useObjectInstance(
    attributeInstanceMappingQuery.data?.objectId,
  );

  const attributeQuery = useAttributeTemplate(
    attributeInstanceMappingQuery.data?.attributeTemplateId,
  );

  const { originalMaps } = useEventForm();

  return (
    <MultiStatusComponent
      queries={{
        attributeInstanceMapping: attributeInstanceMappingQuery,
        object: objectQuery,
        attribute: attributeQuery,
      }}
    >
      {queries => {
        if (!queries.attributeInstanceMapping) return <></>;

        return (
          <CommandItem
            value={`${queries.object.name} ${queries.attribute.name}`}
          >
            <Card
              className={'w-full rounded-lg p-2'}
              onClick={() =>
                console.log(`${queries.object.name} ${queries.attribute.name}`)
              }
            >
              <div className='flex justify-between items-start w-full'>
                <Breadcrumb className='flex w-full'>
                  <BreadcrumbList className='flex items-center'>
                    <BreadcrumbItem className='max-lg:hidden'>
                      <BreadCrumbLink
                        objectId={queries.attributeInstanceMapping.objectId}
                      />
                      <BreadcrumbSeparator />
                    </BreadcrumbItem>
                    <BreadCrumbTemplateName
                      attributeTemplateId={
                        queries.attributeInstanceMapping.attributeTemplateId
                      }
                    />
                  </BreadcrumbList>
                </Breadcrumb>

                <AttributeForm
                  attributeChange={attributeChange}
                  attributeTemplateId={
                    queries.attributeInstanceMapping.attributeTemplateId
                  }
                  onDelete={onDelete}
                  onChange={onChange}
                  deleteDisabled={deleteDisabled}
                  editDisabled={editDisabled}
                />
              </div>

              {originalMaps?.attributes?.[attributeChange.attributeId] && (
                <AttributeDetails
                  attributeChange={attributeChange}
                  attribtueTemplateId={
                    queries.attributeInstanceMapping.attributeTemplateId
                  }
                />
              )}
            </Card>
          </CommandItem>
        );
      }}
    </MultiStatusComponent>
  );
};

export default AttributeChangeCard;
