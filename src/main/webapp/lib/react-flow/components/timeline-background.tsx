import { Background, BackgroundVariant, useStore } from '@xyflow/react';
import useDarkMode from '@/hooks/use-dark-mode.tsx';
import { useThreadsFlow } from '@/lib/react-flow/context/scenario-manipulation-flow-context';
import { FLOW_UNIT_WIDTH } from '@/lib/react-flow/config/scenario-flow-config.ts';

const TimelineBackground = () => {
  const { isDark } = useDarkMode();

  const { transform } = useStore(state => ({
    transform: state.transform,
  }));

  const { scenarioManipulation } = useThreadsFlow();

  const transformedX = scenarioManipulation.isCreatingMerge
    ? scenarioManipulation.getMaxEndTime() * FLOW_UNIT_WIDTH * transform[2] +
      transform[0]
    : 0;

  return (
    <div className='!relative !w-full !h-full'>
      <Background
        variant={BackgroundVariant.Dots}
        bgColor={isDark ? '#162233' : '#e9eff4'}
      />
      {scenarioManipulation.isCreatingMerge && (
        <>
          <div
            className='!absolute !top-0 !left-0 !bottom-0 !bg-red-500/10'
            style={{ width: `${transformedX}px` }}
          />
          <div
            className='!absolute !top-0 !bottom-0 !right-0 !bg-green-500/10'
            style={{ left: `${transformedX}px` }}
          />
        </>
      )}
    </div>
  );
};

export default TimelineBackground;
