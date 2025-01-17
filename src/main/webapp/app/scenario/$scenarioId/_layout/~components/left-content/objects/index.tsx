import useScenarioSearchParamNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import { useDebounce } from '@/hooks/use-debounce.ts';
import React from 'react';
import SearchInput from '../../../../../../../components/ui/common/input/search-input';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { ObjectInstance } from '@/features/object-instance/types.ts';
import { useObjectInstances } from '@/features/object-instance/queries.ts';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { ArrowLeft } from 'lucide-react';
import ObjectCard from '@/features/object-instance/components/object-card';
import ObjectOverview from '@/features/object-instance/components/object-overview';
import { useSearch } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';

const ObjectsList = ({
  objects,
  searchText,
  onSelect,
}: {
  objects: ObjectInstance[];
  searchText: string;
  onSelect: (id: number) => void;
}) => {
  const filteredObjects = React.useMemo(
    () =>
      objects.filter(object =>
        object.name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [objects, searchText],
  );

  return (
    <div className='space-y-2 p-4 w-full'>
      {filteredObjects.map(item => (
        <div
          onClick={() => onSelect(item.id)}
          key={item.id}
          className='cursor-pointer w-full h-full'
        >
          <ObjectCard objectId={item.id} />
        </div>
      ))}
    </div>
  );
};

const SectionWithObjects = () => {
  const search = useSearch({
    // @ts-expect-error -- ts wrongly intercepts the type
    from: '/scenario/$scenarioId',
    strict: false,
  });

  const { navigateRelative } = useScenarioSearchParamNavigation();
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearch = useDebounce(searchText);
  const [_, id] = search.left!.split(':') as [string, string | undefined];
  const objectInstancesQuery = useObjectInstances();

  const handleSelect = React.useCallback(
    (selectedId: number) => {
      navigateRelative(`objects:${selectedId}`);
    },
    [navigateRelative],
  );

  if (id) {
    return (
      <div>
        <Button
          variant='outline'
          onClick={() => navigateRelative('objects')}
          className='mb-4 m-6'
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Back to Objects
        </Button>
        <DialogWrapper>
          <ObjectOverview objectId={Number(id)} />
        </DialogWrapper>
      </div>
    );
  }

  return (
    <div className='min-h-screen overflow-hidden'>
      <div className='flex flex-col h-screen'>
        <div className='h-fit gap-y-4 p-4'>
          <h1 className='mx-auto font-bold text-center text-2xl'>
            Objects List
          </h1>
          <div className='mt-4'>
            <SearchInput
              value={searchText}
              onChange={setSearchText}
              placeholder='Search objects'
            />
          </div>
        </div>

        <div className='flex-1 overflow-hidden'>
          <StatusComponent<ObjectInstance[]>
            useQuery={objectInstancesQuery}
            loadingComponent={<Skeleton className='w-full h-32' />}
          >
            {objects => (
              <div className='h-full'>
                <ScrollArea className='h-full'>
                  <ObjectsList
                    objects={objects!}
                    searchText={debouncedSearch}
                    onSelect={handleSelect}
                  />
                  <ScrollBar />
                </ScrollArea>
              </div>
            )}
          </StatusComponent>
        </div>

        <div className='h-fit bg-content1 p-4 w-full text-center'>
          <span>Creation of new objects is possible from threads window</span>
        </div>
      </div>
    </div>
  );
};

export default SectionWithObjects;
