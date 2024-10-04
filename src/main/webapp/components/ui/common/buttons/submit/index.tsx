import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import useFormStore from '@/stores/form';

const SubmitButton = ({ formId }: { formId: string }) => {
  const pending = useFormStore(state => state.forms[formId]?.isSubmitting);

  return (
    <Button type='submit' variant='primary' aria-disabled={pending}>
      {pending ? (
        <div className='flex items-center justify-center'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          <p>Loading...</p>
        </div>
      ) : (
        <p>Submit </p>
      )}
    </Button>
  );
};

export default SubmitButton;
