import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/shadcn/side-bar.tsx';
import { Link, Outlet, useLocation } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs.tsx';
import SearchInput from '../../ui/common/input/search-input';
import { InfiniteList } from '@/lib/react-query/components/infinite-scroll';
import { useInfiniteObjectType } from '@/features/object-type/queries.ts';
import ObjectTypeCard from '@/features/object-type/components/object-type-card.tsx';
import { useDebounce } from '@/hooks/use-debounce.ts';
import React from 'react';
import { ObjectType } from '@/features/object-type/types.ts';
import { ObjectTemplate } from '@/features/object-template/types.ts';
import { useInfiniteObjectTemplate } from '@/features/object-template/queries.ts';
import ObjectTemplateCard from '@/features/object-template/components/object-template-card.tsx';
import { AssociationType } from '@/features/association-type/types.ts';
import { useInfiniteAssociationType } from '@/features/association-type/queries.ts';
import AssociationTypeCard from '@/features/association-type/components/association-type-card.tsx';
import { CreateNewObjectButton } from '@/app/home/_layout/catalog/_layout/types';
import { CreateNewTemplateButton } from '@/app/home/_layout/catalog/_layout/templates';
import { CreateNewAssociation } from '@/app/home/_layout/catalog/_layout/associations';
import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import { motion } from 'framer-motion';

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
}) => (
  <SidebarHeader className='h-fit gap-y-4 p-6'>
    <h1 className='mx-auto font-bold'>Scenario catalogue</h1>
    <Tabs defaultValue={currentPath}>
      <TabsList className='grid w-full grid-cols-3 ring-1 ring-default-300'>
        <TabsTrigger value='types' asChild>
          <Link to='/home/catalog/types'>Types</Link>
        </TabsTrigger>
        <TabsTrigger value='templates' asChild>
          <Link to='/home/catalog/templates'>Templates</Link>
        </TabsTrigger>
        <TabsTrigger value='associations' asChild>
          <Link to='/home/catalog/associations'>Associations</Link>
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

const ObjectsList = ({ queryFilter }: { queryFilter: QueryFilter }) => (
  <InfiniteList<ObjectType, 'qdsObjectTypes'>
    queryResult={useInfiniteObjectType({ filter: queryFilter })}
    loadingComponent={
      <div className='flex flex-col divide-y divide-content1'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='h-[92px] rounded-none' />
        ))}
      </div>
    }
  >
    {items => (
      <div className='space-y-2'>
        {items.map(item => (
          <Link
            to={`/home/catalog/types/$objectId`}
            key={item.id}
            params={{ objectId: item.id.toString() }}
          >
            <ObjectTypeCard objectType={item} />
          </Link>
        ))}
      </div>
    )}
  </InfiniteList>
);

const TemplatesList = ({ queryFilter }: { queryFilter: QueryFilter }) => (
  <InfiniteList<ObjectTemplate, 'qdsObjectTemplates'>
    queryResult={useInfiniteObjectTemplate({ filter: queryFilter })}
    loadingComponent={
      <div className='flex flex-col divide-y divide-content1'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='h-[92px] rounded-none' />
        ))}
      </div>
    }
  >
    {items => (
      <div className='space-y-2'>
        {items.map(item => (
          <Link
            to={`/home/catalog/templates/$templateId`}
            key={item.id}
            params={{ templateId: item.id.toString() }}
          >
            <ObjectTemplateCard objectTemplate={item} />
          </Link>
        ))}
      </div>
    )}
  </InfiniteList>
);

const AssociationsList = ({ queryFilter }: { queryFilter: QueryFilter }) => (
  <InfiniteList<AssociationType, 'qdsAssociationTypes'>
    loadingComponent={
      <div className='flex flex-col divide-y divide-content1'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='h-[92px] rounded-none' />
        ))}
      </div>
    }
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
          <Link
            to={`/home/catalog/associations/$associationId`}
            key={item.id}
            params={{ associationId: item.id.toString() }}
          >
            <AssociationTypeCard
              associationType={item}
              className='max-w-[30rem]'
            />
          </Link>
        ))}
      </div>
    )}
  </InfiniteList>
);

const CatalogContent = ({
  currentPath,
  queryFilter,
}: {
  currentPath: CatalogSection;
  queryFilter: QueryFilter;
}) => {
  const contentMap: Record<CatalogSection, React.ReactNode> = {
    types: <ObjectsList queryFilter={queryFilter} />,
    templates: <TemplatesList queryFilter={queryFilter} />,
    associations: <AssociationsList queryFilter={queryFilter} />,
  };

  return contentMap[currentPath];
};

const FooterContent = ({ queryPath }: { queryPath: CatalogSection }) => {
  const footerMap: Record<CatalogSection, React.ReactNode> = {
    types: <CreateNewObjectButton variant={'outline'} />,
    templates: <CreateNewTemplateButton variant={'outline'} />,
    associations: <CreateNewAssociation variant={'outline'} />,
  };

  return footerMap[queryPath];
};

const CatalogLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[3] as CatalogSection;
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search);
  const queryFilter: QueryFilter = {
    searchType: 'findByTitle',
    searchValue: debouncedSearch,
  };

  return (
    <div className='min-h-screen flex-col relative overflow-hidden'>
      <SidebarProvider>
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Sidebar collapsible='offcanvas' className='w-[30rem]'>
            <CatalogHeader
              currentPath={currentPath}
              search={search}
              setSearch={setSearch}
            />
            <SidebarContent>
              <CatalogContent
                currentPath={currentPath}
                queryFilter={queryFilter}
              />
            </SidebarContent>
            <SidebarFooter className='h-24 flex flex-col justify-center border-t-1 border-default-300 items-center'>
              <FooterContent queryPath={currentPath} />
            </SidebarFooter>
          </Sidebar>
        </motion.div>

        <main className='flex-1 bg-content2 h-screen overflow-hidden backdrop-blur-lg p-6'>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default CatalogLayout;
