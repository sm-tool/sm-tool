import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import ChromeCard from '@/app/scenario/$scenarioId/_layout/events/_layout/~components/chrome-tabs/chrome-card';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

export interface ChromeTab {
  id: number;
  title: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

interface ChromeRailProperties {
  tabs: ChromeTab[];
  onTabClick: (id: number) => void;
  onTabsChange: (tabs: ChromeTab[]) => void;
  onTabClose: (id: number) => void;
}

const ChromeRail = ({
  tabs,
  onTabClick,
  onTabsChange,
  onTabClose,
}: ChromeRailProperties) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
        distance: 1,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex(tab => tab.id === active.id);
      const newIndex = tabs.findIndex(tab => tab.id === over.id);

      const newTabs = arrayMove(tabs, oldIndex, newIndex);
      onTabsChange(newTabs);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      modifiers={[restrictToHorizontalAxis]}
    >
      <ScrollArea className='w-full h-8'>
        <SortableContext
          items={tabs.map(tab => tab.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className='flex items-center h-full min-w-full divide-x divide-content1 bg-content4'>
            {tabs.map(tab => (
              <ChromeCard
                key={tab.id}
                id={tab.id}
                title={tab.title}
                isActive={tab.isActive}
                onClick={() => onTabClick(tab.id)}
                onClose={() => onTabClose(tab.id)}
              />
            ))}
          </div>
        </SortableContext>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </DndContext>
  );
};

export default ChromeRail;
