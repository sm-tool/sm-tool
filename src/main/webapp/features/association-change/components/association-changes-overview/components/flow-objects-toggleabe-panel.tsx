import React from 'react';
import { useObjectInstancesOfThread } from '@/features/object-instance/queries.ts';
import { useAssociationFlow } from '@/features/association-change/components/association-changes-overview/associaiton-changes-context.tsx';
import { Panel } from '@xyflow/react';
import { Input } from '@/components/ui/shadcn/input.tsx';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area.tsx';
import { Checkbox } from '@/components/ui/shadcn/checkbox.tsx';
import { ObjectStylized } from '@/features/object-instance/components/object-card';
import { useParams } from '@tanstack/react-router';

const FlowObjectsToggleablePanel = () => {
  const { threadId } = useParams({
    strict: false,
  });
  const { toggleNodeVisibility, hiddenNodes } = useAssociationFlow();
  const [search, setSearch] = React.useState('');

  const { data: objects } = useObjectInstancesOfThread(Number(threadId));
  const combinedObjects = React.useMemo(() => {
    if (!objects) return [];
    return [...objects.global, ...objects.local];
  }, [objects]);

  const filteredObjects = React.useMemo(() => {
    return combinedObjects.filter(object =>
      object.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [combinedObjects, search]);

  return (
    <Panel position='top-right' className='!p-0 !m-0' style={{ width: 400 }}>
      <div className='bg-background p-4 border-l-2 border-content4 h-full'>
        <Input
          placeholder='Search objects'
          value={search}
          onChange={event => setSearch(event.target.value)}
          className='mb-4'
        />
        <ScrollArea className='h-[700px]'>
          <div className='space-y-2'>
            {filteredObjects.map(object => (
              <div key={object.id} className='flex items-center gap-2'>
                <Checkbox
                  checked={!hiddenNodes.has(object.id.toString())}
                  onCheckedChange={() =>
                    toggleNodeVisibility(object.id.toString())
                  }
                />
                <ObjectStylized
                  className='select-none'
                  objectId={object.id}
                  onClick={() => toggleNodeVisibility(object.id.toString())}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Panel>
  );
};

export default FlowObjectsToggleablePanel;
