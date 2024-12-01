import { MarkerType } from '@xyflow/react';

export const getAssociationEdge = (
  variant: 'create' | 'delete',
  label: string,
) => {
  const baseStyles = {
    animated: true,
    type: 'smoothstep' as const,
    label: label,
  };

  if (variant === 'create') {
    return {
      ...baseStyles,
      markerEnd: {
        type: MarkerType.Arrow,
        color: '#12a150',
      },
      style: {
        stroke: '#12a150',
        strokeWidth: 2,
      },
      labelStyle: {
        fill: '#12a150',
        fontWeight: 700,
      },
    };
  }

  return {
    ...baseStyles,
    style: {
      stroke: '#c20e4d',
      strokeWidth: 2,
    },
    labelStyle: {
      fill: '#c20e4d',
      fontWeight: 700,
      textDecoration: 'line-through',
    },
  };
};

export default {
  getDefaults: getAssociationEdge,
};
