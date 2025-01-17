import { ObjectType } from '@/features/object-type/types.ts';
import { Card, CardContent, CardHeader } from '@/components/ui/shadcn/card.tsx';
import Separator from '@/components/ui/shadcn/separator.tsx';
import ObjectTypeDetails from '@/features/object-type/components/object-type-overview/object-type-details.tsx';
import ObjectTypeBadges from '@/features/object-type/components/object-type-overview/object-type-badges.tsx';
import ObjectTypeHeader from '@/features/object-type/components/object-type-overview/object-type-header.tsx';
import LabeledSection from '@/app/scenario/$scenarioId/_layout/~components/left-content/description/labeled-section.tsx';
import { AssociationType } from '@/features/association-type/types.ts';
import useScenarioSearchParameterNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/shadcn/tabs.tsx';
import React from 'react';
import { PaginationProvider } from '@/lib/hal-pagination/context';
import { AssociationTypeByIdRequest } from '@/features/association-type/api.ts';
import { useLocation, useRouter } from '@tanstack/react-router';
import usePagination from '@/lib/hal-pagination/hooks/use-pagination.ts';
import { usePaginatedByXid } from '@/features/association-type/queries.ts';
import PaginationStatus from '@/lib/react-query/components/pagination-status';
import EmptyComponentDashed from '@/components/ui/common/data-load-states/empty-component/empty-component-dashed.tsx';
import AssociationTypeCard from '@/features/association-type/components/association-type-card.tsx';
import PageNavigation from '@/lib/react-query/components/page-navigation';
import { CreateNewAssociation } from '@/app/home/_layout/catalog/_layout/associations';

const AssociationTypeByIdSearch = ({
  selectedType,
  typeId,
}: {
  selectedType: string;
  typeId: number;
}) => {
  const { request, setRequest } = usePagination<
    AssociationType,
    AssociationTypeByIdRequest
  >();
  const queryResult = usePaginatedByXid(typeId, request);

  const router = useRouter();
  const location = useLocation();
  const { navigateRelative } = useScenarioSearchParameterNavigation();

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
              <div
                className='w-full size-full'
                key={index}
                onClick={async () => {
                  if (location.href.includes('/home')) {
                    await router.navigate({
                      to: `/home/catalog/associations/${associationType.id}`,
                    });
                  } else {
                    navigateRelative(
                      `catalogue:associations:${associationType.id}`,
                    );
                  }
                }}
              >
                <AssociationTypeCard
                  associationType={associationType}
                  key={index}
                />
              </div>
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

const ObjectTypeOverview = ({ data }: { data: ObjectType }) => {
  const SEARCH_TYPES = {
    findByFirstObjectTypeId: {
      label: 'Source',
      buttonText: 'Create new association as source',
    },
    findBySecondObjectTypeId: {
      label: 'Target',
      buttonText: 'Create new association as target',
    },
  } as const;

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
          <div className='w-full h-full p-4 space-y-4'>
            <div className='flex flex-row justify-between'>
              <h3 className='text-lg font-medium text-default-500'>
                Possible associations with{' '}
              </h3>
            </div>

            <Card className='bg-content3 @container'>
              <Tabs defaultValue='findByFirstObjectTypeId'>
                <TabsList className='w-full'>
                  <div className='px-4 hidden @md:block'>
                    Search where selected type is:
                  </div>
                  <div className='px-4 hidden @xs:block @md:hidden'>
                    Search type by
                  </div>
                  {Object.entries(SEARCH_TYPES).map(([type, { label }]) => (
                    <TabsTrigger key={type} value={type}>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(SEARCH_TYPES).map(([type, { buttonText }]) => (
                  <TabsContent
                    key={type}
                    value={type}
                    className='w-full grid place-items-center'
                  >
                    <CreateNewAssociation
                      className='border-content1 hover:bg-content1/80 bg-content1/60 mb-1'
                      variant='outline'
                      buttonText={buttonText}
                      initialData={{
                        firstObjectTypeId:
                          type === 'findByFirstObjectTypeId'
                            ? data.id
                            : undefined,
                        secondObjectTypeId:
                          type === 'findBySecondObjectTypeId'
                            ? data.id
                            : undefined,
                      }}
                    />
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
                        <AssociationTypeByIdSearch
                          selectedType={type}
                          typeId={data.id}
                        />
                      </PaginationProvider>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
            <div className='w-full flex justify-center'></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectTypeOverview;
