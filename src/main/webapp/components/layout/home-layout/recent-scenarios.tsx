import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@/components/ui/shadcn/side-bar.tsx';
import { Link } from '@tanstack/react-router';
import { CircleDot } from 'lucide-react';
import {
  Scenario,
  ScenarioApiFilterMethods,
} from '@/features/scenario/types.ts';
import { PaginationProvider } from '@/lib/hal-pagination/context';
import usePagination from '@/lib/hal-pagination/hooks/use-pagination.ts';
import { useScenarios } from '@/features/scenario/queries.ts';
import PaginationStatus from '@/lib/react-query/components/pagination-status';

const RecentScenarios = () => (
  <SidebarGroup>
    <SidebarGroupLabel>Recent scenarios</SidebarGroupLabel>
    <SidebarGroupContent>
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
        <RecentScenariosContent />
      </PaginationProvider>
    </SidebarGroupContent>
  </SidebarGroup>
);

const RecentScenariosContent = () => {
  const { request } = usePagination<
    Scenario,
    'findByTitle' | 'findByDescription'
  >();
  const queryResult = useScenarios(request);

  return (
    <PaginationStatus
      queryResult={queryResult}
      loading={<SidebarMenuSkeleton />}
    >
      {scenarios => (
        <SidebarMenu>
          {scenarios.length === 0 ? (
            <EmptyScenarioState />
          ) : (
            <ScenarioList scenarios={scenarios.slice(0, 5)} />
          )}
        </SidebarMenu>
      )}
    </PaginationStatus>
  );
};

const EmptyScenarioState = () => (
  <div
    className='h-64 w-full border-5 border-dashed rounded-xl flex items-center justify-center
      border-content4'
  >
    Create your scenario first!
  </div>
);

const ScenarioList = ({ scenarios }: { scenarios: Scenario[] }) => (
  <>
    {scenarios.map(scenario => (
      <SidebarMenuItem key={scenario.id}>
        <SidebarMenuButton asChild>
          <Link
            to='/scenario/$scenarioId'
            params={{ scenarioId: scenario.id.toString() }}
          >
            <CircleDot />
            <span className='truncate'>{scenario.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </>
);

export default RecentScenarios;
