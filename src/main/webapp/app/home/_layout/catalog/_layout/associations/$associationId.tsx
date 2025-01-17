import { createFileRoute } from '@tanstack/react-router';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { AssociationType } from '@/features/association-type/types.ts';
import { useAssociationType } from '@/features/association-type/queries.ts';
import AssociationTypeOverview from '@/features/association-type/components/association-type-overview';

const AssociationComponentHub = () => {
  const { associationId } = Route.useParams();
  return (
    <StatusComponent<AssociationType>
      useQuery={useAssociationType(Number.parseInt(associationId, 10))}
    >
      {data => {
        return <AssociationTypeOverview data={data!} />;
      }}
    </StatusComponent>
  );
};

export const Route = createFileRoute(
  '/home/_layout/catalog/_layout/associations/$associationId',
)({
  component: AssociationComponentHub,
});
