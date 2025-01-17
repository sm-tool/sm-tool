import { GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { cn } from '@nextui-org/theme';
import React from 'react';

const ResizablePanelGroup = ({
  className,
  ...properties
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className,
    )}
    {...properties}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  children,
  ...properties
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
  handleContent?: React.ReactNode;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      `relative flex w-px items-center justify-center bg-content3 transition-colors
      duration-200 hover:bg-content4 after:absolute after:inset-y-0 after:left-1/2
      after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-content4 focus-visible:ring-offset-2
      focus-visible:ring-offset-content1 data-[panel-group-direction=vertical]:h-px
      data-[panel-group-direction=vertical]:w-full
      data-[panel-group-direction=vertical]:after:left-0
      data-[panel-group-direction=vertical]:after:h-1
      data-[panel-group-direction=vertical]:after:w-full
      data-[panel-group-direction=vertical]:after:-translate-y-1/2
      data-[panel-group-direction=vertical]:after:translate-x-0
      [&[data-panel-group-direction=vertical]>div]:rotate-90`,
      className,
    )}
    {...properties}
  >
    {withHandle && (
      <div
        className={cn(
          `z-50 flex h-4 w-3 items-center justify-center rounded-sm border border-content3
          bg-content1 hover:bg-content3 hover:border-content4 transition-colors
          duration-200`,
        )}
      >
        <GripVertical className='h-2.5 w-2.5 text-content4' />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

const KinderGardenHandle = ({
  children,
  ...properties
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle>) => (
  <ResizablePrimitive.PanelResizeHandle {...properties}>
    {children}
  </ResizablePrimitive.PanelResizeHandle>
);

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  KinderGardenHandle,
};
