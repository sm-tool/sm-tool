import { InputIconized } from '@/components/ui/shadcn/input';
import { Search } from 'lucide-react';

import { cn } from '@nextui-org/theme';

interface SearchInputProperties {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchInput = ({ value, onChange, className }: SearchInputProperties) => (
  <InputIconized
    type='text'
    placeholder='Search'
    value={value}
    onChange={event => onChange(event.target.value)}
    className={cn('rounded-full', className)}
  >
    <Search size={16} />
  </InputIconized>
);

export default SearchInput;
