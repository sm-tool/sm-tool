import { hexToRgb } from '@/utils/color/hex-to-rgb.ts';

export const getSlightlyDifferentColor = (hexColor: string) => {
  const { r, g, b } = hexToRgb(hexColor);
  const modifier = 0.9;
  const [newR, newG, newB] = [r, g, b].map(color =>
    Math.min(255, Math.round(color * modifier)),
  );
  return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
};
