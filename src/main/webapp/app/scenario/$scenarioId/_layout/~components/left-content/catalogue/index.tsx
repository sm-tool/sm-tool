import React from 'react';
import { useDebounce } from '@/hooks/use-debounce.ts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs.tsx';
import SearchInput from '../../../../../../../components/ui/common/input/search-input';
import InfiniteList from '@/lib/react-query/components/infinite-scroll';
import { ObjectType } from '@/features/object-type/types.ts';
import {
  useInfiniteObjectTypeHeaderLess,
  useObjectType,
} from '@/features/object-type/queries.ts';
import ObjectTypeCard from '@/features/object-type/components/object-type-card.tsx';
import { ObjectTemplate } from '@/features/object-template/types.ts';
import {
  useInfiniteObjectTemplateHeaderLess,
  useObjectTemplate,
} from '@/features/object-template/queries.ts';
import ObjectTemplateCard from '@/features/object-template/components/object-template-card.tsx';
import { AssociationType } from '@/features/association-type/types.ts';
import {
  useAssociationType,
  useInfiniteAssociationType,
} from '@/features/association-type/queries.ts';
import AssociationTypeCard from '@/features/association-type/components/association-type-card.tsx';
import { CreateNewObjectButton } from '@/app/home/_layout/catalog/_layout/types';
import { CreateNewTemplateButton } from '@/app/home/_layout/catalog/_layout/templates';
import { CreateNewAssociation } from '@/app/home/_layout/catalog/_layout/associations';
import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import ObjectTypeOverview from '@/features/object-type/components/object-type-overview';
import ObjectTemplateOverview from '@/features/object-template/components/object-template-overview';
import AssociationTypeOverview from '@/features/association-type/components/association-type-overview';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/shadcn/side-bar.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { ArrowLeft } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import useScenarioSearchParamNavigation from '@/app/scenario/$scenarioId/_layout/~hooks/use-scenario-search-parameter-navigation.ts';
import ImportButtonForObjectTypes from '@/features/object-type/components/import-button-for-object-types';
import { getScenarioIdFromPath } from '@/features/scenario/utils/get-scenario-id-from-path.tsx';
import ImportButtonForObjectTemplates from '@/features/object-template/components/import-button-for-object-templates';

type CatalogSection = 'types' | 'templates' | 'associations';
type QueryFilter = {
  searchType: 'findByTitle';
  searchValue: string;
};

const CatalogHeader = ({
  currentPath,
  search,
  setSearch,
}: {
  currentPath: CatalogSection;
  search: string;
  setSearch: (value: string) => void;
}) => {
  const { navigateRelative } = useScenarioSearchParamNavigation();

  const handleSectionChange = (value: string) => {
    navigateRelative(`catalogue:${value}`);
  };

  return (
    <SidebarHeader className='h-fit gap-y-4 p-6 pt-4'>
      <h1 className='mx-auto font-bold text-2xl'>Scenario library catalogue</h1>
      <Tabs
        defaultValue={currentPath}
        onValueChange={value => handleSectionChange(value as CatalogSection)}
      >
        <TabsList className='grid w-full grid-cols-3 ring-1 ring-default-300'>
          <TabsTrigger
            value='types'
            className='data-[state=active]:bg-content3'
          >
            Types
          </TabsTrigger>
          <TabsTrigger
            value='templates'
            className='data-[state=active]:bg-content3'
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value='associations'
            className='data-[state=active]:bg-content3'
          >
            Associations
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={`Search for ${currentPath}`}
      />
    </SidebarHeader>
  );
};

const ObjectsList = ({
  queryFilter,
  onSelect,
}: {
  queryFilter: QueryFilter;
  onSelect: (id: number) => void;
}) => (
  <InfiniteList<ObjectType, 'qdsObjectTypes'>
    queryResult={useInfiniteObjectTypeHeaderLess(getScenarioIdFromPath(), {
      filter: queryFilter,
    })}
  >
    {items => (
      <div className='space-y-2'>
        {items.map(item => (
          <div
            onClick={() => onSelect(item.id)}
            key={item.id}
            className='cursor-pointer'
          >
            <ObjectTypeCard objectType={item} className='max-w-none' />
          </div>
        ))}
      </div>
    )}
  </InfiniteList>
);

const TemplatesList = ({
  queryFilter,
  onSelect,
}: {
  queryFilter: QueryFilter;
  onSelect: (id: number) => void;
}) => (
  <InfiniteList<ObjectTemplate, 'qdsObjectTemplates'>
    queryResult={useInfiniteObjectTemplateHeaderLess(getScenarioIdFromPath(), {
      filter: queryFilter,
    })}
  >
    {items => (
      <div className='space-y-2'>
        {items.map(item => (
          <div
            onClick={() => onSelect(item.id)}
            key={item.id}
            className='cursor-pointer'
          >
            <ObjectTemplateCard objectTemplate={item} className='max-w-none' />
          </div>
        ))}
      </div>
    )}
  </InfiniteList>
);

