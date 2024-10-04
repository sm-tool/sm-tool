import { FormLabel } from '@/components/ui/shadcn/form';
import { cn } from '@nextui-org/theme';

function AutoFormLabel({
  label,
  isRequired,
  className,
}: {
  label: string;
  isRequired: boolean;
  className?: string;
}) {
  return (
    <>
      <FormLabel className={cn(className)}>
        {label}
        {isRequired && <span className='text-destructive'> *</span>}
      </FormLabel>
    </>
  );
}

export default AutoFormLabel;
