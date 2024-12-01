import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select.tsx';
import { usePaginationContext } from '@/lib/pagination/context/pagination-context.tsx';

const PageSizeSelect = () => {
  const { pageSize, setPageSize, aviablePageSizes } = usePaginationContext();

  return (
    <Select
      value={pageSize.toString()}
      onValueChange={value => setPageSize(Number(value))}
    >
      <SelectTrigger className='w-48'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {aviablePageSizes.map(size => (
          <SelectItem value={size.toString()} key={`pageSize-${size}`}>
            {size} records
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PageSizeSelect;
