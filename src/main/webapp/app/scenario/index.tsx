import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/scenario/')({
  loader: () => {
    // @ts-expect-error -- ts is bad at dynamic pathing
    throw redirect({ to: '/scenario/description', throw: true });
  },
});
