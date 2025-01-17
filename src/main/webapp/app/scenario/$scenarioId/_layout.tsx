import LoadingScreen from '@/app/scenario/$scenarioId/_layout/~components/loading-screen';
import { usePhases } from '@/features/scenario-phase/queries.ts';
import { useThreads } from '@/features/thread/queries.ts';
import { useScenario } from '@/features/scenario/queries.ts';
import { useObjectInstances } from '@/features/object-instance/queries.ts';
import { useBranchings } from '@/features/branching/queries.ts';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/shadcn/resizable-panel.tsx';
import ScenarioTopTooltip from '@/app/scenario/$scenarioId/_layout/~components/top-tooltip';
import ScenarioManipulationFlowContext from '@/lib/react-flow/context/scenario-manipulation-flow-context';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';
import ScenarioSidePanel from '@/app/scenario/$scenarioId/_layout/~components/side-panel';
import ScenarioSideBar from '@/app/scenario/$scenarioId/_layout/~components/side-bar';

const ScenarioPage = () => {
  const parameters = useParams({
    strict: false,
  });

  return (
    <section className='flex h-screen flex-col'>
      <LoadingScreen
        queries={[
          () => usePhases(),
          () => useThreads(),
          () => useScenario(Number(parameters.scenarioId)),
          () => useObjectInstances(),
          () => useBranchings(),
        ]}
      >
        <div className='flex overflow-hidden'>
          <ScenarioSideBar />
          <ResizablePanelGroup direction='horizontal' autoSaveId='sidebar'>
            <ScenarioSidePanel />
            <ResizablePanel defaultSize={100} order={2}>
              <ScenarioTopTooltip />
              <ScenarioManipulationFlowContext>
                <DialogWrapper>
                  <Outlet />
                </DialogWrapper>
              </ScenarioManipulationFlowContext>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </LoadingScreen>
    </section>
  );
};

export const Route = createFileRoute('/scenario/$scenarioId/_layout')({
  component: ScenarioPage,
});
