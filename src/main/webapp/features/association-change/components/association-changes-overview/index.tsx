import { Background, MarkerType, ReactFlow } from '@xyflow/react';
import useDarkMode from '@/hooks/use-dark-mode.tsx';
import AssociationChangeEdge from '@/features/association-change/components/flow-components/association-change-edge';
import ObjectStylizedNodeConnectable from '@/features/object-instance/components/flow-components/object-stylized-node/connectable.tsx';
import CustomConnectionLine from '@/features/object-instance/components/flow-components/object-stylized-node/connection-line.tsx';
import AssociationUnChangeEdge from '@/features/association-change/components/flow-components/association-un-change-edge';
import {
  AssociationFlowProvider,
  useAssociationFlow,
} from '@/features/association-change/components/association-changes-overview/associaiton-changes-context.tsx';
import FlowObjectsToggleablePanel from '@/features/association-change/components/association-changes-overview/components/flow-objects-toggleabe-panel.tsx';

const nodeTypes = {
  objectStylized: ObjectStylizedNodeConnectable,
};

const edgeTypes = {
  associationStylized: AssociationChangeEdge,
  associationStylizedUnchaned: AssociationUnChangeEdge,
};

export const AssociationChangesOverview = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => (
  <AssociationFlowProvider disabled={disabled}>
    <AssociationChangesOverviewContent disabled={disabled} />
  </AssociationFlowProvider>
);

const AssociationChangesOverviewContent = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const { theme } = useDarkMode();
  const { nodes, edges, onConnect } = useAssociationFlow();

  return (
    <div className='size-full flex items-center justify-center flex-row'>
      <div className='flex-1 size-full'>
        <ReactFlow
          key={'association'}
          nodes={nodes}
          edges={edges}
          proOptions={{ hideAttribution: true }}
          colorMode={theme}
          onConnect={disabled ? undefined : onConnect}
          defaultEdgeOptions={{
            type: 'floating',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 40,
              height: 40,
              color: '#b1b1b7',
            },
          }}
          connectionLineComponent={CustomConnectionLine}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Background className='!bg-content2' gap={10} id={'associaiton'} />
          <FlowObjectsToggleablePanel />
        </ReactFlow>
      </div>
    </div>
  );
};

export default AssociationChangesOverview;
