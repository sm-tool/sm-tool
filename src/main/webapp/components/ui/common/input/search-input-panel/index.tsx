import { Skeleton } from '@/components/ui/shadcn/skeleton.tsx';
import React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/shadcn/command.tsx';
import { CommandLoading } from 'cmdk';
import { ArrowRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
}

interface SearchInputPanelProperties {
  value: string;
  onChange: (value: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  className?: string;
  isLoading?: boolean;
  shortcut?: string;
}

const SearchInputPanel = React.forwardRef<
  HTMLInputElement,
  SearchInputPanelProperties
>(
  (
    {
      value,
      onChange,
      onResultSelect,
      results = [],
      isLoading = false,
      shortcut,
    },
    reference,
  ) => {
    const handleBlur = (focusEvent: React.FocusEvent) => {
      if (
        !focusEvent.currentTarget.contains(focusEvent.relatedTarget as Node)
      ) {
        onChange('');
      }
    };

    return (
      <div className='relative w-full' onBlur={handleBlur}>
        <Command className='rounded-lg w-full'>
          <CommandInput
            ref={reference}
            value={value}
            onValueChange={onChange}
            placeholder='Find scenario elements'
            className='w-full'
          />
          {shortcut && (
            <CommandShortcut
              className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none h-5 select-none
                bg-content2 px-1.5 py-1 rounded text-xs'
            >
              {shortcut}
            </CommandShortcut>
          )}

          {value.length > 0 && (
            <div className='absolute top-full w-full mt-1 z-50'>
              <div className='rounded-lg border-divider border shadow-md w-full bg-content1'>
                <ScrollArea>
                  <CommandList className='max-h-[600px] min-h-0 flex flex-col'>
                    {!isLoading && results.length === 0 && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                    {!isLoading && (
                      <>
                        {results.some(r => r.id.startsWith('thread-')) && (
                          <CommandGroup heading='Threads' className='p-2'>
                            {results
                              .filter(r => r.id.startsWith('thread-'))
                              .map(result => (
                                <CommandItem
                                  key={result.id}
                                  onSelect={() => onResultSelect?.(result)}
                                  className='flex justify-between items-start px-4 py-3'
                                >
                                  <div className='flex-1'>
                                    <div className='text-base font-medium'>
                                      {result.title}
                                    </div>
                                    {result.description && (
                                      <div className='text-sm text-default-600 line-clamp-2'>
                                        {result.description}
                                      </div>
                                    )}
                                  </div>
                                  <ArrowRight className='h-4 w-4 ml-2 mt-1' />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        )}

                        {results.some(r => r.id.startsWith('object-')) && (
                          <CommandGroup heading='Objects' className='p-2'>
                            {results
                              .filter(r => r.id.startsWith('object-'))
                              .map(result => (
                                <CommandItem
                                  key={result.id}
                                  onSelect={() => onResultSelect?.(result)}
                                  className='flex justify-between items-center px-4 py-2'
                                >
                                  <div className='flex-1'>
                                    <span>{result.title}</span>
                                  </div>
                                  <ArrowRight className='h-4 w-4 ml-2' />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        )}
                      </>
                    )}
                    {isLoading && (
                      <CommandLoading>
                        <Skeleton className='w-full h-12 !rounded-none' />
                      </CommandLoading>
                    )}
                    <ScrollBar />
                  </CommandList>
                </ScrollArea>
              </div>
            </div>
          )}
        </Command>
      </div>
    );
  },
);

SearchInputPanel.displayName = 'SearchInputPanel';

export default SearchInputPanel;
