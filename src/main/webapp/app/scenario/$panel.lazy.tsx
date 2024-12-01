import '@xyflow/react/dist/style.css';
import { createLazyFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import ScenarioLayout from '@/components/layout/scenario';
import LazyPanelWithSpinner from '@/components/ui/common/containers/lazy-panel/with-spinner.tsx';
import ScenarioSideBar from '@/components/feature/page/scenario/side-bar';

const PANEL_COMPONENTS = {
  leftContent: {
    description: lazy(
      () => import('../../components/feature/page/scenario-panels/description'),
    ),
    templates: lazy(
      () => import('@/components/feature/page/scenario-panels/templates'),
    ),
    // types: lazy(() => import('@/components/feature/page/scenario/types')),
  },
  rightContent: lazy(
    () => import('@/components/feature/page/scenario/form-tabs'),
  ),
  bottomContent: lazy(
    () => import('@/components/feature/page/scenario/highlight'),
  ),
  mainContent: lazy(
    () => import('@/components/feature/page/scenario/scenarioFlow'),
  ),
};

const ScenarioPage = () => {
  const { panel } = Route.useParams();

  const getPanelContent = () => {
    switch (panel) {
      case 'types': {
        return <></>;
      }
      case 'templates': {
        return (
          <LazyPanelWithSpinner
            component={PANEL_COMPONENTS.leftContent.templates}
          />
        );
      }
      default: {
        return (
          <LazyPanelWithSpinner
            component={PANEL_COMPONENTS.leftContent.description}
          />
        );
      }
    }

    // return (
    //   <LazyPanelWithSpinner
    //     component={PANEL_COMPONENTS.leftContent[panel as PanelType]}
    //   />
    // );
  };

  return (
    <ScenarioLayout
      leftContent={<ScenarioSideBar panelContent={getPanelContent()} />}
      rightContent={
        <LazyPanelWithSpinner component={PANEL_COMPONENTS.rightContent} />
      }
      bottomContent={
        <LazyPanelWithSpinner component={PANEL_COMPONENTS.bottomContent} />
      }
    >
      <LazyPanelWithSpinner component={PANEL_COMPONENTS.mainContent} />
    </ScenarioLayout>
  );
};

export const Route = createLazyFileRoute('/scenario/$panel')({
  component: ScenarioPage,
});
