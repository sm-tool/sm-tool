import { router } from '@/lib/core.tsx';
import { AppError, ErrorLevel } from '@/lib/errors/errors.ts';

export const getScenarioIdFromPath = () => {
  const pathname = router.state.location.pathname;
  const segments = pathname.split('/');

  const scenarioIndex = segments.indexOf('scenario');
  if (scenarioIndex === -1 || !segments[scenarioIndex + 1]) {
    throw new AppError(
      'No active scenario ID found in URL',
      ErrorLevel.CRITICAL,
    );
  }

  const scenarioId = Number(segments[scenarioIndex + 1]);
  if (Number.isNaN(scenarioId)) {
    throw new AppError('Invalid scenario ID format', ErrorLevel.CRITICAL);
  }

  return scenarioId;
};

export const hasScenarioInPath = () => {
  const pathname = router.state.location.pathname;
  return pathname.split('/').includes('scenario');
};
