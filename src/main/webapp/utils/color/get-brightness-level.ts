import { hexToRgb } from '@/utils/color/hex-to-rgb.ts';

const getBrightnessLevel = (color: string) => {
  const { r, g, b } = hexToRgb(color);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

export default getBrightnessLevel;
