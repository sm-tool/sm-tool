import { useReactFlow } from '@xyflow/react';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';

type ContextMenuProperties = {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const ThreadsContextMenu = ({
  id,
  top,
  left,
  right,
  bottom,
  ...properties
}: ContextMenuProperties) => {
  const { setNodes, setEdges } = useReactFlow();

  const deleteNode = React.useCallback(() => {
    setNodes(nodes => nodes.filter(node => node.id !== id));
    setEdges(edges => edges.filter(edge => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <Card {...properties}>
      <CardHeader>
        <CardTitle className='text-xs text-muted-foreground'>
          node: {id}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Button variant='ghost' className='w-full justify-start'>
          Duplicate
        </Button>
        <Button
          variant='ghost'
          className='w-full justify-start text-destructive'
          onClick={deleteNode}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default ThreadsContextMenu;
