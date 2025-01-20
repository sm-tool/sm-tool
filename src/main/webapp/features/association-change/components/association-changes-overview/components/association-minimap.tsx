import { MiniMapNodeProps, useReactFlow } from '@xyflow/react';
import { useObjectInstance } from '@/features/object-instance/queries.ts';
import { useColors } from '@/lib/theme/use-colors.ts';
import React from 'react';
import { getObjectTypeStyle } from '@/features/object-type/components/object-type-styles.ts';

const AssociationMinimapNode = ({
  x,
  y,
  width,
  height,
  id,
}: MiniMapNodeProps) => {
  const { getNode } = useReactFlow();
  const node = getNode(id);
  const colors = useColors();

  const { data: objectInstance, isSuccess: instanceLoaded } = useObjectInstance(
    node?.data.objectId as number,
  );

  const nodeColor = React.useMemo(() => {
    if (!instanceLoaded) return colors.content3;
    return getObjectTypeStyle(objectInstance?.objectTypeId).color;
  }, [instanceLoaded, colors]);

  return (
    <rect x={x} y={y} rx={4} width={width} height={height} fill={nodeColor} />
  );
};

export default React.memo(AssociationMinimapNode);
