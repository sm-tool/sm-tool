import { ObjectInstance } from '@/features/object-instance/types.ts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card.tsx';
import ObjectDialogs from '@/features/object-instance/components/object-overview/object-dialogs.tsx';
import { ObjectStylized } from '@/features/object-instance/components/object-card';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import {
  useObjectInstance,
  useObjectStartingAttributesValues,
} from '@/features/object-instance/queries.ts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/shadcn/accordition.tsx';
import { useObjectType } from '@/features/object-type/queries.ts';
import { ObjectType } from '@/features/object-type/types.ts';
import ObjectTypeOverview from '@/features/object-type/components/object-type-overview';
import { useObjectTemplate } from '@/features/object-template/queries.ts';
import { ObjectTemplate } from '@/features/object-template/types.ts';
import ObjectTemplateOverview from '@/features/object-template/components/object-template-overview';
import { AttributeTemplate } from '@/features/attribute-template/types.ts';
import AttributeCardValue from '@/features/attribute/components/attribute-card-value';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import { useThreadFirstEvent } from '@/features/event-instance/queries.ts';
import AssociationChangesList from '@/features/association-change/components/association-changes-list';
import React from 'react';
import { EventInstance } from '@/features/event-instance/types.ts';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';

const ObjectOverview = ({ objectId }: { objectId: number }) => {
  return (
    <StatusComponent<ObjectInstance> useQuery={useObjectInstance(objectId)}>
      {data => (
        <ScrollArea className='h-screen pb-16'>
          <Accordion
            type='multiple'
            defaultValue={[
              'Object details',
              'Type details',
              'Template details',
            ]}
            className='pr-2'
          >
            <ObjectDetails data={data!} />
            <TypeDetails data={data!} />
            <TemplateDetails data={data!} />
          </Accordion>
          <ScrollBar />
        </ScrollArea>
      )}
    </StatusComponent>
  );
};

const ObjectHeader = ({ data }: { data: ObjectInstance }) => {
  return (
    <div className='grid grid-cols-[1fr_auto] gap-4 items-start w-full'>
      <CardTitle className='text-xl sm:text-2xl flex items-center gap-2 border-l-4 pl-2 truncate'>
        {data.name}
      </CardTitle>
      <ObjectDialogs objectId={data.id} />
    </div>
  );
};

const ObjectDetails = ({ data }: { data: ObjectInstance }) => {
  return (
    <AccordionItem value='Object details'>
      <AccordionTrigger>
        <div className='flex-1 flex justify-center text-2xl font-bold'>
          Object details
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Card className='h-full'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <ObjectHeader data={data} />
          </CardHeader>
          <CardContent className='space-y-4'>
            <ObjectStylized objectId={data.id} />
          </CardContent>
          <ObjectStartingAttributes data={data} />
          <ObjectStartingAssociations data={data} />
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};

const ObjectStartingAttributes = ({ data }: { data: ObjectInstance }) => {
  const startingAttributesQuery = useObjectStartingAttributesValues(data.id);

  return (
    <div className='w-full h-full p-4'>
      <h3 className='text-lg font-medium text-default-500'>
        Starting attributes values
      </h3>
      <StatusComponent<
        {
          attributeTemplate: AttributeTemplate;
          value: string;
        }[]
      >
        useQuery={startingAttributesQuery}
        loadingComponent={<Skeleton className={'h-20'} />}
        emptyComponent={
          <EmptyComponentDashed text="Objects's template has no attributes" />
        }
      >
        {attributes => (
          <>
            {/*Nie mam ZIELONEGO pojęcia dlaczego musze to dodać. PRZECIEŻ WSZĘDZIE INDZIEJ DZIAŁA*/}
            {attributes?.length !== 0 && (
              <Card className='bg-content3 p-4'>
                <div className='grid grid-cols-3 gap-4'>
                  {attributes!.map(({ attributeTemplate, value }) => (
                    <AttributeCardValue
                      key={attributeTemplate.id}
                      attributeTemplateId={attributeTemplate.id}
                      value={value}
                    />
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </StatusComponent>
    </div>
  );
};

const ObjectStartingAssociations = ({ data }: { data: ObjectInstance }) => {
  const filteredAssociations = React.useMemo(() => {
    return (firstEvent: EventInstance) => {
      return firstEvent.associationChanges.filter(
        change => change.object1Id === data.id || change.object2Id === data.id,
      );
    };
  }, [data.id]);

  return (
    <div className='w-full h-full p-4 space-y-4'>
      <div className='flex flex-row justify-between'>
        <h3 className='text-lg font-medium text-default-500'>
          Starting associations
        </h3>
      </div>
      <StatusComponent
        useQuery={useThreadFirstEvent(data.originThreadId)}
        emptyComponent={
          <EmptyComponentDashed
            text={'Object does not have starting associations'}
          />
        }
      >
        {firstEvent => {
          const associations = filteredAssociations(firstEvent!);

          return associations.length > 0 ? (
            <AssociationChangesList associationChanges={associations} />
          ) : (
            <div className='w-full'>
              <div className='w-fit mx-auto'>
                <EmptyComponentDashed
                  text={'Object does not have starting associations'}
                />
              </div>
            </div>
          );
        }}
      </StatusComponent>
    </div>
  );
};

const TypeDetails = ({ data }: { data: ObjectInstance }) => {
  const objectType = useObjectType(data.objectTypeId);

  return (
    <AccordionItem value={'Type details'}>
      <AccordionTrigger>
        <div className='flex-1 flex justify-center text-2xl font-bold'>
          Object type
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <StatusComponent<ObjectType>
          useQuery={objectType}
          loadingComponent={<Skeleton className='h-[40rem]' />}
        >
          {objectType => <ObjectTypeOverview data={objectType!} />}
        </StatusComponent>
      </AccordionContent>
    </AccordionItem>
  );
};

const TemplateDetails = ({ data }: { data: ObjectInstance }) => {
  const objectTemplate = useObjectTemplate(data.templateId);

  return (
    <AccordionItem value={'Template details'}>
      <AccordionTrigger>
        <div className='flex-1 flex justify-center text-2xl font-bold'>
          Object template
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <StatusComponent<ObjectTemplate>
          useQuery={objectTemplate}
          loadingComponent={<Skeleton className='h-[40rem]' />}
        >
          {objectTemplate => <ObjectTemplateOverview data={objectTemplate!} />}
        </StatusComponent>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ObjectOverview;
