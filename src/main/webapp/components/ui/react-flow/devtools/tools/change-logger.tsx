import { useEffect, useRef, useState } from 'react';
import {
  type NodeChange,
  type OnNodesChange,
  useStore,
  useStoreApi,
} from '@xyflow/react';

type ChangeLoggerProperties = {
  color?: string;
  limit?: number;
};

type ChangeInfoProperties = {
  change: NodeChange;
};

function ChangeInfo({ change }: ChangeInfoProperties) {
  const id = 'id' in change ? change.id : '-';
  const { type } = change;

  return (
    <div style={{ marginBottom: 4 }}>
      <div>node id: {id}</div>
      <div>
        {type === 'add' ? JSON.stringify(change.item, undefined, 2) : undefined}
        {type === 'dimensions'
          ? `dimensions: ${change.dimensions?.width} × ${change.dimensions?.height}`
          : undefined}
        {type === 'position'
          ? `position: ${change.position?.x.toFixed(
              1,
            )}, ${change.position?.y.toFixed(1)}`
          : undefined}
        {type === 'remove' ? 'remove' : undefined}
        {type === 'select'
          ? change.selected
            ? 'select'
            : 'unselect'
          : undefined}
      </div>
    </div>
  );
}

export default function ChangeLogger({ limit = 20 }: ChangeLoggerProperties) {
  const [changes, setChanges] = useState<NodeChange[]>([]);
  const onNodesChangeIntercepted = useRef(false);
  const onNodesChange = useStore(s => s.onNodesChange);
  const store = useStoreApi();

  useEffect(() => {
    if (!onNodesChange || onNodesChangeIntercepted.current) {
      return;
    }

    onNodesChangeIntercepted.current = true;
    const userOnNodesChange = onNodesChange;

    const onNodesChangeLogger: OnNodesChange = changes => {
      userOnNodesChange(changes);

      setChanges(oldChanges => [...changes, ...oldChanges].slice(0, limit));
    };

    store.setState({ onNodesChange: onNodesChangeLogger });
  }, [onNodesChange, limit]);

  return (
    <div className='react-flow__devtools-changelogger'>
      <div className='react-flow__devtools-title'>Change Logger</div>
      {changes.length === 0 ? (
        <>no changes triggered</>
      ) : (
        changes.map((change, index) => (
          <ChangeInfo key={index} change={change} />
        ))
      )}
    </div>
  );
}
