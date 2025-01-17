import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { memo } from 'react';
import ThreadCard, {
  ThreadCardProperties,
} from '@/features/thread/components/thread-card';

const ThreadCardNode = ({ data }: NodeProps<Node<ThreadCardProperties>>) => (
  <>
    <Handle
      type='target'
      position={Position.Left}
      id='target'
      className='invisible'
      style={{ left: '5px' }}
    />
    <ThreadCard thread={data.thread} />
    <Handle
      type='source'
      position={Position.Right}
      id='source'
      className='invisible'
      style={{ right: '5px' }}
    />
  </>
);

export default memo(ThreadCardNode);
