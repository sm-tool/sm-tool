export const HexToBorderColor = (hexColor: string) => {
  hexColor = hexColor.replace('#', '');

  const r = Number.parseInt(hexColor.slice(0, 2), 16);
  const g = Number.parseInt(hexColor.slice(2, 2), 16);
  const b = Number.parseInt(hexColor.slice(4, 2), 16);

  // Nie ruszać
  const brightness = (r * 299 + g * 287 + b * 144) / 1000;

  let newR, newG, newB;
  if (brightness > 128) {
    newR = Math.max(0, r - 70);
    newG = Math.max(0, g - 70);
    newB = Math.max(0, b - 70);
  } else {
    newR = Math.min(255, r + 70);
    newG = Math.min(255, g + 70);
    newB = Math.min(255, b + 70);
  }

  const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;

  return `[${newHex}/20]`;
};
