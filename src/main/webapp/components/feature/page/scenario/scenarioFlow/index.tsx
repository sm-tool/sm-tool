import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
} from '@xyflow/react';
import AttributeNode from '@/components/feature/entity/attriubute/attribute-node';
import ObjectNode from '@/components/feature/entity/object/object-node';
import { useContext, useRef } from 'react';
import {
  FlowContext,
  useRestrictedViewport,
} from '@/components/feature/page/scenario/scenarioFlow/hooks/use-sync-flow.ts';
import useDarkMode from '@/hooks/use-dark-mode';
import PhaseNode from '@/components/feature/entity/phase/phase-node';
import { QdsPhase } from '@/features/phase/entity.ts';
import createEventNode from '@/components/feature/entity/event/create-event-node.ts';
import EventDescriptionNode from '@/components/feature/entity/event/event-description-node';
import EventActionsNode from '@/components/feature/entity/event/event-actions-node';

const PhaseFlow = () => {
  const { theme } = useDarkMode();
  const context = useContext(FlowContext);

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
    <div className='h-[10%]'>
      <ReactFlow
        id='phaseFlow'
        proOptions={{ hideAttribution: true }}
        colorMode={theme}
        className='size-full'
        translateExtent={[
          [0, 0],
          [Infinity, 0],
        ]}
        zoomOnScroll={false} // TODO: Renable
        onMove={onMove}
        onlyRenderVisibleElements
        nodes={[
          {
            id: '1',
            type: 'phase',
            position: { x: 0, y: 0 },
            data: {
              id: 1,
              title: 'Kolejna stacja',
              startTime: 0,
              endTime: 1600,
              description: 'Rozpoczęcie akcji ratowniczych',
            } as QdsPhase,
          },
          {
            id: '2',
            type: 'phase',
            position: { x: 1600, y: 0 },
            data: {
              id: 1,
              title: 'Opozycji',
              startTime: 1600,
              endTime: 3200,
              description: 'Rozpoczęcie akcji ratowniczych',
            } as QdsPhase,
          },
          {
            id: '3',
            type: 'phase',
            position: { x: 3200, y: 0 },
            data: {
              id: 1,
              title: 'dewastacja',
              startTime: 3200,
              endTime: 4800,
              description: 'Rozpoczęcie akcji ratowniczych',
            } as QdsPhase,
          },
        ]}
        nodeTypes={{
          phase: PhaseNode,
        }}
        onInit={flow => {
          // @ts-expect-error -- ts has problem with recurrent types
          context!.timelineFlowReference.current = flow;
        }}
      >
        <Background id='top' />
      </ReactFlow>
    </div>
  );
};

const ScenarioManipulationFLow = () => {
  const { theme } = useDarkMode();
  const context = useContext(FlowContext);

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
    <div className='h-[90%]'>
      <ReactFlow
        className='size-full'
        proOptions={{ hideAttribution: true }}
        onMove={onMove}
        onlyRenderVisibleElements
        colorMode={theme}
        translateExtent={[
          [0, 0],
          [Infinity, Infinity],
        ]}
        zoomOnScroll={false} // TODO: Reanable
        nodes={createEventNode({
          qdsEvent: {
            id: '0',
            deltaTime: 0,
            type: 'NORMAL',
            title: 'Przybycie na miejsce pożaru',
            threadId: 0,
            objectChanges: [],
            description:
              'Drużyna strażacka 1 i 2 przybywa na miejsce pożaru. Strażacy opuszczają pojazd. Rozładowują i rozstawiają sprzęt. Rowzijają wężę, przygotowują pompy, rozstawiają drabiny. Oceniają sytuację, analizują pożar, wiatr i zagrożenia',
            associationChanges: [],
            branchingId: 0,
          },
          threadYIndex: 0,
        })}
        nodeTypes={{
          attribute: AttributeNode,
          object: ObjectNode,
          eventNodeDescription: EventDescriptionNode,
          eventNodeActions: EventActionsNode,
        }}
        onInit={flow => {
          context!.mainFlowReference.current = flow;
        }}
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Background variant={BackgroundVariant.Dots} id={'bottom'} />
        {/*<DevelopmentTools />*/}
      </ReactFlow>
    </div>
  );
};

const ScenarioFlow = () => {
  const mainFlowReference = useRef<ReactFlowInstance>();
  const timelineFlowReference = useRef<ReactFlowInstance>();

  return (
    <div className='flex flex-col size-full gap-4'>
      <FlowContext.Provider
        value={{ mainFlowReference, timelineFlowReference }}
      >
        <ReactFlowProvider>
          <PhaseFlow />
        </ReactFlowProvider>
        <ReactFlowProvider>
          <ScenarioManipulationFLow />
        </ReactFlowProvider>
      </FlowContext.Provider>
    </div>
  );
};

export default ScenarioFlow;
