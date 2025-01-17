import { createFileRoute } from '@tanstack/react-router';
import { useObjectType } from '@/features/object-type/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { ObjectType } from '@/features/object-type/types.ts';
import ObjectTypeOverviewGlobal from '@/features/object-type/components/object-type-overview/object-type-overview-global.tsx';

const ObjectComponentHub = () => {
  const { objectId } = Route.useParams();
  return (
    <StatusComponent<ObjectType>
      useQuery={useObjectType(Number.parseInt(objectId, 10))}
    >
      {data => {
        return <ObjectTypeOverviewGlobal data={data!} />;
      }}
    </StatusComponent>
  );
};

export const Route = createFileRoute(
  '/home/_layout/catalog/_layout/types/$objectId',
)({
  component: ObjectComponentHub,
});
