import useDarkMode from '@/hooks/use-dark-mode.tsx';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';
import { getflowUnitObjectGradientStyle } from '@/lib/react-flow/utils/flow-unit-object-gradient-style.ts';
import { useViewport } from '@xyflow/react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';

export const GLOBAL_THREAD_HEIGHT = 48;

const GlobalThreadCard = () => {
  const { isDark } = useDarkMode();
  const { x: viewportX, zoom } = useViewport();
  const { navigateWithParameters } = useScenarioCommonNavigation();

  return (
    <Card
      onClick={() => navigateWithParameters(`/events/0`)}
      className={cn(
        `w-full flex flex-col !bg-content1 overflow-hidden items-center text-center
        !rounded-none relative`,
      )}
      style={getflowUnitObjectGradientStyle(isDark ? '#0f172a' : '#FFFFFF', {
        height: GLOBAL_THREAD_HEIGHT / zoom,
      })}
    >
      <span
        className='absolute text-default-400 uppercase font-bold tracking-widest text-sm
          whitespace-nowrap text-ellipsis overflow-hidden max-w-full -z-50 bottom-1'
        style={{
          left: Math.max(8, -viewportX + 8),
        }}
      >
        Global Thread
      </span>
    </Card>
  );
};

export default GlobalThreadCard;
