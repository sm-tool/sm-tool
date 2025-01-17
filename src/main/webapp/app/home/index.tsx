import { createFileRoute } from '@tanstack/react-router';
import R404 from '@/app/errors/404';

export const Route = createFileRoute('/home/')({
  component: R404,
});
