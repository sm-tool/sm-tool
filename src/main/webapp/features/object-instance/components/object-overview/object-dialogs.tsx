import { useObjectInstance } from '@/features/object-instance/queries.ts';
import RudButtonGroup from '@/lib/actions/components/rud-button-group.tsx';
import useObjectInstanceActions from '@/features/object-instance/use-object-instance-actions.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';

const ObjectDialogs = ({ objectId }: { objectId: number }) => {
  const objectInstanceActions = useObjectInstanceActions();

  return (
    <StatusComponent useQuery={useObjectInstance(objectId)}>
      {objectIntance => (
        <RudButtonGroup
          actions={objectInstanceActions}
          item={objectIntance!}
          className='border-0 border-none'
        />
      )}
    </StatusComponent>
  );
};

export default ObjectDialogs;
