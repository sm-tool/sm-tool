import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
} from '@xyflow/react';
import {
  FlowContext,
  useRestrictedViewport,
} from '@/lib/react-flow/hooks/use-sync-flow.ts';
import useDarkMode from '@/hooks/use-dark-mode.tsx';
import React from 'react';
import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';
import ThreadCardNode from '@/features/thread/components/flow-nodes/thread-card-node.tsx';
import ThreadCardEdge from '@/features/thread/components/flow-nodes/thread-card-edge.tsx';
import { usePhases } from '@/features/scenario-phase/queries.ts';
import { FLOW_UNIT_WIDTH } from '@/lib/react-flow/config/scenario-flow-config.ts';
import PhaseCardNode from '@/features/scenario-phase/components/flow-nodes/phase-card-node.tsx';
import { Dialog } from '@/components/ui/shadcn/dialog.tsx';
import { AutoFormDialogContent } from '@/lib/modal-dialog/components/auto-form-dialog.tsx';
import { ThreadForm, threadFormDTO } from '@/features/thread/types.ts';
import ThreadContextMenu, {
  CreateThreadContextMenuType,
} from '@/lib/react-flow/components/create-thread-context-menu';
import { useCreateThread, useThread } from '@/features/thread/queries.ts';
import {
  KinderGardenHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/shadcn/resizable-panel.tsx';
import TimelineCanvas from '@/lib/react-flow/components/timeline-canvas.tsx';
import GlobalThreadCard, {
  GLOBAL_THREAD_HEIGHT,
} from '@/features/thread/components/global-thread-card';
import { useThreadEvents } from '@/features/event-instance/queries.ts';
import EventHighlightNode from '@/features/event-instance/components/flow-nodes/event-highlight-node.tsx';
import TimelineBackground from '@/lib/react-flow/components/timeline-background.tsx';
import { AnimatePresence } from 'framer-motion';
import ThreadsTooltip from '@/lib/react-flow/components/threads-tooltip';
import WizardDialogContent from '@/lib/modal-dialog/components/wizard-dialog.tsx';
import {
  JoinCreateRequest,
  joinCreateRequestDTO,
} from '@/features/branching/join/types.ts';
import { useCreateJoinCreateRequest } from '@/features/branching/join/queries.ts';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form.tsx';
import { Input } from '@/components/ui/shadcn/input.tsx';
import { Textarea } from '@/components/ui/shadcn/text-area.tsx';
import { cn } from '@nextui-org/theme';

const phaseFlowNodeTypes = {
  phase: PhaseCardNode,
  globalThread: GlobalThreadCard,
  globalEvent: EventHighlightNode,
};

const PhaseFlow = () => {
  const { theme, isDark } = useDarkMode();
  const context = React.useContext(FlowContext);
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const phases = usePhases();
  const globalThread = useThread(0);
  const globalThreadEvents = useThreadEvents(0);
  const flowReference = React.useRef<HTMLDivElement>(null);
  const { scenarioManipulation } = useThreadsFlow();

  const { zoom } = useViewport();

  React.useEffect(() => {
    if (!flowReference.current) return;

    const onResize = (entries: ResizeObserverEntry[]) => {
      const flowHeight = entries[0].contentRect.height;
      if (phases.data && globalThread.data && globalThreadEvents.data) {
        const adjustedHeight = (flowHeight - GLOBAL_THREAD_HEIGHT) / zoom;

        const allNodes = phases.data.map(phase => ({
          id: `phase-${phase.id}`,
          type: 'phase',
          position: { x: phase.startTime * FLOW_UNIT_WIDTH, y: 0 },
          height: adjustedHeight,
          width: FLOW_UNIT_WIDTH * (phase.endTime - phase.startTime),
          data: {
            phase: phase,
          },
        }));

        const globalThreadNode = {
          id: 'global-thread',
          type: 'globalThread',
          position: {
            x: globalThread.data.startTime * FLOW_UNIT_WIDTH,
            y: adjustedHeight,
          },
          height: GLOBAL_THREAD_HEIGHT,
          width:
            FLOW_UNIT_WIDTH *
            (globalThread.data.endTime - globalThread.data.startTime + 1),
        };

        const eventNodes = globalThreadEvents.data
          .filter(event => event.eventType === 'GLOBAL')
          .map(event => ({
            id: `event-0-${event.id}`,
            type: 'globalEvent',
            position: {
              x: event.time * FLOW_UNIT_WIDTH,
              y: adjustedHeight + 23 / zoom - 12,
            },
            data: {
              event: event,
            },
            className: cn(
              '!size-fit !z-50',
              scenarioManipulation.threadViewMode === 'description' &&
                '!pointer-events-none',
            ),
          }));

        // @ts-expect-error -- infering on first type
        setNodes([...allNodes, globalThreadNode, ...eventNodes]);
      }
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(flowReference.current);
    return () => resizeObserver.disconnect();
  }, [phases.data, zoom, theme, globalThread.data, globalThreadEvents.data]);

  const onMove = useRestrictedViewport(
    {
      minX: -Infinity,
      minY: 0,
      maxX: 0,
      maxY: 0,
    },
    true,
  );

  return (
    <div ref={flowReference} className='size-full'>
      <AnimatePresence>
        <ReactFlow
          id='phaseFlow'
          proOptions={{ hideAttribution: true }}
          colorMode={theme}
          nodes={nodes}
          className='size-full'
          translateExtent={[
            [0, 0],
            [Infinity, 0],
          ]}
          preventScrolling={false}
          nodeTypes={phaseFlowNodeTypes}
          onMove={onMove}
          onlyRenderVisibleElements
          onInit={flow => {
            context!.timelineFlowReference.current = flow;

            const viewport = flow.getViewport();

            onMove(null, viewport);
          }}
          elevateNodesOnSelect={false}
          nodesDraggable={false}
        >
          <Background
            variant={BackgroundVariant.Dots}
            bgColor={isDark ? '#162233' : '#e9eff4'}
          />
        </ReactFlow>
      </AnimatePresence>
    </div>
  );
};

const scenarioFlowNodeTypes = {
  thread: ThreadCardNode,
  eventHighlight: EventHighlightNode,
};

const scenarioFlowEdgeTypes = {
  thread: ThreadCardEdge,
};

const ScenarioManipulationFLow = () => {
  const { theme } = useDarkMode();
  const { scenarioManipulation } = useThreadsFlow();
  const context = React.useContext(FlowContext);
  const [isThreadDialogOpened, setIsThreadDialogOpened] = React.useState(false);
  const [isMergeDialogOpened, setIsMergeDialogOpened] = React.useState(false);
  const [contextMenu, setContextMenu] =
    React.useState<CreateThreadContextMenuType>();
  const [selectedTime, setSelectedTime] = React.useState<number | undefined>();

  const flowReference = React.useRef<HTMLDivElement>(null);

  const createThread = useCreateThread();
  const createJoinCreateRequest = useCreateJoinCreateRequest();

  const reactFlow = useReactFlow();

  const onMove = useRestrictedViewport(
    {
      minX: -Infinity,
      minY: -Infinity,
      maxX: 0,
      maxY: 0,
    },
    false,
  );

  return (
    <div className='h-full'>
      <Dialog
        open={isThreadDialogOpened}
        onOpenChange={setIsThreadDialogOpened}
      >
        <AutoFormDialogContent<ThreadForm>
          config={{
            title: 'Create new thread',
            type: 'autoForm',
            zodObjectToValidate: threadFormDTO,
            defaultValues: {
              startTime: selectedTime,
            },
            onSubmit: async data => {
              await createThread.mutateAsync(data);
              setIsThreadDialogOpened(false);
            },
          }}
          onClose={() => {
            setIsThreadDialogOpened(false);
            setSelectedTime(undefined);
          }}
        />
      </Dialog>

      <Dialog open={isMergeDialogOpened} onOpenChange={setIsMergeDialogOpened}>
        <WizardDialogContent<JoinCreateRequest>
          config={{
            title: 'Merge threads',
            type: 'wizard',
            defaultValues: {
              joinTime: selectedTime,
              threadIdsToJoin: scenarioManipulation.selectedThreads,
            },
            steps: [
              {
                id: 1,
                title: 'Provide branching data',
                description:
                  'Define a merging operation title that represents the joining event in your workflow. This title should clearly identify the point where multiple threads unite into a single path.',
                fields: ['joinTitle', 'joinDescription'],
                validationSchema: joinCreateRequestDTO.pick({
                  joinTitle: true,
                  joinDescription: true,
                }),
                component: register => (
                  <>
                    <FormItem>
                      <FormLabel>
                        Title <span className='text-primary'> *</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...register('joinTitle')} key={'joinTitle'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...register('joinDescription')}
                          key={'joinDescription'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                ),
              },
              {
                id: 2,
                title: 'Provide merged thread data',
                description:
                  'Provide a name and description for the unified thread that will handle operations after merging. This will define how the combined elements will be processed in subsequent workflow steps.',
                validationSchema: joinCreateRequestDTO,
                fields: ['threadTitle', 'threadDescription'],
                component: register => (
                  <>
                    <FormItem>
                      <FormLabel>
                        Title <span className='text-primary'> *</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...register('threadTitle')}
                          key={'threadTitle'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...register('threadDescription')}
                          key={'threadDescription'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                ),
              },
            ],
            onSubmit: async data => {
              await createJoinCreateRequest.mutateAsync(data);
              setIsMergeDialogOpened(false);
              scenarioManipulation.clearSelected();
            },
          }}
          onClose={() => {
            setIsMergeDialogOpened(false);
            setSelectedTime(undefined);
            scenarioManipulation.setIsCreatingMerge(false);
          }}
        />
      </Dialog>
      <ReactFlow
        elevateEdgesOnSelect={false}
        elevateNodesOnSelect={false}
        nodesDraggable={false}
        ref={flowReference}
        nodes={scenarioManipulation.nodes}
        edges={scenarioManipulation.edges}
        onNodesChange={scenarioManipulation.onNodesChange}
        proOptions={{ hideAttribution: true }}
        onMove={onMove}
        onlyRenderVisibleElements
        colorMode={theme}
        translateExtent={[
          [0, 0],
          [Infinity, Infinity],
        ]}
        onInit={flow => {
          context!.mainFlowReference.current = flow;
        }}
        preventScrolling={false}
        nodeTypes={scenarioFlowNodeTypes}
        edgeTypes={scenarioFlowEdgeTypes}
        onContextMenu={event => {
          const target = event.target as HTMLElement;
          if (target.classList.contains('react-flow__pane')) {
            event.preventDefault();
            const position = reactFlow.screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            });
            const position2 = reactFlow.flowToScreenPosition({
              x: position.x,
              y: position.y,
            });
            setContextMenu({
              position: position2,
              time: Math.floor(position.x / FLOW_UNIT_WIDTH),
            });
          }
        }}
      >
        {contextMenu && (
          <ThreadContextMenu
            contextMenu={contextMenu}
            onOpenDialog={(time: number) => {
              setSelectedTime(time);
              if (scenarioManipulation.isCreatingMerge) {
                setIsMergeDialogOpened(true);
              } else {
                setIsThreadDialogOpened(true);
              }
            }}
            onClose={() => setContextMenu(undefined)}
          />
        )}
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable />
        <TimelineBackground />
        <ThreadsTooltip />
      </ReactFlow>
    </div>
  );
};

const ScenarioFlow = () => {
  const mainFlowReference = React.useRef<ReactFlowInstance>();
  const timelineFlowReference = React.useRef<ReactFlowInstance>();

  return (
    <div
      // @ts-expect-error -- ciicho tam
      style={{ '--thread-height': `${GLOBAL_THREAD_HEIGHT}px` }}
      className='flex flex-col h-[calc(100%-var(--thread-height))]'
    >
      <FlowContext.Provider
        value={{ mainFlowReference, timelineFlowReference }}
      >
        <ResizablePanelGroup
          direction='vertical'
          className='size-full'
          autoSaveId='phase'
        >
          <ReactFlowProvider>
            <ResizablePanel defaultSize={10}>
              <PhaseFlow />
            </ResizablePanel>
            <KinderGardenHandle>
              <TimelineCanvas />
            </KinderGardenHandle>
          </ReactFlowProvider>
          <ResizablePanel defaultSize={90}>
            <ReactFlowProvider>
              <ScenarioManipulationFLow />
            </ReactFlowProvider>
          </ResizablePanel>
        </ResizablePanelGroup>
      </FlowContext.Provider>
    </div>
  );
};

export default ScenarioFlow;
