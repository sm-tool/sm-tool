import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/shadcn/button.tsx';

const R403 = () => (
  <div className={'h-screen flex items-center justify-center'}>
    <div className='flex items-start gap-6'>
      <h1 className='text-7xl text-yellow-600 underline'>403</h1>
      <div className='flex flex-col pt-2'>
        <p>You don&#39;t have permission to access this page</p>
        <Button
          variant='primary'
          asChild
          className='mt-4 bg-yellow-600 hover:bg-yellow-700'
        >
          <Link to='/home/scenarios'>Back to home</Link>
        </Button>
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/errors/403/')({
  component: R403,
});

export default R403;
