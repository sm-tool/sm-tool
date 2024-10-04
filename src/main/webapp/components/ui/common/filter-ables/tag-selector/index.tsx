import { Checkbox } from '@/components/ui/shadcn/checkbox';
import SearchInput from '@/components/ui/common/search-ables/search-input';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area';
import useSearch from '@/hooks/use-search';

export type Tag = {
  name: string;
};

interface TagSelectorProperties {
  tags: Tag[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
}

export const TagSelector = ({
  tags,
  selectedTags,
  onTagToggle,
}: TagSelectorProperties) => {
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredTags,
  } = useSearch({ items: tags });

  return (
    <div className='w-full max-w-sm rounded-md border shadow-md'>
      <div className='p-4'>
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <ScrollArea>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
            {filteredTags.map(tag => (
              <div
                key={tag.name}
                className='flex w-8 items-center space-x-2 py-2'
              >
                <Checkbox
                  id={tag.name}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => onTagToggle(tag)}
                />
                <label
                  htmlFor={tag.name}
                  className='text-ellipsis text-sm leading-none'
                >
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
