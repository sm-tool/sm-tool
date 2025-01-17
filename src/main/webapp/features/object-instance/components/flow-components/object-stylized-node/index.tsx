import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { ObjectStylized } from '@/features/object-instance/components/object-card';
import React from 'react';
import { motion } from 'framer-motion';

const ObjectStylizedNode = ({
  data,
  width,
  height,
}: NodeProps<Node<{ objectId: number }>>) => (
  <motion.div layout>
    <Handle
      type='target'
      position={Position.Left}
      id='target'
      style={{ left: width ?? 0 / 2, top: height ?? 0 / 2 }}
    />
    <ObjectStylized objectId={data.objectId} />
    <Handle
      type='source'
      position={Position.Right}
      id='source'
      style={{ left: width ?? 0 / 2, top: height ?? 0 / 2 }}
    />
  </motion.div>
);

export default React.memo(ObjectStylizedNode);
