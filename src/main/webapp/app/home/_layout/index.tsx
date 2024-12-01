import { createFileRoute } from '@tanstack/react-router';
import { IAuthService } from '@/lib/auth/types.ts';
import SearchInput from '@/components/ui/common/search-ables/search-input';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';
import CreateScenarioButton from '@/app/home/_layout/~components/create-scenario-button.tsx';
import useScenarioSearch from '@/app/home/_layout/~hooks/use-scenario-search.ts';
import Index from '@/app/home/_layout/~components/scenarios-table';

const HomePage = () => {
  const { searchValue, debouncedSearch, setSearchValue } = useScenarioSearch();

  return (
    <div className='flex flex-col items-center gap-y-12 size-full'>
      <div className='flex flex-col items-center gap-y-12'>
        <h1 className='font-bold text-3xl text-primary'>
          Welcome to Scenario modeling tool!
        </h1>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          placeholder={'Search scenarios'}
          className='bg-content1 min-w-96'
        />
        <DialogWrapper>
          <Index searchQuery={debouncedSearch} />
        </DialogWrapper>
      </div>
      <CreateScenarioButton />
    </div>
  );
};

export const Route = createFileRoute('/home/_layout/')({
  beforeLoad: async ({ context, location }) => {
    // @ts-expect-error -- TODO: poprawić typy na tanstack router
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO
    const authService: IAuthService = context.authClient;

    if (globalThis.location.hash.includes('session_state')) {
      return;
    }

    if (!(await authService.refreshAndAuthenticate())) {
      await authService.login(location.pathname);
    }
  },
  component: HomePage,
});
