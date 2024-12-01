import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/shadcn/side-bar.tsx';
import PaginatedStatusComponent from '@/lib/pagination/provider/pagination-provider.tsx';
import { useScenarios } from '@/features/scenario/queries.ts';
import { Link } from '@tanstack/react-router';
import { CircleDot } from 'lucide-react';
import { Scenario } from '@/features/scenario/types.ts';

const RecentScenarios = () => (
  <SidebarGroup>
    <SidebarGroupLabel>Recent scenarios</SidebarGroupLabel>
    <SidebarGroupContent>
      <PaginatedStatusComponent
        useQuery={useScenarios}
        defaultSort={{ field: 'lastModificationDate' }}
      >
        {data => (
          <SidebarMenu>
            {data.totalElements === 0 ? (
              <EmptyScenarioState />
            ) : (
              <ScenarioList scenarios={data.content} />
            )}
          </SidebarMenu>
        )}
      </PaginatedStatusComponent>
    </SidebarGroupContent>
  </SidebarGroup>
);

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
          <Link to={`/scenario/${scenario.id}`}>
            <CircleDot />
            <span>{scenario.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </>
);

export default RecentScenarios;
