import ObjectTypeDetails from '@/features/object-type/components/object-type-overview/object-type-details.tsx';
import ObjectTypeBadges from '@/features/object-type/components/object-type-overview/object-type-badges.tsx';
import ObjectTypeHeader from '@/features/object-type/components/object-type-overview/object-type-header.tsx';
import LabeledSection from '@/app/scenario/$scenarioId/_layout/~components/left-content/description/labeled-section.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/shadcn/card.tsx';
import { ObjectType } from '@/features/object-type/types.ts';
import Separator from '@/components/ui/shadcn/separator.tsx';
import { useNavigate, useParams } from '@tanstack/react-router';
import { PaginationProvider } from '@/lib/hal-pagination/context';
import { AssociationType } from '@/features/association-type/types.ts';
import { AssociationTypeByIdRequest } from '@/features/association-type/api.ts';
import usePagination from '@/lib/hal-pagination/hooks/use-pagination.ts';
import { usePaginatedByXid } from '@/features/association-type/queries.ts';
import React, { Fragment } from 'react';
import PaginationStatus from '@/lib/react-query/components/pagination-status';
import PageNavigation from '@/lib/react-query/components/page-navigation';
import AssociationTypeCard from '@/features/association-type/components/association-type-card.tsx';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs.tsx';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';

const AssociationTypeByIdSearch = ({
  selectedType,
}: {
  selectedType: string;
}) => {
  const { objectId } = useParams({
    from: '/home/_layout/catalog/_layout/types/$objectId',
  });
  const navigate = useNavigate();

  const { request, setRequest } = usePagination<
    AssociationType,
    AssociationTypeByIdRequest
  >();
  const queryResult = usePaginatedByXid(Number(objectId), request);

  React.useEffect(() => {
    setRequest({
      ...request,
      filter: {
        searchType: selectedType as AssociationTypeByIdRequest,
      },
    });
  }, [selectedType]);

  return (
    <PaginationStatus
      queryResult={queryResult}
      loading={
        <div className='flex flex-col divide-y divide-content1 w-full'>
          {Array.from({ length: 1 }).map((_, index) => (
            <Skeleton key={index} className='h-[92px] rounded-none' />
          ))}
        </div>
      }
      empty={
        <div className='w-full grid place-items-center py-6'>
          <EmptyComponentDashed
            text={'Object type is not associated with any other object type'}
          />
        </div>
      }
    >
      {associationTypes => (
        <>
          <div className='flex flex-col'>
            {associationTypes.map((associationType, index) => (
              <AssociationTypeCard
                associationType={associationType}
                key={index}
                onClick={() =>
                  navigate({
                    to: `/home/catalog/associations/${associationType.id}`,
                  })
                }
              />
            ))}
          </div>
          <div>
            <PageNavigation response={queryResult.data!} />
          </div>
        </>
      )}
    </PaginationStatus>
  );
};

const ObjectTypeOverviewGlobal = ({ data }: { data: ObjectType }) => {
  return (
    <div className='w-full h-full'>
      <Card className='h-full'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div className='flex-1'>
            <ObjectTypeHeader data={data} />
            <ObjectTypeBadges data={data} />
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <LabeledSection
              subtitle={'Description'}
              content={data.description || 'No description provided'}
            />
          </div>
          <Separator />
          <ObjectTypeDetails data={data} />
          <div className='w-full h-full py-4'>
            <div className='flex flex-row justify-between'>
              <h3 className='text-lg font-medium text-default-500'>
                Possible associations with{' '}
              </h3>
            </div>
            <Tabs defaultValue={'findByFirstObjectTypeId'}>
              {['findByFirstObjectTypeId', 'findBySecondObjectTypeId'].map(
                (type, index) => (
                  <Fragment key={type}>
                    {index === 0 && (
                      <TabsList>
                        <div className='px-2'>
                          Search where selected type is:
                        </div>
                        <TabsTrigger value='findByFirstObjectTypeId'>
                          Source
                        </TabsTrigger>
                        <TabsTrigger value='findBySecondObjectTypeId'>
                          Target
                        </TabsTrigger>
                      </TabsList>
                    )}
                    <TabsContent
                      value={type}
                      className='w-full grid place-items-center'
                    >
                      <Card className='bg-content3 w-full max-w-3xl'>
                        <PaginationProvider<
                          AssociationType,
                          AssociationTypeByIdRequest
                        >
                          initialRequest={{
                            filter: {
                              searchType: type as AssociationTypeByIdRequest,
                            },
                          }}
                        >
                          <AssociationTypeByIdSearch selectedType={type} />
                        </PaginationProvider>
                      </Card>
                    </TabsContent>
                  </Fragment>
                ),
              )}
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectTypeOverviewGlobal;
