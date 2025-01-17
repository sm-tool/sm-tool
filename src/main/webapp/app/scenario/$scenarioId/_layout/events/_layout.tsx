import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';
import ChromeRail, {
  ChromeTab,
} from '@/app/scenario/$scenarioId/_layout/events/_layout/~components/chrome-tabs/chrome-rail';
import { useThreads } from '@/features/thread/queries.ts';
import React from 'react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import { useLocalStorage } from '@/hooks/use-local-storage.ts';

const EventLayout = () => {
  const threads = useThreads();
  const { navigateWithParameters } = useScenarioCommonNavigation();
  const { threadId: threadIdParameter } = useParams({ strict: false });
  const threadId = threadIdParameter ? Number(threadIdParameter) : null;

  const [tabs, setTabs] = useLocalStorage<ChromeTab[]>('threadTabs', []);

  React.useEffect(() => {
    if (!threads.data) return;

    setTabs(previousTabs => {
      if (previousTabs.length === 0) return previousTabs;

      const validTabs = previousTabs.filter(tab =>
        threads.data.some(thread => thread.id === tab.id),
      );

      if (validTabs.length === 0) return [];

      return validTabs.map(tab => ({
        ...tab,
        isActive: tab.id === threadId,
      }));
    });
  }, [threads.data, threadId]);

  React.useEffect(() => {
    setTabs(previousTabs => {
      if (previousTabs.length === 0) return previousTabs;
      const activeTab = previousTabs.find(tab => tab.isActive);
      if (activeTab?.id !== threadId || (!threadId && activeTab)) {
        return previousTabs.map(tab => ({
          ...tab,
          isActive: tab.id === threadId,
        }));
      }
      return previousTabs;
    });
  }, [threadId]);

  React.useEffect(() => {
    if (!threads.data || threadId === null) return;
    const currentThread = threads.data.find(t => t.id === threadId);
    if (!currentThread) return;

    setTabs(previousTabs => {
      if (previousTabs.some(tab => tab.id === threadId)) {
        return previousTabs.map(tab => ({
          ...tab,
          isActive: tab.id === threadId,
        }));
      }
      return [
        ...previousTabs.map(tab => ({ ...tab, isActive: false })),
        {
          id: threadId,
          title: currentThread.title,
          isActive: true,
        },
      ];
    });
  }, [threadId, threads.data]);

  const handleTabClick = (id: number) => {
    navigateWithParameters(`/events/${id}`);
  };

  const handleTabClose = (id: number) => {
    setTabs(previousTabs => {
      const newTabs = previousTabs.filter(tab => tab.id !== id);
      if (newTabs.length === 0) {
        navigateWithParameters('/events');
        return newTabs;
      }
      if (id === threadId) {
        const currentTabIndex = previousTabs.findIndex(tab => tab.id === id);
        const nextTab =
          previousTabs[currentTabIndex - 1] ||
          previousTabs[currentTabIndex + 1];
        if (nextTab) {
          navigateWithParameters(`/events/${nextTab.id}`);
        }
      }
      return newTabs;
    });
  };

  const handleTabsChange = (newTabs: ChromeTab[]) => {
    setTabs(newTabs);
  };

  return (
    <>
      <ChromeRail
        tabs={tabs}
        onTabClick={handleTabClick}
        onTabsChange={handleTabsChange}
        onTabClose={handleTabClose}
      />
      <Outlet />
    </>
  );
};

export const Route = createFileRoute(
  '/scenario/$scenarioId/_layout/events/_layout',
)({
  component: EventLayout,
});
