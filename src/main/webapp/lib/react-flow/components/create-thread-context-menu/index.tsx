import { Popover, PopoverContent } from '@/components/ui/shadcn/popover.tsx';
import React from 'react';
import { FLOW_UNIT_WIDTH } from '@/lib/react-flow/config/scenario-flow-config.ts';
import { useViewport } from '@xyflow/react';
import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';

export type CreateThreadContextMenuType =
  | {
      position: { x: number; y: number };
      time: number;
    }
  | undefined;

type ThreadContextMenuProperties = {
  contextMenu: CreateThreadContextMenuType;
  onOpenDialog: (time: number) => void;
  onClose: () => void;
};

const ThreadContextMenu = ({
  contextMenu,
  onOpenDialog,
  onClose,
}: ThreadContextMenuProperties) => {
  const [mounted, setMounted] = React.useState(false);
  const viewport = useViewport();
  const { scenarioManipulation } = useThreadsFlow();

  React.useEffect(() => {
    globalThis.requestAnimationFrame(() => setMounted(true));
    return () => setMounted(false);
  }, []);

  if (!contextMenu) return null;

  const position = {
    x: contextMenu.time * FLOW_UNIT_WIDTH * viewport.zoom + viewport.x,
    width: FLOW_UNIT_WIDTH * viewport.zoom,
  };

  const isValidMergePosition =
    scenarioManipulation.isCreatingMerge &&
    contextMenu.time + 1 > scenarioManipulation.getMaxEndTime();

  const buttonContent = scenarioManipulation.isCreatingMerge
    ? isValidMergePosition
      ? 'Create merge'
      : 'Invalid merge position'
    : 'Create thread';

  return (
    <Popover open={true} onOpenChange={onClose}>
      <div
        className='absolute h-full bg-black/20 pointer-events-none'
        style={{
          left: position.x,
          width: position.width,
        }}
      />
      <PopoverContent
        className={`absolute w-48 rounded-tl-none p-0 transition-all duration-200 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95' }`}
        style={{
          left: contextMenu.position.x,
          top: contextMenu.position.y,
        }}
      >
        <div
          className={`flex cursor-pointer select-none items-center px-2 h-14 size-full ${
            !scenarioManipulation.isCreatingMerge || isValidMergePosition
              ? 'hover:bg-content2'
              : 'opacity-50 cursor-not-allowed'
            }`}
          onClick={() => {
            if (!scenarioManipulation.isCreatingMerge || isValidMergePosition) {
              onOpenDialog(contextMenu.time);
              onClose();
            }
          }}
        >
          {buttonContent}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThreadContextMenu;
