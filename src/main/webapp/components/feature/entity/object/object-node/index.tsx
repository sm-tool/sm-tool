import EntityObject, {
  EntityObjectProperties,
} from '@/components/feature/entity/object';
import { Node, NodeProps } from '@xyflow/react';
import { memo } from 'react';

const ObjectNode = ({ data }: NodeProps<Node<EntityObjectProperties>>) => (
  <EntityObject {...data} />
);

export default memo(ObjectNode);
