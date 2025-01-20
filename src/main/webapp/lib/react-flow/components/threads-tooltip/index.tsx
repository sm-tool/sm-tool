import ThreadManipulationActionPanel from '@/lib/react-flow/components/threads-tooltip/panels/thread-manipulation-action-panel.tsx';
import CreatingMargePanel from '@/lib/react-flow/components/threads-tooltip/panels/creating-marge-panel.tsx';
import MainPanel from '@/lib/react-flow/components/threads-tooltip/panels/main-panel.tsx';
import EditingMargePanel from '@/lib/react-flow/components/threads-tooltip/panels/editing-merge-panel.tsx';

const ThreadsTooltip = () => {
  return (
    <>
      <MainPanel />
      <ThreadManipulationActionPanel />
      <CreatingMargePanel />
      <EditingMargePanel />
    </>
  );
};

export default ThreadsTooltip;
