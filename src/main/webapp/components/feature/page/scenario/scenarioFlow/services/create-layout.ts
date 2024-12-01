import {
  LayoutConfig,
  LayoutData,
  LayoutEngine,
} from '@/components/feature/page/scenario/scenarioFlow/services/flow-layout-engine.ts';

const createLayout = (layoutData: LayoutData, config: LayoutConfig) => {
  const layoutEngine = new LayoutEngine(layoutData, config);
  return layoutEngine.applyLayout();
};

export default createLayout;
