import { Alert, AlertDescription } from '@/components/ui/shadcn/alert.tsx';
import { Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/shadcn/card.tsx';
import { ErrorType } from '@/lib/react-query/components/infinite-scroll';

const Todo = ({ todo, error }: { todo: string; error: ErrorType }) => {
  const isProduction = globalThis.process.env.NODE_ENV === 'production';

  if (isProduction) {
    return (
      <Alert>
        <Construction className='h-4 w-4' />
        <AlertDescription>Under construction - coming soon!</AlertDescription>
      </Alert>
    );
  }

  console.log(error);
  return (
    <Card className='border-warning bg-warning/10'>
      <CardContent className='p-6'>
        <div className='flex items-center gap-2 text-warning'>
          <Construction className='h-5 w-5' />
          <p>TODO: {todo}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Todo;
