import { Card, CardContent, CardTitle } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';
import { ObjectTemplate } from '@/features/object-template/types.ts';

const ObjectTemplateCard = ({
  objectTemplate,
  className,
}: {
  objectTemplate: ObjectTemplate;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        `rounded-none relative min-h-24 max-h-32 p-4 gap-y-6 border transition-all
        duration-75 border-l-4 hover:border-l-[6px] max-w-[30rem] cursor-pointer`,
        className,
      )}
      style={{
        borderLeftColor: objectTemplate.color,
        backgroundColor: `${objectTemplate.color}05`,
      }}
    >
      <div className='flex flex-col gap-2'>
        <CardTitle className='text-lg font-semibold'>
          {objectTemplate.title}
        </CardTitle>
        <CardContent className='text-sm text-default-600 p-0 line-clamp-2'>
          {objectTemplate.description}
        </CardContent>
      </div>
    </Card>
  );
};

export default ObjectTemplateCard;
