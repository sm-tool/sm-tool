import { Button } from '@/components/ui/shadcn/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/shadcn/resizable-panel';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import { ReactNode, RefObject, useCallback, useRef, useState } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { cn } from '@nextui-org/theme';
import getPixelRatio from '@/utils/helper/get-pixel-ratio.ts';

interface PanelContentProperties {
  content: ReactNode;
  collapseButton?: {
    icon: typeof ChevronLeft;
    position: string;
    onClick: () => void;
  };
}

const PanelContent = ({ content, collapseButton }: PanelContentProperties) => (
  <div className='relative h-full'>
    {collapseButton && (
      <Button
        variant='ghost'
        className={`absolute z-10 ${collapseButton.position}`}
        onClick={collapseButton.onClick}
      >
        <collapseButton.icon className='h-4 w-4' />
      </Button>
    )}

    <div className={cn('flex h-full items-center justify-center')}>
      {content}
    </div>
  </div>
);

interface ScenarioLayoutProperties {
  children: ReactNode;
  leftContent: ReactNode;
  rightContent: ReactNode;
  bottomContent: ReactNode;
}

const ScenarioLayout = ({
  children,
  leftContent,
  rightContent,
  bottomContent,
}: ScenarioLayoutProperties) => {
  // Ta da się to zrobić na albo samych refach, albo stanach — ale jestem leniwy
  const leftPanelReference = useRef<ImperativePanelHandle>(null);
  const rightPanelReference = useRef<ImperativePanelHandle>(null);
  const bottomPanelReference = useRef<ImperativePanelHandle>(null);

  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [bottomPanelCollapsed, setBottomPanelCollapsed] = useState(false);

  const togglePanel = useCallback(
    (reference: RefObject<ImperativePanelHandle>) => {
      if (reference.current) {
        if (reference.current.isCollapsed()) {
          reference.current.expand();
        } else {
          reference.current.collapse();
        }
      }
    },
    [],
  );

  return (
    <section className='flex h-screen flex-col'>
      <ResizablePanelGroup
        direction='horizontal'
        className='rounded-lg'
        autoSaveId='1'
      >
        <ResizablePanel
          ref={leftPanelReference}
          defaultSize={20}
          collapsible={true}
          collapsedSize={1.9 * getPixelRatio()}
          data-collapsed={leftPanelCollapsed}
          className='group'
          minSize={10}
          onCollapse={() => setLeftPanelCollapsed(true)}
          onExpand={() => setLeftPanelCollapsed(false)}
        >
          <PanelContent content={leftContent} />
        </ResizablePanel>
        <ResizableHandle withHandle className='border-r border-default-200' />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction='vertical' autoSaveId='2'>
            <ResizablePanel defaultSize={75} className='relative h-full'>
              {leftPanelCollapsed && (
                <Button
                  className='absolute left-2 top-2 z-10'
                  variant='ghost'
                  onClick={() => togglePanel(leftPanelReference)}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              )}
              {rightPanelCollapsed && (
                <Button
                  className='absolute right-2 top-2 z-10'
                  variant='ghost'
                  onClick={() => togglePanel(rightPanelReference)}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
              )}
              {bottomPanelCollapsed && (
                <Button
                  variant='ghost'
                  className='absolute bottom-2 left-1/2 z-10 -translate-x-1/2 transform'
                  onClick={() => togglePanel(bottomPanelReference)}
                >
                  <ChevronUp className='h-4 w-4' />
                </Button>
              )}
              {children}
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className='border-t border-default-200'
            />
            <ResizablePanel
              ref={bottomPanelReference}
              defaultSize={25}
              collapsible={true}
              collapsedSize={0}
              minSize={5}
              onCollapse={() => setBottomPanelCollapsed(true)}
              onExpand={() => setBottomPanelCollapsed(false)}
            >
              <PanelContent
                content={bottomContent}
                collapseButton={{
                  icon: ChevronDown,
                  position: 'left-1/2 top-2 -translate-x-1/2 transform',
                  onClick: () => togglePanel(bottomPanelReference),
                }}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle className='border-l border-default-200' />
        <ResizablePanel
          ref={rightPanelReference}
          defaultSize={20}
          collapsible={true}
          collapsedSize={0}
          minSize={10}
          onCollapse={() => setRightPanelCollapsed(true)}
          onExpand={() => setRightPanelCollapsed(false)}
        >
          <PanelContent
            content={rightContent}
            collapseButton={{
              icon: ChevronRight,
              position: 'left-2 top-2',
              onClick: () => togglePanel(rightPanelReference),
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
};

export default ScenarioLayout;
