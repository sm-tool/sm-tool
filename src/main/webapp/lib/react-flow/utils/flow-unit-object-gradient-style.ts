import { getContrastColor } from '@/utils/color/get-contrast-color.ts';
import { FLOW_UNIT_WIDTH } from '@/lib/react-flow/config/scenario-flow-config.ts';

export const getflowUnitObjectGradientStyle = (
  color: string,
  overrides = {},
) => ({
  backgroundColor: color,
  color: getContrastColor(color),
  backgroundImage: `repeating-linear-gradient(
   90deg,
   ${getContrastColor(color)}13 0px,
   ${getContrastColor(color)}13 2px,
   transparent 2px,
   transparent ${FLOW_UNIT_WIDTH}px
 )`,
  backgroundSize: `${FLOW_UNIT_WIDTH}px 100%`,
  backgroundPosition: '-2px 0',
  ...overrides,
});
