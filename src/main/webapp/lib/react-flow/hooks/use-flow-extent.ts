import { CoordinateExtent, Dimensions, Node } from '@xyflow/react';
import React from 'react';

interface ExtentConfig {
  padding?: number;
  defaultNodeWidth?: number;
  defaultNodeHeight?: number;
  dimensions: Dimensions;
}

export const useFlowExtent = (
  nodes: Node[],
  {
    padding = 500,
    defaultNodeWidth = 400,
    defaultNodeHeight = 300,
    dimensions = { width: 0, height: 0 },
  }: ExtentConfig,
): CoordinateExtent => {
  return React.useMemo<CoordinateExtent>(() => {
    if (!nodes?.length || !dimensions.width || !dimensions.height) {
      return [
        [-2000, -2000],
        [2000, 2000],
      ];
    }

    const center = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    };

    const absoluteBounds = nodes.reduce(
      (accumulator, node) => {
        if (!node.position) return accumulator;
        const width = node.width ?? defaultNodeWidth;
        const height = node.height ?? defaultNodeHeight;
        return {
          minX: Math.min(accumulator.minX, node.position.x - width / 2),
          minY: Math.min(accumulator.minY, node.position.y - height / 2),
          maxX: Math.max(accumulator.maxX, node.position.x + width / 2),
          maxY: Math.max(accumulator.maxY, node.position.y + height / 2),
        };
      },
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
    );

    const contentWidth = absoluteBounds.maxX - absoluteBounds.minX;
    const contentHeight = absoluteBounds.maxY - absoluteBounds.minY;

    const offsetX = center.x - (contentWidth / 2 + absoluteBounds.minX);
    const offsetY = center.y - (contentHeight / 2 + absoluteBounds.minY);

    return [
      [
        absoluteBounds.minX + offsetX - padding,
        absoluteBounds.minY + offsetY - padding,
      ],
      [
        absoluteBounds.maxX + offsetX + padding,
        absoluteBounds.maxY + offsetY + padding,
      ],
    ];
  }, [nodes, padding, defaultNodeWidth, defaultNodeHeight, dimensions]);
};
