export const hexToRgb = (hexColor: string) => {
  const rgb = Number.parseInt(hexColor.slice(1), 16);
  return {
    r: (rgb >> 16) & 0xff,
    g: (rgb >> 8) & 0xff,
    b: rgb & 0xff,
  };
};
