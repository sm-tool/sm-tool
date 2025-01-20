import { Node } from '@xyflow/react';

interface Point {
  x: number;
  y: number;
}

export const calculateFlowCenter = (nodes: Node[]): Point => {
  if (!nodes?.length) {
    return { x: 0, y: 0 };
  }

  const sum = nodes.reduce(
    (accumulator, node) => {
      if (!node.position) return accumulator;
      return {
        x: accumulator.x + node.position.x,
        y: accumulator.y + node.position.y,
      };
    },
    { x: 0, y: 0 },
  );

  return {
    x: sum.x / nodes.length,
    y: sum.y / nodes.length,
  };
};
