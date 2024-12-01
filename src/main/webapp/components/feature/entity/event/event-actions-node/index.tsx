import { memo } from 'react';
import {
  FLOW_UNIT_HEIGHT,
  FLOW_UNIT_WIDTH,
} from '@/components/feature/page/scenario/scenarioFlow/config/scenario-flow-config.ts';

export const EventActionsNode = () => (
  <div
    className='bg-content4 border-2 border-default-400'
    style={{ height: FLOW_UNIT_HEIGHT / 2, width: FLOW_UNIT_WIDTH }}
  />
);

export default memo(EventActionsNode);

// const groupNode = {
//   id: data.id,
//   type: 'group',
//   position: {
//     x: 0,
//     y: 0,
//   },
//   data: { label: undefined },
//   className: 'p-4 bg-white',
//   style: {
//     width: 1000,
//     height: 300,
//   },
// };

// const createNodesAndEdges = () => {
//   const nodes: Node[] = [];
//   const edges: Edge[] = [];
//
//   // changes nodes
//   for (const change of data.objectChanges) {
//     nodes.push(
//         // from
//         {
//           id: `${change.attributeId}-${change.elementId}`,
//           type: 'object',
//           position: {
//             x: 0,
//             y: 0,
//           },
//           data: {
//             label: `${change.value}-old`,
//           },
//           parentId: data.id,
//           extent: 'parent',
//         },
//         // to
//         {
//           id: `${change.attributeId}-${change.elementId}-${change.value}`,
//           type: 'object',
//           position: {
//             x: 0,
//             y: 0,
//           },
//           data: {
//             label: change.value,
//           },
//         },
//     );
//
//     // edges
//     edges.push({
//       id: `${data.id}=>${change.elementId}-${change.attributeId}`,
//       source: `${change.attributeId}-${change.elementId}`,
//       target: `${change.attributeId}-${change.elementId}-${change.value}`,
//       type: 'default',
//       animated: true,
//     });
//   }
//
//   return { nodes, edges };
// };
