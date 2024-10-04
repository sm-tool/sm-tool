import useInterfaceStore from '@/stores/interface';
import { SquareDashedMousePointer } from 'lucide-react';

const EmptyBoard: React.FC = () => (
  <div className='flex flex-col items-center'>
    <SquareDashedMousePointer className='h-24 w-24 stroke-default-400' />
    <p className='pt-4'>Select an element to view it on this dashboard</p>
  </div>
);

const ScenarioHighlight = () => {
  const { selectedElement } = useInterfaceStore();

  return (
    <div className='flex h-full w-full items-center justify-center'>
      {selectedElement ? <></> : <EmptyBoard />}
    </div>
  );
};

export default ScenarioHighlight;
