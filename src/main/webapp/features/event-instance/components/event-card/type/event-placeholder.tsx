import { Handle, NodeProps, Position } from '@xyflow/react';
import React from 'react';
import { motion } from 'framer-motion';

// TODO: DODAĆ KONTEKST ZMIAN i updatować na bierząco
const EventPlaceholder = ({ ...properties }: NodeProps) => (
  <motion.div
    layout
    animate={{
      scale: 1,
    }}
    initial={{
      scale: 0,
    }}
    transition={{
      layout: {
        duration: 0.3,
      },
      duration: 0.3,
    }}
    className='border-2 border-dashed border-primary/60 bg-content1'
    style={{ height: properties.height }}
  >
    <Handle
      type='target'
      position={Position.Left}
      id='target'
      className='invisible'
    />

    {/*<div className='absolute bottom-1 right-1 flex flex-row z-30'>*/}
    {/*  <ChangesBadge*/}
    {/*    count={properties.data.event!.attributeChange.length}*/}
    {/*    type='attribute'*/}
    {/*  />*/}
    {/*  <ChangesBadge*/}
    {/*    count={properties.data.event!.associationChange.length}*/}
    {/*    type='association'*/}
    {/*  />*/}
    {/*</div>*/}
    <Handle
      type='source'
      position={Position.Right}
      id='source'
      className='invisible'
    />
  </motion.div>
);

export default React.memo(EventPlaceholder);
