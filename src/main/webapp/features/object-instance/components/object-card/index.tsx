import { getObjectTypeStyle } from '@/features/object-type/components/object-type-styles.ts';
import { Card } from '@/components/ui/shadcn/card.tsx';
import { cn } from '@nextui-org/theme';
import { useObjectType } from '@/features/object-type/queries.ts';
import { ObjectTemplateBadge } from '@/features/object-template/components/object-template-badge.tsx';
import MultiStatusComponent from '@/components/ui/common/data-load-states/status-multi-query-component';
import { useObjectTemplate } from '@/features/object-template/queries.ts';
import { useObjectInstance } from '@/features/object-instance/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import useObjectInstanceActions from '@/features/object-instance/use-object-instance-actions.ts';
import WithTopActions from '@/lib/actions/hoc/with-top-actions.tsx';
import useScenarioSearchParamNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import { Skeleton } from '@/components/ui/shadcn/skeleton';

const ObjectCard = ({ objectId }: { objectId: number }) => {
  return (
    <Card
      className={cn(
        'w-full h-full p-8 grid place-items-center overflow-hidden',
      )}
    >
      <ObjectStylized
        objectId={objectId}
        className='hover:scale-[102%] transition-size w-full'
      />
    </Card>
  );
};

export const ObjectStylizedWithActions = ({
  objectId,
}: {
  objectId: number;
}) => {
  const objectInstanceActions = useObjectInstanceActions({
    disableNavigation: true,
  });
  const { navigateRelative } = useScenarioSearchParamNavigation();

  return (
    <StatusComponent
      useQuery={useObjectInstance(objectId)}
      loadingComponent={<Skeleton className='w-full h-24 mt-12' />}
    >
      {objectIntance => (
        <Card
          className={cn(
            'w-full h-full p-8 pt-2 flex flex-col items-center border-none',
          )}
        >
          <WithTopActions actions={objectInstanceActions} item={objectIntance!}>
            <ObjectStylized
              objectId={objectId}
              className='hover:scale-105 transition-transform cursor-pointer'
              onClick={() => navigateRelative(`objects:${objectId}`)}
            />
          </WithTopActions>
        </Card>
      )}
    </StatusComponent>
  );
};

export const ObjectStylized = ({
  objectId,
  className,
  onClick,
}: {
  objectId: number;
  className?: string;
  onClick?: () => void;
}) => {
  const objectQuery = useObjectInstance(objectId);

  return (
    <StatusComponent
      useQuery={objectQuery}
      loadingComponent={<Skeleton className='h-20 w-96' />}
    >
      {object => (
        <ObjectContent
          objectTypeId={object!.objectTypeId}
          templateId={object!.templateId}
          name={object!.name}
          className={className}
          onClick={onClick}
        />
      )}
    </StatusComponent>
  );
};

const ObjectContent = ({
  objectTypeId,
  templateId,
  name,
  className,
  onClick,
}: {
  objectTypeId: number;
  templateId: number;
  name: string;
  className?: string;
  onClick?: () => void;
}) => {
  const objectTypeQuery = useObjectType(objectTypeId);
  const objectTemplateQuery = useObjectTemplate(templateId);

  const typeStyle = getObjectTypeStyle(objectTypeId);
  // const isCustom = typeStyle.className === 'bg-default-200/40';

  return (
    <MultiStatusComponent
      queries={{
        objectType: objectTypeQuery,
        objectTemplate: objectTemplateQuery,
      }}
      loadingComponent={<Skeleton className='h-20 w-full' />}
    >
      {data => (
        <Card
          style={{
            backgroundColor: data.objectType?.color,
          }}
          className={cn(
            typeStyle.className,
            `flex flex-col items-center text-center py-4 px-12 w-full min-w-0 border-none
            [clip-path:${typeStyle.clipPath}]`,
            data.objectType.color,
            className,
          )}
          onClick={onClick}
        >
          <ObjectTemplateBadge templateId={data.objectTemplate.id} />
          <p className='text-xl font-bold truncate w-full min-w-0 max-w-[300px]'>
            {name}
          </p>
        </Card>
      )}
    </MultiStatusComponent>
  );
};

export default ObjectCard;
