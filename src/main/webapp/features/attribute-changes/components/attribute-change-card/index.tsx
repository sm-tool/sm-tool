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
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb.tsx';
import useScenarioSearchParameterNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import { useObjectTemplate } from '@/features/object-template/queries.ts';
import { Label } from '@/components/ui/shadcn/label.tsx';
import { useAttributeInstanceMapping } from '@/features/attribute/queries.ts';
import { useObjectInstance } from '@/features/object-instance/queries.ts';

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
  attributeChange,
  attributeTemplateId,
  onDelete,
  onChange,
  disabled = false,
}: {
  attributeChange: AttributeChange;
  attributeTemplateId: number;
  onDelete: (attributeChange: AttributeChange) => void;
  onChange: (attributeChange: AttributeChange) => void;
  disabled?: boolean;
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
            <DialogTrigger asChild disabled={disabled}>
              <Button
                variant='outline'
                size='icon'
                className='w-12'
                disabled={disabled}
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
          <ConfirmDoubleClickButton onConfirm={() => onDelete(attributeChange)}>
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
}: {
  attributeChange: AttributeChange;
  onChange: (attributeChange: AttributeChange) => void;
  onDelete: (attributeChange: AttributeChange) => void;
  disabled?: boolean;
}) => {
  const attributeInstanceMappingQuery = useAttributeInstanceMapping(
    attributeChange.attributeId,
  );

  const { originalMaps } = useEventForm();

  return (
    <StatusComponent useQuery={attributeInstanceMappingQuery}>
      {attributeInstanceMapping => {
        if (!attributeInstanceMapping) return <></>;

        return (
          <Card className={'w-full rounded-lg p-2'}>
            <div className='flex justify-between items-start w-full'>
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
                attributeChange={attributeChange}
                attributeTemplateId={
                  attributeInstanceMapping.attributeTemplateId
                }
                onDelete={onDelete}
                onChange={onChange}
              />
            </div>

            {originalMaps?.attributes?.[attributeChange.attributeId] && (
              <AttributeDetails
                attributeChange={attributeChange}
                attribtueTemplateId={
                  attributeInstanceMapping.attributeTemplateId
                }
              />
            )}
          </Card>
        );
      }}
    </StatusComponent>
  );
};

export default AttributeChangeCard;
