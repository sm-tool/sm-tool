import { useActiveScenario } from '@/features/scenario/queries.ts';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import {
  Link,
  useLocation,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import GlobalSearch from '@/app/scenario/$scenarioId/_layout/~components/global-search';
import { useThreadEventLOCAL } from '@/features/event-instance/queries.ts';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb.tsx';
import { useThread } from '@/features/thread/queries.ts';
import QuickTooltip from '@/components/ui/common/display/quick-tooltip';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { useDocumentTitle } from '@/hooks/use-document-title.ts';

const TabButton = ({ path, label }: { path: string; label: string }) => {
  const location = useLocation();
  const search = useSearch({
    // @ts-expect-error -- ts wrongly intercepts the type
    from: '/scenario/$scenarioId',
    strict: false,
  });

  const isActive = location.pathname.split('/')[3] === path;

  return (
    <Link
      // @ts-expect-error -- todo: split this component into 4
      to={`/scenario/${location.pathname.split('/')[2]}/${path}`}
      search={search}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors group
        ${isActive ? 'text-primary hover:text-primary/75' : 'text-default-500 hover:text-primary/75'}`}
    >
      <div
        className={`w-2 h-2 rounded-full transition-colors
          ${isActive ? 'bg-primary group-hover:bg-primary/75' : 'bg-default-200 group-hover:bg-primary/75'}`}
      />
      {label}
    </Link>
  );
};

const ThreadSection = ({ threadId }: { threadId: string }) => {
  const threadQuery = useThread(Number(threadId));
  const { navigateWithParameters } = useScenarioCommonNavigation();
  return (
    <StatusComponent useQuery={threadQuery} className='-mr-1'>
      {thread => (
        <div className='flex items-center'>
          <BreadcrumbSeparator className='mr-1' />
          <BreadcrumbItem>
            <QuickTooltip content={<span>{thread!.title}</span>}>
              <BreadcrumbLink
                onClick={() => navigateWithParameters(`/events/${threadId}`)}
                className='max-w-[200px] truncate'
              >
                {thread!.title}
              </BreadcrumbLink>
            </QuickTooltip>
          </BreadcrumbItem>
        </div>
      )}
    </StatusComponent>
  );
};

const EventSection = ({
  threadId,
  eventId,
}: {
  threadId: string;
  eventId: string;
}) => {
  const eventQuery = useThreadEventLOCAL(Number(threadId), Number(eventId));
  return (
    <StatusComponent useQuery={eventQuery}>
      {event => (
        <div className='flex items-center'>
          <BreadcrumbSeparator className='pr-3' />
          <BreadcrumbItem>
            <QuickTooltip content={<span>{event!.title}</span>}>
              <BreadcrumbPage className='max-w-[200px] truncate'>
                {event!.title || event!.eventType}
              </BreadcrumbPage>
            </QuickTooltip>
          </BreadcrumbItem>
        </div>
      )}
    </StatusComponent>
  );
};

const ScenarioTopTooltip = () => {
  const { threadId, eventId } = useParams({
    strict: false,
  });

  const { navigateWithParameters } = useScenarioCommonNavigation();
  const scenarioQuery = useActiveScenario();
  const threadQuery = useThread(Number(threadId));
  const eventQuery = useThreadEventLOCAL(Number(threadId), Number(eventId));

  useDocumentTitle([
    scenarioQuery.data?.title,
    threadQuery.data?.title,
    eventQuery.data?.title,
  ]);

  return (
    <div
      className='h-[4svh] w-full bg-content2 border-default-400/90 border-b-1 flex
        justify-between items-center px-3'
    >
      <div className='w-2/5 flex items-center gap-2 border-l-3 border-primary pl-2'>
        <Breadcrumb>
          <BreadcrumbList className='flex-nowrap h-5'>
            <StatusComponent useQuery={scenarioQuery}>
              {scenario => (
                <BreadcrumbItem>
                  <QuickTooltip content={<span>{scenario!.title}</span>}>
                    <BreadcrumbLink
                      onClick={() => navigateWithParameters(`/threads`)}
                      className='max-w-[200px] truncate'
                    >
                      {scenario!.title}
                    </BreadcrumbLink>
                  </QuickTooltip>
                </BreadcrumbItem>
              )}
            </StatusComponent>

            {threadId && <ThreadSection threadId={threadId} />}
            {threadId && eventId && (
              <EventSection threadId={threadId} eventId={eventId} />
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='w-1/5'>
        <GlobalSearch />
      </div>
      <div className='w-2/5 flex flex-row justify-end'>
        <TabButton path='threads' label='Thread view' />
        <TabButton path='events' label='Event view' />
      </div>
    </div>
  );
};

export default ScenarioTopTooltip;
