import { QdsObjectTemplate } from '@/models/object/entity.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import ObjectTemplate from '@/components/feature/entity/object/object-template';
import { cn } from '@nextui-org/theme';

const ScenarioTemplateHighlight = ({
  template,
  className,
}: {
  template: QdsObjectTemplate;
  className: string;
}) => {
  return (
    <Card className={cn('flex flex-col p-2 space-y-6', className)}>
      <ObjectTemplate templates={[template]} className='mx-auto' />
      <Card className='bg-content2 p-2 grid grid-cols-3 gap-2'>
        {template.attributeNames.map((attributeName, index) => (
          <Card key={index} className='truncate bg-content3 p-2 text-center'>
            {attributeName}
          </Card>
        ))}
      </Card>
    </Card>
  );
};

export default ScenarioTemplateHighlight;
