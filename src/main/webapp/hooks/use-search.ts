import { useMemo, useState } from 'react';

interface Searchable {
  name: string;
}

interface UseSearchProperties<T extends Searchable> {
  items: T[];
}

const useSearch = <T extends Searchable>({ items }: UseSearchProperties<T>) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [items, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
  };
};

export default useSearch;
