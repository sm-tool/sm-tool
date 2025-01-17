import { hexToRgb } from '@/utils/color/hex-to-rgb.ts';

export const getContrastColor = (hexColor: string) => {
  const { r, g, b } = hexToRgb(hexColor);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 140 ? '#ffffff' : '#000000';
};
