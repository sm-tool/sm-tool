import { ObjectStylized } from '@/features/object-instance/components/object-card/index.tsx';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';

const ObjectStylizedDnd = ({
  objectId,
  sourceLocalThreadId,
}: {
  objectId: number;
  sourceLocalThreadId: number | null;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: objectId,
      data: {
        sourceLocalThreadId: sourceLocalThreadId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ObjectStylized objectId={objectId} />
    </div>
  );
};

export default ObjectStylizedDnd;
