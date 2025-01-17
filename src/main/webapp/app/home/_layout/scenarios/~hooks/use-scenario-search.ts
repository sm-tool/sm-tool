import { useDebounce } from '@/hooks/use-debounce.ts';
import React from 'react';

const useScenarioSearch = (initialValue: string = '') => {
  const [searchValue, setSearchValue] = React.useState(initialValue);
  const debouncedSearch = useDebounce(searchValue);

  return {
    searchValue,
    debouncedSearch,
    setSearchValue,
  };
};

export default useScenarioSearch;
