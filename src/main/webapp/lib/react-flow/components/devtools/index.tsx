import {
  type Dispatch,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
  useState,
} from 'react';
import { Panel } from '@xyflow/react';
import NodeInspector from '@/lib/react-flow/components/devtools/tools/node-inspector.tsx';
import ViewportLogger from '@/lib/react-flow/components/devtools/tools/viewport-logger.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { cn } from '@nextui-org/theme';

export default function DevelopmentTools() {
  const [nodeInspectorActive, setNodeInspectorActive] = useState(false);
  const [viewportLoggerActive, setViewportLoggerActive] = useState(true);

  return (
    <div className='react-flow__devtools'>
      <Panel
        position='top-right'
        className='divide-x-1 border-2 border-secondary-400 divide-secondary-400'
      >
        <DevToolButton
          setActive={setNodeInspectorActive}
          active={nodeInspectorActive}
          title='Toggle Node Inspector'
        >
          Node Inspector
        </DevToolButton>
        <DevToolButton
          setActive={setViewportLoggerActive}
          active={viewportLoggerActive}
          title='Toggle Viewport Logger'
        >
          Viewport Logger
        </DevToolButton>
      </Panel>
      {nodeInspectorActive && <NodeInspector />}
      {viewportLoggerActive && <ViewportLogger />}
    </div>
  );
}

// eslint-disable-next-line -- aint my lib
function DevToolButton({
  active,
  setActive,
  children,
  ...rest
}: {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant='secondary'
      onClick={() => setActive(a => !a)}
      className={cn(active ? '' : 'opacity-20', 'rounded-none')}
      {...rest}
    >
      {children}
    </Button>
  );
}
