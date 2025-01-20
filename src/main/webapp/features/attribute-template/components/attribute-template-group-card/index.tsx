import { useAllTemplateAttributes } from '@/features/attribute-template/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import AttributeTemplateCard from '@/features/attribute-template/components/attribute-template-card';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';

const LoadingAttributeTemplateGroupCard = () => (
  <div className='grid grid-cols-3 gap-4'>
    {Array.from({ length: 3 }).map((_, index) => (
      <Skeleton
        key={index}
        className='h-[110px] w-full bg-content1 rounded-lg'
      />
    ))}
  </div>
);

const AttributeTemplateGroupCard = ({ templateId }: { templateId: number }) => {
  return (
    <StatusComponent
      useQuery={useAllTemplateAttributes(templateId)}
      loadingComponent={LoadingAttributeTemplateGroupCard()}
      emptyComponent={<EmptyComponentDashed text='No attributes created' />}
      animateMode='popLayout'
    >
      {data => (
        <ScrollArea>
          <div className='grid grid-cols-2 gap-4 @container'>
            {data!.map(attribute => (
              <AttributeTemplateCard
                key={attribute.id}
                attributeTemplate={attribute}
              />
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      )}
    </StatusComponent>
  );
};

export default AttributeTemplateGroupCard;
