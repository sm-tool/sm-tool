import { InputIconized, InputProperties } from '@/components/ui/shadcn/input';
import { Search } from 'lucide-react';

import { cn } from '@nextui-org/theme';

interface SearchInputProperties extends Omit<InputProperties, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchInput = ({
  value,
  onChange,
  className,
  ...properties
}: SearchInputProperties) => (
  <InputIconized
    type='text'
    placeholder='Search'
    value={value}
    onChange={event => onChange(event.target.value)}
    className={cn('rounded-full', className)}
    {...properties}
  >
    <Search size={16} />
  </InputIconized>
);

export default SearchInput;
