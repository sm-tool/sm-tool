import { Table, TableBody } from '@/components/ui/shadcn/table.tsx';
import { useScenarios } from '@/features/scenario/queries.ts';
import PaginatedStatusComponent from '@/lib/pagination/provider/pagination-provider.tsx';
import PageNavigation from '@/lib/pagination/components/page-navigation.tsx';
import ScenarioTableHeader from '@/app/home/_layout/~components/scenarios-table/scenarios-table-header.tsx';
import ScenariosTableSkeleton from '@/app/home/_layout/~components/scenarios-table/scenarios-table-skeleton.tsx';
import ScenariosEmptyTable from '@/app/home/_layout/~components/scenarios-table/scenarios-empty-table.tsx';
import scenarioActions from '@/app/home/_layout/~components/scenarios-table/scenario-actions.ts';
import ScenariosTableRow from './scenarios-table-row';

const Index = ({ searchQuery }: { searchQuery: string }) => {
  const actions = scenarioActions();

  return (
    <PaginatedStatusComponent
      useQuery={useScenarios}
      filter={{
        searchQuery: searchQuery,
        searchType: 'title',
      }}
      customLoading={<ScenariosTableSkeleton />}
      customEmpty={<ScenariosEmptyTable />}
      defaultSort={{ field: 'lastModificationDate' }}
    >
      {data => (
        <div className='flex flex-col gap-y-4'>
          <Table className='table-fixed'>
            <ScenarioTableHeader />
            <TableBody>
              {data.content?.map((scenario, id) => (
                <ScenariosTableRow
                  key={`row-${id}`}
                  scenario={scenario}
                  actions={actions}
                />
              ))}
            </TableBody>
          </Table>
          <div className='flex justify-center'>
            <PageNavigation />
          </div>
        </div>
      )}
    </PaginatedStatusComponent>
  );
};

export default Index;
