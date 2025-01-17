import { Table, TableBody } from '@/components/ui/shadcn/table.tsx';
import { useScenarios } from '@/features/scenario/queries.ts';
import ScenariosTableSkeleton from '@/app/home/_layout/scenarios/~components/scenarios-table/scenarios-table-skeleton.tsx';
import ScenariosEmptyTable from '@/app/home/_layout/scenarios/~components/scenarios-table/scenarios-empty-table.tsx';
import useScenarioActions from '@/app/home/_layout/scenarios/~components/scenarios-table/use-scenario-actions.ts';
import ScenariosTableRow from './scenarios-table-row.tsx';
import ScenarioTableHeader from '@/app/home/_layout/scenarios/~components/scenarios-table/scenarios-table-header.tsx';
import { PaginationProvider } from '@/lib/hal-pagination/context';
import {
  Scenario,
  ScenarioApiFilterMethods,
} from '@/features/scenario/types.ts';
import usePagination from '@/lib/hal-pagination/hooks/use-pagination.ts';
import PaginationStatus from '@/lib/react-query/components/pagination-status';
import PageNavigation from '@/lib/react-query/components/page-navigation';
import React from 'react';

const ScenariosTable = ({ searchQuery }: { searchQuery: string }) => {
  const actions = useScenarioActions();

  return (
    <PaginationProvider<Scenario, ScenarioApiFilterMethods>
      initialRequest={{
        sort: {
          sort: [
            {
              field: 'lastModificationDate',
              direction: 'desc',
            },
          ],
        },
      }}
    >
      <ScenariosTableContent actions={actions} searchQuery={searchQuery} />
    </PaginationProvider>
  );
};

const ScenariosTableContent = ({
  actions,
  searchQuery,
}: {
  actions: ReturnType<typeof useScenarioActions>;
  searchQuery: string;
}) => {
  const { request, setRequest } = usePagination<
    Scenario,
    ScenarioApiFilterMethods
  >();
  const queryResult = useScenarios(request);

  React.useEffect(() => {
    setRequest({
      ...request,
      filter: searchQuery
        ? {
            searchType: 'findByTitle',
            searchValue: searchQuery,
          }
        : undefined,
    });
  }, [searchQuery]);

  return (
    <PaginationStatus
      queryResult={queryResult}
      loading={<ScenariosTableSkeleton />}
      empty={<ScenariosEmptyTable />}
    >
      {scenarios => (
        <div className='flex flex-col gap-y-4'>
          <Table className='table-fixed'>
            <ScenarioTableHeader />
            <TableBody>
              {scenarios.map((scenario, id) => (
                <ScenariosTableRow
                  key={`row-${id}`}
                  scenario={scenario}
                  actions={actions}
                />
              ))}
            </TableBody>
          </Table>
          <div className='flex justify-center'>
            <PageNavigation response={queryResult.data!} />
          </div>
        </div>
      )}
    </PaginationStatus>
  );
};

export default ScenariosTable;
