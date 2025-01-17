import { lazy } from 'react';
import { useSearch } from '@tanstack/react-router';
import LazyPanelWithSpinner from '@/components/ui/common/lazy-panel/with-spinner.tsx';
import {
  ResizableHandle,
  ResizablePanel,
} from '@/components/ui/shadcn/resizable-panel.tsx';
import useScenarioSearchParamNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';

const PANEL_COMPONENTS = {
  description: lazy(
    () =>
      import(
        '@/app/scenario/$scenarioId/_layout/~components/left-content/description'
      ),
  ),
  catalogue: lazy(
    () =>
      import(
        '@/app/scenario/$scenarioId/_layout/~components/left-content/catalogue'
      ),
  ),
  threads: lazy(
    () =>
      import(
        '@/app/scenario/$scenarioId/_layout/~components/left-content/threads-section'
      ),
  ),
  objects: lazy(
    () =>
      import(
        '@/app/scenario/$scenarioId/_layout/~components/left-content/objects'
      ),
  ),
};

const PanelContent = () => {
  const search = useSearch({
    strict: false,
  });

  if (!search?.left) return null;
  const [panel] = search.left.split(':');

  switch (panel) {
    case 'catalogue': {
      return <LazyPanelWithSpinner component={PANEL_COMPONENTS.catalogue} />;
    }
    case 'threads': {
      return <LazyPanelWithSpinner component={PANEL_COMPONENTS.threads} />;
    }
    case 'description': {
      return <LazyPanelWithSpinner component={PANEL_COMPONENTS.description} />;
    }
    case 'objects': {
      return <LazyPanelWithSpinner component={PANEL_COMPONENTS.objects} />;
    }
    default: {
      return null;
    }
  }
};

const ScenarioSidePanel = () => {
  const search = useSearch({
    // @ts-expect-error -- ts wrongly intercepts the type
    from: '/scenario/$scenarioId',
    strict: false,
  });

  const { clear } = useScenarioSearchParamNavigation();
  if (!search?.left) return null;

  return (
    <>
      <ResizablePanel
        defaultSize={30}
        minSize={20}
        collapsible
        collapsedSize={0}
        onCollapse={() => clear()}
      >
        <PanelContent />
      </ResizablePanel>
      <ResizableHandle withHandle className='border-r-4 border-default-200' />
    </>
  );
};

export default ScenarioSidePanel;
