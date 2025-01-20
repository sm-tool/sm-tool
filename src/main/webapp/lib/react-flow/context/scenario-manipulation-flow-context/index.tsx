import {
  applyNodeChanges,
  Edge,
  Node,
  NodeChange,
  OnNodesChange,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import React, { useCallback, useContext } from 'react';
import { useThreads } from '@/features/thread/queries.ts';
import { LayoutEngine } from '@/lib/react-flow/services/flow-layout-engine.ts';
import {
  FLOW_UNIT_HEIGHT,
  FLOW_UNIT_WIDTH,
} from '@/lib/react-flow/config/scenario-flow-config.ts';
import { useBranchings } from '@/features/branching/queries.ts';
import { useEvents } from '@/features/event-instance/queries.ts';
import { EventCardProperties } from '@/features/event-instance/components/event-card';
import { ThreadCardProperties } from '@/features/thread/components/thread-card';
import { useLocalStorage } from '@/hooks/use-local-storage.ts';
import { toast } from 'sonner';
import { Thread } from '@/features/thread/types.ts';
import { Branching } from '@/features/branching/types.ts';

interface ThreadsFlowContextType {
  mainFlowReference: React.MutableRefObject<ReactFlowInstance | null>;
  scenarioManipulation: {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    selectedThreads: number[];
    toggleNodeSelection: (nodeId: number) => void;
    clearSelected: () => void;
    isCreatingMerge: boolean;
    setIsCreatingMerge: (value: boolean) => void;
    getMaxEndTime: () => number;
    threadViewMode: 'description' | 'event';
    setThreadViewMode: (value: 'description' | 'event') => void;
    isEditingMergeOnBranching: Branching | null;
    handleSetIsEditingMergeOnBranching: (value: Branching | null) => void;
    selectedThreadsForMerge: number[];
    handleSetSelectedThreadsForMerge: (thread: Thread) => void;
    clearSelectedMergeEdit: () => void;
  };
}

const FlowContext = React.createContext<ThreadsFlowContextType | undefined>(
  undefined,
);

const ScenarioManipulationFlowContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const threads = useThreads();
  const branchings = useBranchings();
  const events = useEvents();
  const mainFlowReference = React.useRef<ReactFlowInstance | null>(null);
  const [nodes, setNodes] = useNodesState<Node<ThreadCardProperties>>([]);
  const [edges, setEdges] = useEdgesState([]);
  const [selectedThreads, setSelectedThreads] = React.useState<number[]>([]);
  const [isCreatingMerge, setIsCreatingMerge] = React.useState<boolean>();
  const [threadViewMode, setThreadViewMode] = useLocalStorage<
    'description' | 'event'
  >('threadViewState', 'description');
  const [isEditingMergeOnBranching, setIsEditingMergeOnBranching] =
    React.useState<Branching | null>(null);
  const [selectedThreadsForMerge, setSelectedThreadsForMerge] = React.useState<
    number[]
  >([]);

  const handleSetSelectedThreadsForMerge = React.useCallback(
    (thread: Thread) => {
      if (!isEditingMergeOnBranching) {
        return [];
      }

      if (isCreatingMerge) {
        clearSelected();
      }

      if (isEditingMergeOnBranching?.time < thread.endTime) {
        toast.warning('Threads after merge are not valid candidates');
        return selectedThreadsForMerge;
      }

      if (
        thread.outgoingBranchingId &&
        thread.outgoingBranchingId !== isEditingMergeOnBranching.id
      ) {
        toast.warning('Already branched thread is not a valid candidate');
        return selectedThreadsForMerge;
      }

      setSelectedThreadsForMerge(previous => {
        const threadExists = previous.includes(thread.id);
        const newSelection = threadExists
          ? previous.filter(id => id !== thread.id)
          : [...previous, thread.id];

        if (newSelection.length === 0) {
          clearSelectedMergeEdit();
        }

        return newSelection;
      });

      return selectedThreadsForMerge;
    },
    [selectedThreadsForMerge, isEditingMergeOnBranching],
  );

  const handleSetIsEditingMergeOnBranching = React.useCallback(
    (branching: Branching) => {
      clearSelected();
      setIsEditingMergeOnBranching(branching);
      setSelectedThreadsForMerge(branching.comingIn);
    },
    [],
  );

  React.useEffect(() => {
    if (!threads?.data || !branchings?.data || !events?.data) return;

    const nodesData: Node[] = threads.data
      .filter(thread => thread.id !== 0)
      .map(thread => ({
        id: `thread-${thread.id}`,
        type: 'thread',
        data: {
          thread: thread,
        },
        draggable: false,
        position: { x: 0, y: 0 },
        width: FLOW_UNIT_WIDTH * (thread.endTime - thread.startTime),
        height: FLOW_UNIT_HEIGHT,
        className: '!z-50',
      }));
    const eventData: Node<EventCardProperties>[] =
      threadViewMode === 'event'
        ? events.data
            .filter(
              event =>
                event.threadId !== 0 &&
                ['NORMAL', 'IDLE', 'START', 'END'].includes(event.eventType),
            )
            .map(event => ({
              id: `event-${event.threadId}-${event.id}`,
              type: 'eventHighlight',
              data: {
                event: event,
              },
              position: { x: event.time, y: 0 },
              className: '!size-fit !z-50',
            }))
        : [];

    const edgesData: Edge[] = branchings.data
      .flatMap(branching => {
        const edges = branching.comingIn.flatMap(sourceId =>
          branching.comingOut.map(targetId => ({
            id: `edge-${sourceId}-${targetId}`,
            source: `thread-${sourceId}`,
            target: `thread-${targetId}`,
            type: 'thread',
            data: {
              branching: branching,
              transfer:
                branching.objectTransfer?.find(t => t.id === targetId)
                  ?.objectIds.length ?? 0,
            },
            style: {
              zIndex: 0,
            },
          })),
        );
        return branching.type === 'FORK' ? edges.reverse() : edges;
      })
      .map((edge, index) => ({
        ...edge,
        style: {
          ...edge.style,
          zIndex: -index,
        },
      }));

    const layoutEngine = new LayoutEngine(
      {
        nodes: nodesData,
        edges: edgesData,
      },
      branchings.data,
      eventData,
    );
    const { nodes: layoutedNodes, edges: layoutedEdges } =
      layoutEngine.applyLayout();
    // @ts-expect-error -- ts wrongly intercepts the type
    setNodes(layoutedNodes);
    // @ts-expect-error -- ts wrongly intercepts the type
    setEdges(layoutedEdges);
  }, [threads?.data, branchings?.data, events?.data, threadViewMode]);

  const toggleNodeSelection = useCallback((threadId: number) => {
    if (isEditingMergeOnBranching) return;
    setSelectedThreads(previous => {
      const updated = previous.includes(threadId)
        ? previous.filter(id => id !== threadId)
        : [...previous, threadId];

      if (updated.length === 0) {
        setIsCreatingMerge(false);
      }

      return updated;
    });
  }, []);

  const clearSelected = React.useCallback(() => {
    setSelectedThreads([]);
    setIsCreatingMerge(false);
  }, []);

  const clearSelectedMergeEdit = React.useCallback(() => {
    setSelectedThreadsForMerge([]);
    setIsEditingMergeOnBranching(null);
  }, []);

  const getMaxEndTime = useCallback(() => {
    return selectedThreads.reduce((accumulator, threadId) => {
      const thread = nodes.find(t => t.id === `thread-${threadId}`)?.data
        ?.thread;
      return Math.max(accumulator, thread?.endTime || 0);
    }, 0);
  }, [selectedThreads, nodes]);

  const value = {
    mainFlowReference,
    scenarioManipulation: {
      nodes,
      edges,
      onNodesChange: useCallback(
        (changes: NodeChange[]) =>
          // @ts-expect-error -- ts wrongly intercepts the type
          setNodes(nds => applyNodeChanges(changes, nds)),
        [],
      ),
      toggleNodeSelection,
      selectedThreads,
      clearSelected,
      isCreatingMerge,
      setIsCreatingMerge,
      getMaxEndTime,
      threadViewMode,
      setThreadViewMode,
      handleSetSelectedThreadsForMerge,
      isEditingMergeOnBranching,
      setIsEditingMergeOnBranching,
      selectedThreadsForMerge,
      clearSelectedMergeEdit,
      handleSetIsEditingMergeOnBranching,
    },
    phaseManipulation: {
      nodes: [],
    },
  };
  // @ts-expect-error -- always an defined
  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};

export const useThreadsFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within FlowProvider');
  }
  return context;
};

export default ScenarioManipulationFlowContext;
