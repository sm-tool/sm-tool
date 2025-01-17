import {
  CoordinateExtent,
  Edge,
  Handle,
  MarkerType,
  Node,
  NodeProps,
  Position,
  ReactFlow,
} from '@xyflow/react';
import React from 'react';
import { useBranchingIncomingOutgoingThreadsLOCAL } from '@/features/branching/queries.ts';
import { Thread } from '@/features/thread/types.ts';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import ErrorComponent from '@/components/ui/common/data-load-states/error-component';
import { useThread } from '@/features/thread/queries.ts';
import { Label } from '@/components/ui/shadcn/label.tsx';
import UseScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { useParams } from '@tanstack/react-router';
import { cn } from '@nextui-org/theme';

const calculatePositions = (
  count: number,
  min: number = 0,
  max: number = 100,
): number[] => {
  if (count === 0) return [];
  if (count === 1) return [(max + min) / 2];

  const range = max - min;
  const spacing = range / (count - 1);
  return Array.from({ length: count }, (_, index) => min + index * spacing);
};

const TextNode = ({ data }: NodeProps<Node<{ threadId: number }>>) => {
  const thread = useThread(data.threadId);
  const { navigateWithParameters } = UseScenarioCommonNavigation();
  const { threadId } = useParams({
    strict: false,
  });

  if (thread.isLoading) {
    return <Skeleton className='h-[14px] w-[80px] !rounded-none' />;
  }

  return (
    <div
      className='group w-[120px] flex items-center justify-center'
      onClick={() => navigateWithParameters(`events/${data.threadId}`)}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='opacity-0 pointer-events-none'
        isConnectable={false}
      />
      <Label
        variant='uppercased'
        weight='semibold'
        size='xs'
        className={cn(
          `group-hover:text-primary-400 group-hover:cursor-pointer whitespace-normal
          break-words text-center overflow-hidden text-[16px]`,
          Number(threadId) == data.threadId &&
            '!text-primary-400 !cursor-default',
        )}
        title={thread.data?.title}
      >
        {thread.data?.title}
      </Label>
      <Handle
        type='source'
        position={Position.Right}
        className='opacity-0 pointer-events-none'
        isConnectable={false}
      />
    </div>
  );
};
const VIEWPORT_HEIGHT = 250;

const nodeTypes = {
  textNode: TextNode,
};

const NavigationFlow = ({ thread }: { thread: Thread }) => {
  const { incomingBranchingId, outgoingBranchingId } = thread;

  const results = useBranchingIncomingOutgoingThreadsLOCAL(
    incomingBranchingId,
    outgoingBranchingId,
  );

  const [incomingIds, outgoingIds] = React.useMemo(() => {
    const incoming = results[0]?.data?.incomingIds ?? [];
    const outgoing = results[1]?.data?.outgoingIds ?? [];
    return [incoming, outgoing];
  }, [results]);

  const nodes = React.useMemo(() => {
    const nodesArray = [];
    const incomingPositions = calculatePositions(incomingIds.length);
    const outgoingPositions = calculatePositions(outgoingIds.length);

    const hasIncoming = incomingBranchingId !== null;
    const hasOutgoing = outgoingBranchingId !== null;

    const centerX = hasIncoming && hasOutgoing ? 200 : hasIncoming ? 300 : 0;

    nodesArray.push({
      id: 'center',
      position: { x: centerX, y: 200 },
      data: { threadId: thread.id },
      type: 'textNode',
    });

    if (hasIncoming) {
      for (const [index, id] of incomingIds.entries()) {
        nodesArray.push({
          id: `in-${id}`,
          position: { x: 0, y: incomingPositions[index] * 3 + 100 },
          data: { threadId: id },
          type: 'textNode',
        });
      }
    }

    if (hasOutgoing) {
      const outgoingX = hasIncoming ? 400 : 300;
      for (const [index, id] of outgoingIds.entries()) {
        nodesArray.push({
          id: `out-${id}`,
          position: { x: outgoingX, y: outgoingPositions[index] * 3 + 100 },
          data: { threadId: id },
          type: 'textNode',
        });
      }
    }

    return nodesArray;
  }, [incomingIds, outgoingIds, incomingBranchingId, outgoingBranchingId]);

  const edges = React.useMemo(() => {
    const edgesArray = [];

    for (const id of incomingIds) {
      edgesArray.push({
        id: `edge-in-${id}`,
        source: `in-${id}`,
        target: 'center',
        selectable: false,
        className: '!cursor-none',
        reconnectable: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      } as Edge);
    }

    for (const id of outgoingIds) {
      edgesArray.push({
        id: `edge-out-${id}`,
        source: 'center',
        target: `out-${id}`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      });
    }

    return edgesArray;
  }, [incomingIds, outgoingIds]);

  const NODE_WIDTH = 80;
  const NODE_HEIGHT = 40;
  const PADDING = 100;

  const translateExtent = React.useMemo<CoordinateExtent>(
    () =>
      nodes.reduce(
        ([[left, top], [right, bottom]], { position }) => [
          [
            Math.min(
              left,
              (position?.x ?? Infinity) - NODE_WIDTH / 2 - PADDING,
            ),
            Math.min(
              top,
              (position?.y ?? Infinity) - NODE_HEIGHT / 2 - PADDING,
            ),
          ],
          [
            Math.max(
              right,
              (position?.x ?? -Infinity) + NODE_WIDTH / 2 + PADDING,
            ),
            Math.max(
              bottom,
              (position?.y ?? -Infinity) + NODE_HEIGHT / 2 + PADDING,
            ),
          ],
        ],
        [
          [Infinity, Infinity],
          [-Infinity, -Infinity],
        ],
      ),
    [nodes],
  );

  if (results.some(result => result.isLoading)) {
    return <Skeleton className={`h-[${VIEWPORT_HEIGHT}px] w-full`} />;
  }

  if (results.some(result => result.isError)) {
    return (
      <ErrorComponent error={results.find(r => r.isError)?.error?.message} />
    );
  }

  return (
    <div
      style={{ height: `${VIEWPORT_HEIGHT}px` }}
      className='w-full @container py-2'
    >
      <ReactFlow
        key={thread.id}
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{
          padding: 2,
          minZoom: 0.5,
          maxZoom: 4,
          includeHiddenNodes: false,
        }}
        nodeTypes={nodeTypes}
        className='size-full'
        proOptions={{ hideAttribution: true }}
        onlyRenderVisibleElements
        panOnScroll={false}
        zoomOnDoubleClick={false}
        nodesConnectable={false}
        connectOnClick={false}
        elementsSelectable={true}
        nodesDraggable={false}
        preventScrolling={true}
        translateExtent={translateExtent}
      />
    </div>
  );
};

export default NavigationFlow;
