import { AssociationChange } from '@/features/association-change/types.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import AssociationChangeCard from '@/features/association-change/components/association-change-card';

const AssociationChangesList = ({
  associationChanges,
}: {
  associationChanges: AssociationChange[];
}) => {
  return (
    <Card>
      <ScrollArea className='w-full max-h-96 min-h-0 flex'>
        {associationChanges.map((associaitonChange, index) => (
          <AssociationChangeCard
            associationChange={associaitonChange}
            key={index}
          />
        ))}
        <ScrollBar />
      </ScrollArea>
    </Card>
  );
};

export default AssociationChangesList;
