import { createFileRoute } from '@tanstack/react-router';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useObjectTemplate } from '@/features/object-template/queries.ts';
import { ObjectTemplate } from '@/features/object-template/types.ts';
import ObjectTemplateOverview from '@/features/object-template/components/object-template-overview';

const TemplateComponentHub = () => {
  const { templateId } = Route.useParams();
  return (
    <StatusComponent<ObjectTemplate>
      useQuery={useObjectTemplate(Number.parseInt(templateId, 10))}
    >
      {data => {
        return <ObjectTemplateOverview data={data!} />;
      }}
    </StatusComponent>
  );
};

export const Route = createFileRoute(
  '/home/_layout/catalog/_layout/templates/$templateId',
)({
  component: TemplateComponentHub,
});
