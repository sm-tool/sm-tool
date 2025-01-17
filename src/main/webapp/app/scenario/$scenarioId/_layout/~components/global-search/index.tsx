import { useThreads } from '@/features/thread/queries.ts';
import { useObjectInstances } from '@/features/object-instance/queries.ts';
import SearchInputPanel, {
  SearchResult,
} from '@/components/ui/common/input/search-input-panel';
import React from 'react';
import useScenarioCommonNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-common-navigation.ts';
import useScenarioSearchParamNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';

const GlobalSearch = () => {
  const searchReference = React.useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const { data: threads, isLoading: isThreadsLoading } = useThreads();
  const { data: objects, isLoading: isObjectsLoading } = useObjectInstances();
  const { navigateRelative } = useScenarioSearchParamNavigation();
  const { navigateWithParameters } = useScenarioCommonNavigation();

  React.useEffect(() => {
    const down = (keyboardEvent: KeyboardEvent) => {
      if (
        keyboardEvent.key === 'k' &&
        (keyboardEvent.metaKey || keyboardEvent.ctrlKey)
      ) {
        keyboardEvent.preventDefault();
        searchReference.current?.focus();
      }
    };
    globalThis.document.addEventListener('keydown', down);
    return () => globalThis.document.removeEventListener('keydown', down);
  }, []);

  const getResults = React.useCallback(
    (search: string): SearchResult[] => {
      if (!search) return [];

      const results: SearchResult[] = [];

      if (threads)
        for (const thread of threads) {
          if (
            thread.title.toLowerCase().includes(search.toLowerCase()) ||
            thread.description?.toLowerCase().includes(search.toLowerCase())
          ) {
            results.push({
              id: `thread-${thread.id}`,
              title: thread.title,
              description: thread.description?.slice(0, 100),
              url: '',
            });
          }
        }

      if (objects)
        for (const object of objects) {
          if (object.name.toLowerCase().includes(search.toLowerCase())) {
            results.push({
              id: `object-${object.id}`,
              title: object.name,
              url: '',
            });
          }
        }

      return results;
    },
    [threads, objects],
  );

  const results = React.useMemo(
    () => getResults(searchValue),
    [getResults, searchValue],
  );

  const handleResultSelect = (result: SearchResult) => {
    const [type, id] = result.id.split('-');

    if (type === 'thread') {
      navigateWithParameters(`events/${id}`);
    } else {
      navigateRelative(`objects:${id}`);
    }
    setSearchValue('');
    searchReference.current?.blur();
  };

  return (
    <SearchInputPanel
      ref={searchReference}
      value={searchValue}
      onChange={setSearchValue}
      results={results}
      isLoading={isThreadsLoading || isObjectsLoading}
      onResultSelect={handleResultSelect}
      shortcut='⌘K'
    />
  );
};

export default GlobalSearch;
