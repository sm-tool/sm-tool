import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/shadcn/button.tsx';

const R500 = () => (
  <div className={'h-screen flex items-center justify-center'}>
    <div className='flex items-start gap-6'>
      <h1 className='text-7xl text-danger underline'>500</h1>
      <div className='flex flex-col pt-2'>
        <p>Wystąpił błąd serwera, spróbuj ponownie później</p>
        <Button
          variant='primary'
          asChild
          className='mt-4 bg-danger hover:bg-danger-500'
        >
          <Link to='/home/scenarios'>Wróć na stronę główną</Link>
        </Button>
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/errors/500/')({
  component: R500,
});

export default R500;