const AssociationsList = ({
  queryFilter,
  onSelect,
}: {
  queryFilter: QueryFilter;
  onSelect: (id: number) => void;
}) => (
  <InfiniteList<AssociationType, 'qdsAssociationTypes'>
    queryResult={useInfiniteAssociationType({
      filter: {
        searchType: 'findByDescription',
        searchValue: queryFilter.searchValue,
      },
    })}
  >
    {items => (
      <div className='space-y-2'>
        {items.map(item => (
          <div
            onClick={() => onSelect(item.id)}
            key={item.id}
            className='cursor-pointer'
          >
            <AssociationTypeCard associationType={item} />
          </div>
        ))}
      </div>
    )}
  </InfiniteList>
);

const CatalogContent = ({
  currentPath,
  queryFilter,
  onSelect,
}: {
  currentPath: CatalogSection;
  queryFilter: QueryFilter;
  onSelect: (id: number) => void;
}) => {
  const contentMap: Record<CatalogSection, React.ReactNode> = {
    types: <ObjectsList queryFilter={queryFilter} onSelect={onSelect} />,
    templates: <TemplatesList queryFilter={queryFilter} onSelect={onSelect} />,
    associations: (
      <AssociationsList queryFilter={queryFilter} onSelect={onSelect} />
    ),
  };

  return contentMap[currentPath];
};

const FooterContent = ({ queryPath }: { queryPath: CatalogSection }) => {
  const footerMap: Record<CatalogSection, React.ReactNode> = {
    types: (
      <div className='flex flex-col w-full'>
        <CreateNewObjectButton variant={'outline'} />
        <ImportButtonForObjectTypes />
      </div>
    ),
    templates: (
      <div className='flex flex-col w-full'>
        <CreateNewTemplateButton variant={'outline'} />
        <ImportButtonForObjectTemplates />
      </div>
    ),
    associations: <CreateNewAssociation variant={'outline'} />,
  };

  return footerMap[queryPath];
};

const TypeDetails = ({ id }: { id: number }) => {
  const query = useObjectType(id);
  const { navigateRelative } = useScenarioSearchParamNavigation();

  return (
    <div className='p-6'>
      <Button
        variant='outline'
        onClick={() => navigateRelative('catalogue:types')}
        className='mb-4'
      >
        <ArrowLeft className='mr-2 h-4 w-4' /> Back to Types
      </Button>
      <StatusComponent<ObjectType> useQuery={query}>
        {data => <ObjectTypeOverview data={data!} />}
      </StatusComponent>
    </div>
  );
};

const TemplateDetails = ({ id }: { id: number }) => {
  const query = useObjectTemplate(id);
  const { navigateRelative } = useScenarioSearchParamNavigation();

  return (
    <div className='p-6'>
      <Button
        variant='outline'
        onClick={() => navigateRelative('catalogue:templates')}
        className='mb-4'
      >
        <ArrowLeft className='mr-2 h-4 w-4' /> Back to Templates
      </Button>
      <StatusComponent<ObjectTemplate> useQuery={query}>
        {data => <ObjectTemplateOverview data={data!} />}
      </StatusComponent>
    </div>
  );
};

const AssociationDetails = ({ id }: { id: number }) => {
  const query = useAssociationType(id);
  const { navigateRelative } = useScenarioSearchParamNavigation();

  return (
    <div className='p-6'>
      <Button
        variant='outline'
        onClick={() => navigateRelative('catalogue:associations')}
        className='mb-4'
      >
        <ArrowLeft className='mr-2 h-4 w-4' /> Back to Associations
      </Button>
      <StatusComponent<AssociationType> useQuery={query}>
        {data => <AssociationTypeOverview data={data!} />}
      </StatusComponent>
    </div>
  );
};

const CatalogLayoutPathless = () => {
  const search = useSearch({
    // @ts-expect-error -- ts wrongly intercepts the type
    from: '/scenario/$scenarioId',
    strict: false,
  });

  const { navigateRelative } = useScenarioSearchParamNavigation();
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearch = useDebounce(searchText);

  const [_, section, id] = search.left!.split(':') as [
    string,
    CatalogSection,
    string | undefined,
  ];

  const queryFilter: QueryFilter = {
    searchType: 'findByTitle',
    searchValue: debouncedSearch,
  };

  const handleSelect = (selectedId: number) => {
    navigateRelative(`catalogue:${section}:${selectedId}`);
  };

  if (id) {
    const detailsMap = {
      types: <TypeDetails id={Number(id)} />,
      templates: <TemplateDetails id={Number(id)} />,
      associations: <AssociationDetails id={Number(id)} />,
    };
    return detailsMap[section];
  }

  return (
    <div className='min-h-screen flex-col relative overflow-hidden'>
      <SidebarProvider>
        <Sidebar collapsible='none' className='w-full h-screen bg-content2'>
          <CatalogHeader
            currentPath={section}
            search={searchText}
            setSearch={setSearchText}
          />
          <SidebarContent>
            <CatalogContent
              currentPath={section}
              queryFilter={queryFilter}
              onSelect={handleSelect}
            />
          </SidebarContent>
          <SidebarFooter className='h-24 flex flex-col justify-center border-t-1 border-default-300 items-center'>
            <FooterContent queryPath={section} />
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};

export default CatalogLayoutPathless;
