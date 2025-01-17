import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/shadcn/button.tsx';

const R404 = () => (
  <div className={'h-screen flex items-center justify-center'}>
    <div className='flex items-start gap-6'>
      <h1 className='text-7xl text-primary underline'>404</h1>
      <div className='flex flex-col pt-2'>
        <p>It looks like this page does not exists</p>
        <Button variant='primary' asChild className='mt-4'>
          <Link to='/home/scenarios'>Go back to main page</Link>
        </Button>
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/errors/404/')({
  component: R404,
});

export default R404;
