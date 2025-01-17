import { AppError, ErrorLevel } from '@/lib/errors/errors.ts';

const getPhaseFlowRect = () => {
  const phaseFlowContainer = globalThis.document.querySelector('#phaseFlow');

  if (!phaseFlowContainer) {
    throw new AppError('Phase flow is not initialized', ErrorLevel.ERROR);
  }

  const rect = phaseFlowContainer.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
};

export default getPhaseFlowRect;
