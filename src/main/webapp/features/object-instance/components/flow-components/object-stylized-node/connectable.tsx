import {
  Handle,
  Node,
  NodeProps,
  Position,
  useConnection,
} from '@xyflow/react';
import React from 'react';
import { ObjectStylized } from '@/features/object-instance/components/object-card';
import { useAssociationType } from '@/features/association-type/queries.ts';
import { getObjectTypeStyle } from '@/features/object-type/components/object-type-styles.ts';
import { cn } from '@nextui-org/theme';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { Alert } from '@/components/ui/shadcn/alert.tsx';
import { useAssociationFlow } from '@/features/association-change/components/association-changes-overview/associaiton-changes-context.tsx';
import { motion } from 'framer-motion';

const AssociationEndCannotAddTooltip = () => (
  <div className='absolute -top-24 inset-x-0 transform z-50 animate-appearance-in h-16'>
    <div className='bg-content1'>
      <Alert className='text-center text-xl' variant='danger'>
        Thread termination and branching events cannot make any changes
      </Alert>
    </div>
  </div>
);

const AssociationTooltipContent = ({
  associationTypeId,
}: {
  associationTypeId: number;
}) => {
  return (
    <div className='absolute -top-16 inset-x-0 transform z-50 animate-appearance-in h-16'>
      <StatusComponent useQuery={useAssociationType(associationTypeId)}>
        {associationType => (
          <div
            className={cn(
              'shadow-lg border border-content1 overflow-hidden text-center p-2 text-xl',
              getObjectTypeStyle(associationType!.secondObjectTypeId).className,
              'rounded-none rounded-b-full animate-bounce',
            )}
          >
            {associationType?.description}
          </div>
        )}
      </StatusComponent>
    </div>
  );
};

const ConnectionMessage = ({ canBeTarget }: { canBeTarget: boolean }) => (
  <div className='bg-content1 absolute mt-2 inset-x-0 animate-appearance-in'>
    <Alert
      className='text-center text-xl'
      variant={canBeTarget ? 'information' : 'danger'}
    >
      {canBeTarget
        ? 'Release to create association'
        : 'Cannot create association with this object'}
    </Alert>
  </div>
);

const ObjectStylizedNodeConnectable = ({
  data,
}: NodeProps<Node<{ objectId: number; disabled: boolean }>>) => {
  const connection = useConnection();
  const [isHovered, setIsHovered] = React.useState(false);
  const { possibleConnections } = useAssociationFlow();

  const isSource = connection.fromNode?.data?.objectId === data.objectId;

  const canBeTarget = React.useMemo(() => {
    if (!connection.inProgress || !connection.fromNode || isSource) {
      return false;
    }
    const connectionKey = `${connection.fromNode.data?.objectId}-${data.objectId}`;

    return possibleConnections.has(connectionKey);
  }, [
    connection.inProgress,
    connection.fromNode,
    isSource,
    possibleConnections,
    data.objectId,
  ]);

  const nodeOpacity = React.useMemo(() => {
    if (!connection.inProgress) return 1;
    if (isSource) return 1;
    if (data.disabled) return 0.3;
    return canBeTarget ? 1 : 0.3;
  }, [connection.inProgress, isSource, canBeTarget]);

  const currentAssociation = React.useMemo(() => {
    if (!connection.inProgress || !connection.fromNode || !canBeTarget)
      return null;

    return possibleConnections.get(
      `${connection.fromNode.data?.objectId}-${data.objectId}`,
    );
  }, [
    connection.inProgress,
    connection.fromNode,
    canBeTarget,
    possibleConnections,
    data.objectId,
  ]);

  const showTooltip =
    connection.inProgress && canBeTarget && currentAssociation;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showTooltip && currentAssociation && !data.disabled && (
        <AssociationTooltipContent associationTypeId={currentAssociation} />
      )}
      {connection.inProgress && isSource && data.disabled && (
        <AssociationEndCannotAddTooltip />
      )}
      <div
        className='!relative drag'
        style={{ opacity: nodeOpacity, transition: 'opacity 0.2s' }}
      >
        <ObjectStylized objectId={data.objectId} />
        {(!connection.inProgress || canBeTarget) && (
          <Handle
            type='target'
            position={Position.Left}
            id='target'
            isConnectableStart={false}
            isConnectable={canBeTarget}
            className='!w-full !h-full !absolute !top-0 !left-0 !rounded-none !translate-x-0
              !translate-y-0 !border-0 !opacity-0'
          />
        )}
        {!connection.inProgress && (
          <Handle
            type='source'
            position={Position.Right}
            id='source'
            className='!w-full !h-full !absolute !top-0 !left-0 !rounded-none !translate-x-0
              !translate-y-0 !border-0 !opacity-0'
          />
        )}
      </div>
      {connection.inProgress && isHovered && !isSource && !data.disabled && (
        <ConnectionMessage canBeTarget={canBeTarget} />
      )}
    </motion.div>
  );
};

export default React.memo(ObjectStylizedNodeConnectable);
